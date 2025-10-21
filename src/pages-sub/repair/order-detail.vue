<!--
  维修详情
  功能：显示维修工单详细信息

  访问地址: http://localhost:9000/#/pages-sub/repair/order-detail
  建议携带参数: ?repairId=REP_001&storeId=STORE_001

  完整示例: http://localhost:9000/#/pages-sub/repair/order-detail?repairId=REP_001&storeId=STORE_001
-->

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '维修详情',
    enablePullDownRefresh: false,
  },
})
</script>

<template>
  <view class="repair-order-detail-page">
    <view class="p-4 text-center">
      <text class="text-lg text-gray-600">维修详情页面 - 占位符</text>
      <view class="mt-4">
        <text class="text-sm text-gray-400">此页面用于显示维修工单的详细信息</text>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
