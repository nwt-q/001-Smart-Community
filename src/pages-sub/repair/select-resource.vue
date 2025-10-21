<!--
  选择物品
  功能：选择维修所需的物品/资源

  访问地址: http://localhost:9000/#/pages-sub/repair/select-resource
  建议携带参数: ?feeFlag=1

  完整示例: http://localhost:9000/#/pages-sub/repair/select-resource?feeFlag=1
-->

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '选择物品',
    enablePullDownRefresh: false,
  },
})
</script>

<template>
  <view class="repair-select-resource-page">
    <view class="p-4 text-center">
      <text class="text-lg text-gray-600">选择物品页面 - 占位符</text>
      <view class="mt-4">
        <text class="text-sm text-gray-400">此页面用于选择维修所需的物品/资源</text>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
