<!--
  维修已办
  功能：显示已完成的维修工单列表

  访问地址: http://localhost:9000/#/pages-sub/repair/finish
  建议携带参数: ?page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/finish?page=1&row=10
-->

<script setup lang="ts">
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '维修已办',
    enablePullDownRefresh: true,
  },
})

/** 查看工单详情 - 模拟数据测试 */
function handleGoToDetail() {
  TypedRouter.toRepairDetail('REP_001', 'STORE_001')
}
</script>

<template>
  <view class="repair-finish-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">维修已办页面</text>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="primary" @click="handleGoToDetail">
        查看工单详情
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于显示已完成的维修工单列表</text>
    </view>
  </view>
</template>

<style scoped></style>
