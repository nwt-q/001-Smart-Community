<!--
  维修待办单
  功能：显示待处理的维修工单列表

  访问地址: http://localhost:9000/#/pages-sub/repair/dispatch
  建议携带参数: ?page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/dispatch?page=1&row=10
-->

<script setup lang="ts">
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '维修待办单',
    enablePullDownRefresh: true,
  },
})

/** 查看工单详情 - 模拟数据测试 */
function handleGoToDetail() {
  TypedRouter.toRepairDetail('REP_001', 'STORE_001')
}

/** 转单 - 模拟数据测试 */
function handleTransfer() {
  TypedRouter.toRepairHandle({
    action: 'TRANSFER',
    repairId: 'REP_001',
    repairType: '水电维修',
  })
}

/** 办结工单 - 模拟数据测试 */
function handleFinish() {
  TypedRouter.toRepairHandle({
    action: 'FINISH',
    repairId: 'REP_001',
    repairType: '水电维修',
  })
}

/** 回访工单 - 模拟数据测试 */
function handleAppraise() {
  TypedRouter.toAppraiseRepair({
    repairId: 'REP_001',
    repairType: '水电维修',
    communityId: 'COMM_001',
  })
}
</script>

<template>
  <view class="repair-dispatch-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">维修待办单页面</text>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="primary" @click="handleGoToDetail">
        查看工单详情
      </button>
      <button class="w-full" type="default" @click="handleTransfer">
        转单
      </button>
      <button class="w-full" type="primary" @click="handleFinish">
        办结工单
      </button>
      <button class="w-full" type="default" @click="handleAppraise">
        回访工单
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于显示待处理的维修工单列表</text>
    </view>
  </view>
</template>

<style scoped></style>
