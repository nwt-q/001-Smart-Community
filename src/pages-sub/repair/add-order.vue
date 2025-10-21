<!--
  添加维修记录
  功能：新增维修工单，支持选择楼栋/单元/房屋

  访问地址: http://localhost:9000/#/pages-sub/repair/add-order
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/repair/add-order?communityId=COMM_001
-->

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '添加维修记录',
    enablePullDownRefresh: false,
  },
})
</script>

<template>
  <view class="repair-add-order-page">
    <view class="p-4 text-center">
      <text class="text-lg text-gray-600">添加维修记录页面 - 占位符</text>
      <view class="mt-4">
        <text class="text-sm text-gray-400">此页面用于新增维修工单，支持选择楼栋/单元/房屋</text>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
