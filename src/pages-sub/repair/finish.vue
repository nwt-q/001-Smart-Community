<!--
  维修已办
  功能：显示已完成的维修工单列表

  访问地址: http://localhost:9000/#/pages-sub/repair/finish
  建议携带参数: ?page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/finish?page=1&row=10
-->

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '维修已办',
    enablePullDownRefresh: true,
  },
})
</script>

<template>
  <view class="repair-finish-page">
    <view class="p-4 text-center">
      <text class="text-lg text-gray-600">维修已办页面 - 占位符</text>
      <view class="mt-4">
        <text class="text-sm text-gray-400">此页面用于显示已完成的维修工单列表</text>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
