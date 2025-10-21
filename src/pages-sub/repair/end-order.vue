<!--
  结束订单
  功能：结束维修工单

  访问地址: http://localhost:9000/#/pages-sub/repair/end-order
  建议携带参数: ?repairId=REP_001&communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/repair/end-order?repairId=REP_001&communityId=COMM_001
-->

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '结束订单',
    enablePullDownRefresh: false,
  },
})
</script>

<template>
  <view class="repair-end-order-page">
    <view class="p-4 text-center">
      <text class="text-lg text-gray-600">结束订单页面 - 占位符</text>
      <view class="mt-4">
        <text class="text-sm text-gray-400">此页面用于结束维修工单</text>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
