<!--
  订单处理
  功能：处理维修工单，支持派单/转单/退单/办结

  访问地址: http://localhost:9000/#/pages-sub/repair/handle
  建议携带参数: ?action=DISPATCH&repairId=REP_001&repairType=水电维修

  完整示例: http://localhost:9000/#/pages-sub/repair/handle?action=DISPATCH&repairId=REP_001&repairType=水电维修
-->

<script setup lang="ts">
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '订单处理',
    enablePullDownRefresh: false,
  },
})

/** 选择物品 - 模拟数据测试 */
function handleSelectResource() {
  TypedRouter.toSelectResource('1')
}

/** 提交处理 - 模拟数据测试 */
function handleSubmit() {
  uni.showToast({
    title: '处理成功',
    icon: 'success',
  })
  setTimeout(() => {
    TypedRouter.toRepairDispatch()
  }, 1500)
}
</script>

<template>
  <view class="repair-handle-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">订单处理页面</text>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="default" @click="handleSelectResource">
        选择物品
      </button>
      <button class="w-full" type="primary" @click="handleSubmit">
        提交处理
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于处理维修工单，支持派单/转单/退单/办结</text>
    </view>
  </view>
</template>

<style scoped></style>
