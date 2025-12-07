<!--
  维修工单池
  功能：显示维修工单列表，支持搜索和筛选

  访问地址: http://localhost:9000/#/pages-sub/repair/order-list
  建议携带参数: ?statusCd=10001&page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/order-list?statusCd=10001&page=1&row=10

  旧代码： gitee-example/pages/repairOrder/repairOrder.vue
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

/** 列表数据（由 z-paging 接管） */
const repairList = ref<RepairOrder[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
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

/** 查询维修工单列表请求（z-paging 集成） */
const { send: loadRepairOrderList } = useRequest(
  (params: { page: number, row: number, statusCd?: string }) =>
    getRepairOrderList({
      ...params,
      storeId: userInfo.storeId || '',
      userId: userInfo.userId || '',
      communityId: communityInfo.communityId || '',
      repairName: searchName.value,
      reqSource: 'mobile',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const response = event.data
    total.value = response?.total || 0
    pagingRef.value?.complete(response?.ownerRepairs || [], response?.total || 0)
  })
  .onError((error) => {
    console.error('加载列表失败:', error)
    pagingRef.value?.complete(false)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  })

/** z-paging 查询回调 */
function handleQuery(pageNo: number, pageSizeValue: number) {
  const selectedState = selectedStateIndex.value === 0
    ? ''
    : stateOptions.value[selectedStateIndex.value]?.value || ''

  currentPage.value = pageNo
  pageSize.value = pageSizeValue

  loadRepairOrderList({
    page: pageNo,
    row: pageSizeValue,
    statusCd: selectedState,
  })
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
    <z-paging
      ref="pagingRef"
      v-model="repairList"
      :default-page-size="pageSize"
      refresher-only
      @query="handleQuery"
    >
      <!-- 顶部吸顶工具栏 -->
      <template #top>
        <view class="toolbar">
          <view class="toolbar-row">
            <wd-search
              v-model="searchName"
              placeholder="输入报修人"
              :maxlength="20"
              hide-cancel-button
              clearable
              class="flex-1"
            />
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
            <wd-button type="success" size="small" @click="handleSearch">
              搜索
            </wd-button>
          </view>
          <view v-if="total > 0" class="toolbar-total">
            共 {{ total }} 条记录
          </view>
        </view>
      </template>

      <!-- 列表内容 -->
      <view class="repair-list">
        <view
          v-for="item in repairList"
          :key="item.repairId"
          class="repair-card"
        >
          <view class="card-header">
            <text class="id-text">{{ item.repairId }}</text>
            <text class="status-text">{{ item.statusName }}</text>
          </view>

          <view class="card-body">
            <view class="row">
              <text class="label">报修类型</text>
              <text class="value">{{ item.repairTypeName }}</text>
            </view>
            <view class="row">
              <text class="label">报修人</text>
              <text class="value">{{ item.repairName }} ({{ item.tel }})</text>
            </view>
            <view class="row">
              <text class="label">位置</text>
              <text class="value">{{ item.repairObjName }}</text>
            </view>
            <view class="row">
              <text class="label">预约时间</text>
              <text class="value">{{ formatAppointmentTime(item.appointmentTime) }}</text>
            </view>
            <view class="row">
              <text class="label">报修内容</text>
              <text class="value multiline">{{ item.context }}</text>
            </view>
          </view>

          <view class="card-actions">
            <wd-button size="small" plain @click="handleViewDetail(item)">
              详情
            </wd-button>
            <wd-button
              v-if="item.statusCd === '10001' && checkAuth('502019101946430010')"
              size="small"
              type="warning"
              @click="handleDispatch(item)"
            >
              派单
            </wd-button>
            <wd-button
              v-if="item.statusCd !== '10004' && item.statusCd !== '10005' && checkAuth('502019101946430010')"
              size="small"
              type="error"
              @click="handleEndRepair(item)"
            >
              结束
            </wd-button>
            <wd-button
              v-if="item.repairWay === '100' && item.statusCd === '10001' && checkAuth('502021012099350016')"
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
        <view class="empty-wrap">
          <wd-status-tip image="search" tip="暂无维修工单" />
        </view>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <view class="loading-wrap">
          <wd-loading />
        </view>
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.repair-order-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f5f5;
  padding: 12px 12px 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.toolbar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-total {
  margin-top: 6px;
  text-align: right;
  font-size: 12px;
  color: #607d8b;
}

.repair-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.repair-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f1f1;
  padding-bottom: 8px;
  margin-bottom: 10px;
}

.id-text {
  font-size: 14px;
  color: #263238;
  font-weight: 600;
}

.status-text {
  font-size: 13px;
  color: #26a69a;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.label {
  font-size: 13px;
  color: #607d8b;
  flex-shrink: 0;
}

.value {
  font-size: 14px;
  color: #263238;
  text-align: right;
  flex: 1;
}

.multiline {
  white-space: normal;
  text-align: right;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #f1f1f1;
  padding-top: 10px;
  margin-top: 8px;
}

.empty-wrap,
.loading-wrap {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
