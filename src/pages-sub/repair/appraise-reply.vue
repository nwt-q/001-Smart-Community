<!--
  回复评价
  功能：物业回复用户的维修评价

  访问地址: http://localhost:9000/#/pages-sub/repair/appraise-reply
  建议携带参数: ?ruId=RU_001&repairId=REP_001

  完整示例: http://localhost:9000/#/pages-sub/repair/appraise-reply?ruId=RU_001&repairId=REP_001
-->

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '回复评价',
    enablePullDownRefresh: false,
  },
})
</script>

<template>
  <view class="repair-appraise-reply-page">
    <view class="p-4 text-center">
      <text class="text-lg text-gray-600">回复评价页面 - 占位符</text>
      <view class="mt-4">
        <text class="text-sm text-gray-400">此页面用于物业回复用户的维修评价</text>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
