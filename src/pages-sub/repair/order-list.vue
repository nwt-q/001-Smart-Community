<!--
  维修工单池
  功能：显示维修工单列表，支持搜索和筛选

  访问地址: http://localhost:9000/#/pages-sub/repair/order-list
  建议携带参数: ?status=PENDING&page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/order-list?status=PENDING&page=1&row=10
-->

<script setup lang="ts">
import type { RepairOrder } from '@/types/repair'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getRepairOrderList, getRepairStates, robRepairOrder } from '@/api/repair'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '维修工单池',
    enablePullDownRefresh: false,
  },
})

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
const finished = ref(false)

/** z-paging 组件引用 */
const pagingRef = ref()

/** 获取用户信息 */
const userInfo = getUserInfo()
const communityInfo = getCurrentCommunity()

/** 加载维修状态字典 */
const { send: loadStates } = useRequest(() => getRepairStates(), {
  immediate: false,
})
  .onSuccess((event) => {
    const result = event.data
    if (result && result.length > 0) {
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

/** 查询维修工单列表请求 */
const { send: loadRepairOrderList } = useRequest(
  (params: { page: number, row: number, state?: string }) => getRepairOrderList({
    ...params,
    storeId: userInfo.storeId || '',
    userId: userInfo.userId || '',
    communityId: communityInfo.communityId || '',
    repairName: searchName.value,
    reqSource: 'mobile',
  }),
  { immediate: false },
)

/** 查询维修工单列表 */
async function queryList(pageNo: number, pageRow: number) {
  const selectedState = selectedStateIndex.value === 0
    ? ''
    : stateOptions.value[selectedStateIndex.value]?.value || ''

  const response = await loadRepairOrderList({
    page: pageNo,
    row: pageRow,
    state: selectedState,
  })

  return {
    list: response.ownerRepairs || [],
    total: response.total || 0,
  }
}

/** z-paging 查询回调 */
async function handleQuery(pageNo: number, pageSize: number) {
  try {
    const result = await queryList(pageNo, pageSize)
    total.value = result.total

    // 通知 z-paging 数据加载完成
    pagingRef.value?.complete(result.list)
  }
  catch (error) {
    console.error('加载列表失败:', error)
    // 通知 z-paging 加载失败
    pagingRef.value?.complete(false)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
}

/** 搜索 */
function handleSearch() {
  // 重置到第一页并刷新
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

/** 派单 */
function handleDispatch(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'DISPATCH',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
  })
}

/** 结束工单 */
function handleEndRepair(item: RepairOrder) {
  TypedRouter.toEndRepair(item.repairId!, item.communityId)
}

/** 抢单 */
const { send: robOrder, onSuccess: onRobSuccess, onError: onRobError } = useRequest(
  (params: { repairId: string, staffId: string, staffName: string, communityId: string }) => robRepairOrder(params),
  { immediate: false },
)

onRobSuccess(() => {
  uni.hideLoading()
  uni.showToast({
    title: '抢单成功',
    icon: 'success',
  })

  // 延迟刷新列表
  setTimeout(() => {
    pagingRef.value?.reload()
  }, 1500)
})

onRobError((error) => {
  uni.hideLoading()
  uni.showToast({
    title: error.error || '抢单失败',
    icon: 'none',
  })
})

async function handleRobOrder(item: RepairOrder) {
  uni.showLoading({ title: '请稍候...' })

  await robOrder({
    repairId: item.repairId!,
    staffId: userInfo.userId || '',
    staffName: userInfo.userName || '',
    communityId: communityInfo.communityId || '',
  })
}

/** 检查权限 */
function checkAuth(privilegeId: string): boolean {
  // TODO: 实现权限检查逻辑
  // 暂时返回 true，后续接入实际权限系统
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
  <view class="repair-order-list-page">
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

    <!-- 总记录数 -->
    <view v-if="total > 0" class="px-3 py-2 text-right text-sm text-gray-600">
      共{{ total }}条记录
    </view>

    <!-- 列表 -->
    <z-paging
      ref="pagingRef"
      v-model="repairList"
      :default-page-size="pageSize"
      @query="handleQuery"
    >
      <view class="repair-list px-3">
        <view
          v-for="item in repairList"
          :key="item.repairId"
          class="repair-card mb-3 rounded bg-white p-3 shadow-sm"
        >
          <!-- 工单号和状态 -->
          <view class="flex items-center justify-between border-b border-gray-100 pb-2">
            <text class="text-sm">{{ item.repairId }}</text>
            <text class="text-sm text-gray-500">{{ item.stateName }}</text>
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
              <text class="text-gray-700">{{ item.repairName }}({{ item.tel }})</text>
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

            <!-- 派单按钮 -->
            <wd-button
              v-if="item.state === '1000' && checkAuth('502019101946430010')"
              size="small"
              type="warning"
              @click="handleDispatch(item)"
            >
              派单
            </wd-button>

            <!-- 结束按钮 -->
            <wd-button
              v-if="item.state !== '1700' && item.state !== '1800' && item.state !== '1900' && checkAuth('502019101946430010')"
              size="small"
              type="error"
              @click="handleEndRepair(item)"
            >
              结束
            </wd-button>

            <!-- 抢单按钮 -->
            <wd-button
              v-if="item.repairWay === '100' && item.state === '1000' && checkAuth('502021012099350016')"
              size="small"
              type="warning"
              @click="handleRobOrder(item)"
            >
              抢单
            </wd-button>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <wd-status-tip image="search" tip="暂无维修工单" />
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.repair-order-list-page {
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
