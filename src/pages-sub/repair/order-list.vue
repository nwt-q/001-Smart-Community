<!--
  维修工单池
  功能：显示维修工单列表，支持搜索和筛选

  访问地址: http://localhost:9000/#/pages-sub/repair/order-list
  建议携带参数: ?status=PENDING&page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/order-list?status=PENDING&page=1&row=10
-->

<script setup lang="ts">
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '维修工单池',
    enablePullDownRefresh: true,
  },
})

/** 查看工单详情 - 模拟数据测试 */
function handleGoToDetail() {
  TypedRouter.toRepairDetail('REP_001', 'STORE_001')
}

/** 派单 - 模拟数据测试 */
function handleDispatch() {
  TypedRouter.toRepairHandle({
    action: 'DISPATCH',
    repairId: 'REP_001',
    repairType: '水电维修',
  })
}

/** 结束订单 - 模拟数据测试 */
function handleEndOrder() {
  TypedRouter.toEndRepair('REP_001', 'COMM_001')
}
</script>

<template>
  <view class="repair-order-list-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">维修工单池页面</text>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="primary" @click="handleGoToDetail">
        查看工单详情
      </button>
      <button class="w-full" type="primary" @click="handleDispatch">
        派单处理
      </button>
      <button class="w-full" type="warn" @click="handleEndOrder">
        结束订单
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于显示维修工单列表，支持搜索和筛选功能</text>
    </view>
  </view>
</template>

<style scoped></style>
