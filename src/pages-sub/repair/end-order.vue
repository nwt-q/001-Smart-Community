<!--
  结束订单
  功能：结束维修工单

  访问地址: http://localhost:9000/#/pages-sub/repair/end-order
  建议携带参数: ?repairId=REP_001&communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/repair/end-order?repairId=REP_001&communityId=COMM_001
-->

<script setup lang="ts">
import { goBack } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '结束订单',
    enablePullDownRefresh: false,
  },
})

/** 确认结束 - 模拟数据测试 */
function handleConfirmEnd() {
  uni.showToast({
    title: '订单已结束',
    icon: 'success',
  })
  setTimeout(() => {
    goBack()
  }, 1500)
}

/** 取消 */
function handleCancel() {
  goBack()
}
</script>

<template>
  <view class="repair-end-order-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">结束订单页面</text>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="warn" @click="handleConfirmEnd">
        确认结束订单
      </button>
      <button class="w-full" type="default" @click="handleCancel">
        取消
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于结束维修工单</text>
    </view>
  </view>
</template>

<style scoped></style>
