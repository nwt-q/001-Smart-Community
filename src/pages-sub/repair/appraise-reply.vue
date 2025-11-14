<!--
  回复评价
  功能：物业回复用户的维修评价

  访问地址: http://localhost:9000/#/pages-sub/repair/appraise-reply
  建议携带参数: ?ruId=RU_001&repairId=REP_001

  完整示例: http://localhost:9000/#/pages-sub/repair/appraise-reply?ruId=RU_001&repairId=REP_001
-->

<script setup lang="ts">
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { replyAppraise } from '@/api/repair'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '回复评价',
    enablePullDownRefresh: false,
  },
})

/** 页面参数 */
const ruId = ref('')
const repairId = ref('')

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 回复内容 */
const replyContent = ref('')

/** 提交回复请求 */
const { send: submitReply, onSuccess: onReplySuccess, onError: onReplyError } = useRequest(
  (params: {
    ruId: string
    repairId: string
    reply: string
    communityId: string
  }) => replyAppraise(params),
  { immediate: false },
)

onReplySuccess(() => {
  uni.hideLoading()
  uni.showToast({
    title: '回复成功',
    icon: 'success',
  })

  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
})

onReplyError((error) => {
  uni.hideLoading()
  uni.showToast({
    title: error.error || '回复失败',
    icon: 'none',
  })
})

/** 页面加载 */
onLoad((options) => {
  ruId.value = (options?.ruId as string) || ''
  repairId.value = (options?.repairId as string) || ''
})

/** 提交回复 */
async function handleSubmitReply() {
  if (!replyContent.value.trim()) {
    uni.showToast({
      title: '请输入回复说明',
      icon: 'none',
    })
    return
  }

  uni.showLoading({ title: '提交中...' })

  await submitReply({
    ruId: ruId.value,
    repairId: repairId.value,
    reply: replyContent.value,
    communityId: communityInfo.communityId,
  })
}
</script>

<template>
  <view class="reply-appraise-page">
    <!-- 回复说明 -->
    <view class="bg-white p-3">
      <view class="mb-2 text-sm font-bold">
        回复说明
      </view>
      <wd-textarea
        v-model="replyContent"
        placeholder="请输入回复说明"
        :maxlength="200"
        show-word-limit
        :rows="6"
      />
    </view>

    <!-- 提交按钮 -->
    <view class="mt-6 px-3">
      <wd-button
        block
        type="success"
        size="large"
        :disabled="!replyContent.trim()"
        @click="handleSubmitReply"
      >
        提交
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.reply-appraise-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 12px;
}
</style>
