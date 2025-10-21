<!--
  维修详情
  功能：显示维修工单详细信息

  访问地址: http://localhost:9000/#/pages-sub/repair/order-detail
  建议携带参数: ?repairId=REP_001&storeId=STORE_001

  完整示例: http://localhost:9000/#/pages-sub/repair/order-detail?repairId=REP_001&storeId=STORE_001
-->

<script setup lang="ts">
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '维修详情',
    enablePullDownRefresh: false,
  },
})

/** 回复评价 - 模拟数据测试 */
function handleReplyAppraise() {
  TypedRouter.toReplyAppraise('RU_001', 'REP_001')
}
</script>

<template>
  <view class="repair-order-detail-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">维修详情页面</text>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="primary" @click="handleReplyAppraise">
        回复评价
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于显示维修工单的详细信息</text>
    </view>
  </view>
</template>

<style scoped></style>
