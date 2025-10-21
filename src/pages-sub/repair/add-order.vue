<!--
  添加维修记录
  功能：新增维修工单，支持选择楼栋/单元/房屋

  访问地址: http://localhost:9000/#/pages-sub/repair/add-order
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/repair/add-order?communityId=COMM_001
-->

<script setup lang="ts">
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '添加维修记录',
    enablePullDownRefresh: false,
  },
})

/** 提交后返回工单列表 - 模拟数据测试 */
function handleSubmit() {
  uni.showToast({
    title: '提交成功',
    icon: 'success',
  })
  setTimeout(() => {
    TypedRouter.toRepairList()
  }, 1500)
}
</script>

<template>
  <view class="repair-add-order-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">添加维修记录页面</text>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="primary" @click="handleSubmit">
        提交维修记录
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于新增维修工单，支持选择楼栋/单元/房屋</text>
    </view>
  </view>
</template>

<style scoped></style>
