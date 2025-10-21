<!--
  回访工单
  功能：回访维修工单，收集用户评价

  访问地址: http://localhost:9000/#/pages-sub/repair/appraise
  建议携带参数: ?repairId=REP_001&repairType=水电维修

  完整示例: http://localhost:9000/#/pages-sub/repair/appraise?repairId=REP_001&repairType=水电维修
-->

<script setup lang="ts">
import { goBack } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '回访工单',
    enablePullDownRefresh: false,
  },
})

/** 提交回访 - 模拟数据测试 */
function handleSubmitAppraise() {
  uni.showToast({
    title: '回访成功',
    icon: 'success',
  })
  setTimeout(() => {
    goBack()
  }, 1500)
}
</script>

<template>
  <view class="repair-appraise-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">回访工单页面</text>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="primary" @click="handleSubmitAppraise">
        提交回访
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于回访维修工单，收集用户评价</text>
    </view>
  </view>
</template>

<style scoped></style>
