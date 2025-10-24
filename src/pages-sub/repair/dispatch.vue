<!--
  维修待办单
  功能：显示待处理的维修工单列表

  访问地址: http://localhost:9000/#/pages-sub/repair/dispatch
  建议携带参数: ?page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/dispatch?page=1&row=10
-->

<script setup lang="ts">
import type { RepairOrder } from '@/types/repair'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { useMessage } from 'wot-design-uni'
import { getRepairStaffList, getRepairStates, repairStart, repairStop } from '@/api/repair'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '维修待办单',
    enablePullDownRefresh: false,
  },
})

const message = useMessage()

/** 搜索条件 */
const searchName = ref('')
const selectedStateIndex = ref(0)
const stateOptions = ref<Array<{ label: string, value: string }>>([
  { label: '请选择', value: '' },
])

/** 列表数据 */
const repairList = ref<RepairOrder[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)

/** z-paging 组件引用 */
const pagingRef = ref()

/** 暂停弹窗 */
const showStopModal = ref(false)
const stopReason = ref('')
const currentStopItem = ref<RepairOrder | null>(null)

/** 获取用户信息 */
const userInfo = getUserInfo()
const communityInfo = getCurrentCommunity()

/** 加载维修状态字典 */
const { send: loadStates } = useRequest(() => getRepairStates(), {
  immediate: true,
})
  .onSuccess((result) => {
    if (result.length > 0) {
      stateOptions.value = [
        { label: '请选择', value: '' },
        ...result.map(item => ({
          label: item.name || '',
          value: item.statusCd || '',
        })),
      ]
    }
  })
  .onError((error) => {
    console.error('加载状态字典失败:', error)
  })

/** 查询维修工单列表 */
async function queryList(pageNo: number, pageRow: number) {
  const selectedState = selectedStateIndex.value === 0
    ? ''
    : stateOptions.value[selectedStateIndex.value]?.value || ''

  const { data } = await getRepairStaffList({
    page: pageNo,
    row: pageRow,
    userId: userInfo.userId || '',
    communityId: communityInfo.communityId || '',
    repairName: searchName.value,
    state: selectedState,
  })

  return {
    list: data.ownerRepairs || [],
    total: data.total || 0,
  }
}

/** z-paging 查询回调 */
async function handleQuery(pageNo: number, pageSize: number) {
  try {
    const result = await queryList(pageNo, pageSize)
    total.value = result.total
    pagingRef.value?.complete(result.list)
  }
  catch (error) {
    console.error('加载列表失败:', error)
    pagingRef.value?.complete(false)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
}

/** 搜索 */
function handleSearch() {
  pagingRef.value?.reload()
}

/** 状态选择器改变 */
function handleStateChange({ value }: { value: number }) {
  selectedStateIndex.value = value
}

/** 查看详情 */
function handleViewDetail(item: RepairOrder) {
  TypedRouter.toRepairDetail(item.repairId!, userInfo.storeId)
}

/** 启动维修 */
async function handleStartRepair(item: RepairOrder) {
  message.confirm({
    title: '提示',
    msg: '确认启动报修？',
  }).then(async () => {
    try {
      await repairStart({
        communityId: item.communityId!,
        repairId: item.repairId!,
        repairType: item.repairType || '',
      })

      uni.showToast({
        title: '启动成功',
        icon: 'success',
      })

      // 刷新列表
      setTimeout(() => {
        pagingRef.value?.reload()
      }, 1000)
    }
    catch (error) {
      uni.showToast({
        title: (error as Error)?.message || '启动失败',
        icon: 'none',
      })
    }
  }).catch(() => {
    // 用户取消
  })
}

/** 转单 */
function handleTransfer(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'TRANSFER',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
    publicArea: item.publicArea,
    repairChannel: item.repairChannel,
  })
}

/** 暂停维修 */
function handleStopRepair(item: RepairOrder) {
  currentStopItem.value = item
  stopReason.value = ''
  showStopModal.value = true
}

/** 确认暂停 */
async function handleConfirmStop() {
  if (!stopReason.value.trim()) {
    uni.showToast({
      title: '请填写暂停原因',
      icon: 'none',
    })
    return
  }

  if (!currentStopItem.value)
    return

  try {
    await repairStop({
      communityId: currentStopItem.value.communityId!,
      remark: stopReason.value,
      repairId: currentStopItem.value.repairId!,
      repairType: currentStopItem.value.repairType || '',
    })

    showStopModal.value = false
    uni.showToast({
      title: '暂停成功',
      icon: 'success',
    })

    // 刷新列表
    setTimeout(() => {
      pagingRef.value?.reload()
    }, 1000)
  }
  catch (error) {
    uni.showToast({
      title: (error as Error)?.message || '暂停失败',
      icon: 'none',
    })
  }
}

/** 退单 */
function handleReturn(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'RETURN',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
    publicArea: item.publicArea,
    repairChannel: item.repairChannel,
  })
}

/** 办结 */
function handleFinish(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'FINISH',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
    publicArea: item.publicArea,
    repairChannel: item.repairChannel,
  })
}

/** 回访 */
function handleAppraise(item: RepairOrder) {
  TypedRouter.toAppraiseRepair({
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
    repairChannel: item.repairChannel,
    publicArea: item.publicArea,
    communityId: item.communityId!,
  })
}

/** 检查权限 */
function checkAuth(privilegeId: string): boolean {
  // TODO: 实现权限检查逻辑
  return true
}

