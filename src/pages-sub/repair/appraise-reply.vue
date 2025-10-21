<!--
  回复评价
  功能：物业回复用户的维修评价

  访问地址: http://localhost:9000/#/pages-sub/repair/appraise-reply
  建议携带参数: ?ruId=RU_001&repairId=REP_001

  完整示例: http://localhost:9000/#/pages-sub/repair/appraise-reply?ruId=RU_001&repairId=REP_001
-->

<script setup lang="ts">
import { goBack } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '回复评价',
    enablePullDownRefresh: false,
  },
})

/** 提交回复 - 模拟数据测试 */
function handleSubmitReply() {
  uni.showToast({
    title: '回复成功',
    icon: 'success',
  })
  setTimeout(() => {
    goBack()
  }, 1500)
}
</script>

<template>
  <view class="repair-appraise-reply-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">回复评价页面</text>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="primary" @click="handleSubmitReply">
        提交回复
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于物业回复用户的维修评价</text>
    </view>
  </view>
</template>

<style scoped></style>
