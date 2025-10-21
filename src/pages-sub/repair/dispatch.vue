<!--
  维修待办单
  功能：显示待处理的维修工单列表

  访问地址: http://localhost:9000/#/pages-sub/repair/dispatch
  建议携带参数: ?page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/dispatch?page=1&row=10
-->

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '维修待办单',
    enablePullDownRefresh: true,
  },
})
</script>

<template>
  <view class="repair-dispatch-page">
    <view class="p-4 text-center">
      <text class="text-lg text-gray-600">维修待办单页面 - 占位符</text>
      <view class="mt-4">
        <text class="text-sm text-gray-400">此页面用于显示待处理的维修工单列表</text>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
