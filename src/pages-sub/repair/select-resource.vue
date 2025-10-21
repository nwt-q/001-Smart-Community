<!--
  选择物品
  功能：选择维修所需的物品/资源

  访问地址: http://localhost:9000/#/pages-sub/repair/select-resource
  建议携带参数: ?feeFlag=1

  完整示例: http://localhost:9000/#/pages-sub/repair/select-resource?feeFlag=1
-->

<script setup lang="ts">
import { goBack } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '选择物品',
    enablePullDownRefresh: false,
  },
})

/** 确认选择 - 模拟数据测试 */
function handleConfirm() {
  uni.showToast({
    title: '选择成功',
    icon: 'success',
  })
  setTimeout(() => {
    goBack()
  }, 1000)
}

/** 取消选择 */
function handleCancel() {
  goBack()
}
</script>

<template>
  <view class="repair-select-resource-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">选择物品页面</text>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="primary" @click="handleConfirm">
        确认选择
      </button>
      <button class="w-full" type="default" @click="handleCancel">
        取消
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于选择维修所需的物品/资源</text>
    </view>
  </view>
</template>

<style scoped></style>
