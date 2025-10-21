<!--
  维修工单池
  功能：显示维修工单列表，支持搜索和筛选

  访问地址: http://localhost:9000/#/pages-sub/repair/order-list
  建议携带参数: ?status=PENDING&page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/order-list?status=PENDING&page=1&row=10
-->

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '维修工单池',
    enablePullDownRefresh: true,
  },
})
</script>

<template>
  <view class="repair-order-list-page">
    <view class="p-4 text-center">
      <text class="text-lg text-gray-600">维修工单池页面 - 占位符</text>
      <view class="mt-4">
        <text class="text-sm text-gray-400">此页面用于显示维修工单列表，支持搜索和筛选功能</text>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
