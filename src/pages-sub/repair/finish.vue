<!--
  维修已办单
  功能：显示已完成的维修工单列表

  访问地址: http://localhost:9000/#/pages-sub/repair/finish
  建议携带参数: ?page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/finish?page=1&row=10
-->

<script setup lang="ts">
import type { RepairOrder } from '@/types/repair'
import { ref } from 'vue'
import { getRepairFinishList } from '@/api/repair'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '维修已办单',
    enablePullDownRefresh: false,
  },
})

/** 列表数据 */
const repairList = ref<RepairOrder[]>([])
const pageSize = ref(15)

/** z-paging 组件引用 */
const pagingRef = ref()

/** 获取用户信息 */
const userInfo = getUserInfo()
const communityInfo = getCurrentCommunity()

/** 查询维修工单列表 */
async function queryList(pageNo: number, pageRow: number) {
  const { data } = await getRepairFinishList({
    page: pageNo,
    row: pageRow,
    userId: userInfo.userId || '',
    communityId: communityInfo.communityId || '',
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

/** 查看详情 */
function handleViewDetail(item: RepairOrder) {
  TypedRouter.toRepairDetail(item.repairId!, userInfo.storeId)
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
  <view class="repair-finish-page">
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
              <text class="text-gray-700">{{ item.stateName }}</text>
            </view>

            <!-- 报修内容 -->
            <view class="flex justify-between text-sm">
              <text class="text-gray-500">报修内容</text>
              <text class="text-gray-700">{{ item.context }}</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="mt-3 flex justify-end border-t border-gray-100 pt-2">
            <wd-button size="small" plain @click="handleViewDetail(item)">
              详情
            </wd-button>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <wd-status-tip image="content" tip="暂无已办工单" />
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.repair-finish-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.repair-card {
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}
</style>
