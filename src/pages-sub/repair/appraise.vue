<!--
  回访工单
  功能：回访维修工单，收集用户评价

  访问地址: http://localhost:9000/#/pages-sub/repair/appraise
  建议携带参数: ?repairId=REP_001&repairType=水电维修

  完整示例: http://localhost:9000/#/pages-sub/repair/appraise?repairId=REP_001&repairType=水电维修
-->

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '回访工单',
    enablePullDownRefresh: false,
  },
})
</script>

<template>
  <view class="repair-appraise-page">
    <view class="p-4 text-center">
      <text class="text-lg text-gray-600">回访工单页面 - 占位符</text>
      <view class="mt-4">
        <text class="text-sm text-gray-400">此页面用于回访维修工单，收集用户评价</text>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
