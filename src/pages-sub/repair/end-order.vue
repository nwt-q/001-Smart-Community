<!--
  结束维修工单
  功能：输入结束原因并结束工单

  访问地址: http://localhost:9000/#/pages-sub/repair/end-order
  建议携带参数: ?repairId=REP_001&communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/repair/end-order?repairId=REP_001&communityId=COMM_001
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { endRepair } from '@/api/repair'

definePage({
  style: {
    navigationBarTitleText: '结束工单',
    enablePullDownRefresh: false,
  },
})

/** 页面参数 */
const repairId = ref('')
const communityId = ref('')

/** 结束原因 */
const content = ref('')

/** 页面加载 */
onLoad((options) => {
  repairId.value = (options?.repairId as string) || ''
  communityId.value = (options?.communityId as string) || ''
})

/** 结束工单 */
async function handleEndRepair() {
  if (!content.value.trim()) {
    uni.showToast({
      title: '请输入结束原因',
      icon: 'none',
    })
    return
  }

  try {
    uni.showLoading({ title: '处理中...' })

    await endRepair({
      repairId: repairId.value,
      communityId: communityId.value,
      context: content.value,
    })

    uni.hideLoading()
    uni.showToast({
      title: '工单已结束',
      icon: 'success',
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
  catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: (error as Error)?.message || '结束失败',
      icon: 'none',
    })
  }
}
</script>

<template>
  <view class="end-repair-page">
    <!-- 结束原因 -->
    <view class="bg-white p-3">
      <view class="mb-2 text-sm font-bold">
        结束原因
      </view>
      <wd-textarea
        v-model="content"
        placeholder="请输入结束原因，比如缺材料"
        :maxlength="500"
        show-word-limit
        :rows="6"
      />
    </view>

    <!-- 结束按钮 -->
    <view class="mt-6 px-3">
      <wd-button
        block
        type="primary"
        size="large"
        :disabled="!content.trim()"
        @click="handleEndRepair"
      >
        结束工单
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.end-repair-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 12px;
}
</style>
