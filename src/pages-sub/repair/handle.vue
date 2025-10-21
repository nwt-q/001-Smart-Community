<!--
  订单处理
  功能：处理维修工单，支持派单/转单/退单/办结

  访问地址: http://localhost:9000/#/pages-sub/repair/handle
  建议携带参数: ?action=DISPATCH&repairId=REP_001&repairType=水电维修

  完整示例: http://localhost:9000/#/pages-sub/repair/handle?action=DISPATCH&repairId=REP_001&repairType=水电维修
-->

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '订单处理',
    enablePullDownRefresh: false,
  },
})
</script>

<template>
  <view class="repair-handle-page">
    <view class="p-4 text-center">
      <text class="text-lg text-gray-600">订单处理页面 - 占位符</text>
      <view class="mt-4">
        <text class="text-sm text-gray-400">此页面用于处理维修工单，支持派单/转单/退单/办结</text>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