/** 格式化预约时间 */
function formatAppointmentTime(timeStr?: string): string {
  if (!timeStr)
    return ''
  try {
    const date = new Date(timeStr.replace(/-/g, '/'))
    return `${date.getMonth() + 1}-${date.getDate()}`
  }
  catch {
    return timeStr
  }
}
</script>

<template>
  <view class="repair-dispatch-page">
    <!-- 搜索栏 -->
    <view class="search-bar flex items-center gap-2 bg-white px-3 py-2">
      <!-- 报修人搜索 -->
      <wd-search
        v-model="searchName"
        placeholder="输入报修人"
        :maxlength="20"
        hide-cancel-button
        class="flex-1"
      />

      <!-- 状态筛选 -->
      <wd-picker
        v-model="selectedStateIndex"
        :columns="stateOptions"
        label-key="label"
        value-key="value"
        @confirm="handleStateChange"
      >
        <wd-button custom-class="!px-3" size="small" type="primary">
          {{ stateOptions[selectedStateIndex]?.label || '状态' }}
        </wd-button>
      </wd-picker>

      <!-- 搜索按钮 -->
      <wd-button type="success" size="small" @click="handleSearch">
        搜索
      </wd-button>
    </view>

    <!-- 列表 -->
    <z-paging
      ref="pagingRef"
      v-model="repairList"
      :default-page-size="pageSize"
      @query="handleQuery"
    >
      <view class="repair-list px-3 pt-3">
        <view
          v-for="item in repairList"
          :key="item.repairId"
          class="repair-card mb-3 rounded bg-white p-3 shadow-sm"
        >
          <!-- 工单号和电话 -->
          <view class="flex items-center justify-between border-b border-gray-100 pb-2">
            <text class="text-sm">{{ item.repairId }}</text>
            <text class="text-sm text-gray-500">{{ item.tel }}</text>
          </view>

          <!-- 工单信息 -->
          <view class="mt-2 space-y-1">
            <!-- 报修类型 -->
            <view class="flex justify-between text-sm">
              <text class="text-gray-500">报修类型</text>
              <text class="text-gray-700">{{ item.repairTypeName }}</text>
            </view>

            <!-- 报修人 -->
            <view class="flex justify-between text-sm">
              <text class="text-gray-500">报修人</text>
              <text class="text-gray-700">{{ item.repairName }}</text>
            </view>

            <!-- 位置 -->
            <view class="flex justify-between text-sm">
              <text class="text-gray-500">位置</text>
              <text class="text-gray-700">{{ item.repairObjName }}</text>
            </view>

            <!-- 预约时间 -->
            <view class="flex justify-between text-sm">
              <text class="text-gray-500">预约时间</text>
              <text class="text-gray-700">{{ formatAppointmentTime(item.appointmentTime) }}</text>
            </view>

            <!-- 状态 -->
            <view class="flex justify-between text-sm">
              <text class="text-gray-500">状态</text>
              <text class="text-gray-700">
                {{ item.stateName }}
                <text v-if="item.state === '1800' && (item.returnVisitFlag === '001' || item.returnVisitFlag === '002')">
                  (定时任务处理)
                </text>
              </text>
            </view>

            <!-- 报修内容 -->
            <view class="flex justify-between text-sm">
              <text class="text-gray-500">报修内容</text>
              <text class="text-gray-700">{{ item.context }}</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-2">
            <!-- 详情按钮 -->
            <wd-button size="small" plain @click="handleViewDetail(item)">
              详情
            </wd-button>

            <!-- 启动按钮 -->
            <wd-button
              v-if="item.state === '2001'"
              size="small"
              type="success"
              @click="handleStartRepair(item)"
            >
              启动
            </wd-button>

            <!-- 转单按钮 -->
            <wd-button
              v-if="item.state === '1100' || item.state === '1200' || item.state === '1300'"
              size="small"
              type="warning"
              @click="handleTransfer(item)"
            >
              转单
            </wd-button>

            <!-- 暂停按钮 -->
            <wd-button
              v-if="item.state === '1100' || item.state === '1200' || item.state === '1300'"
              size="small"
              type="warning"
              @click="handleStopRepair(item)"
            >
              暂停
            </wd-button>

            <!-- 退单按钮 -->
            <wd-button
              v-if="item.preStaffId !== '-1'"
              size="small"
              type="error"
              @click="handleReturn(item)"
            >
              退单
            </wd-button>

            <!-- 办结按钮 -->
            <wd-button
              v-if="item.state === '1100' || item.state === '1200' || item.state === '1300'"
              size="small"
              type="success"
              @click="handleFinish(item)"
            >
              办结
            </wd-button>

            <!-- 回访按钮 -->
            <wd-button
              v-if="item.state === '1800' && item.returnVisitFlag === '003' && checkAuth('502021040151320003')"
              size="small"
              type="success"
              @click="handleAppraise(item)"
            >
              回访
            </wd-button>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <wd-status-tip image="search" tip="暂无待办工单" />
      </template>
    </z-paging>

    <!-- 暂停原因弹窗 -->
    <wd-popup v-model="showStopModal" position="center" closable>
      <view class="stop-modal p-6" style="width: 80vw;">
        <view class="mb-4 text-center text-lg font-bold">
          暂停原因
        </view>
        <wd-textarea
          v-model="stopReason"
          placeholder="请填写暂停原因"
          :maxlength="200"
          show-word-limit
          :rows="4"
        />
        <view class="mt-4 flex gap-3">
          <wd-button block @click="showStopModal = false">
            取消
          </wd-button>
          <wd-button block type="primary" @click="handleConfirmStop">
            确定
          </wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<style lang="scss" scoped>
.repair-dispatch-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.repair-card {
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}
</style>
