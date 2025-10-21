<!--
  维修工单评价页
  功能：业主对维修服务进行评分和评价

  访问地址: http://localhost:9000/#/pages-sub/repair/appraise
  建议携带参数: ?repairId=REP_001&repairType=水电维修&communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/repair/appraise?repairId=REP_001&repairType=水电维修&communityId=COMM_001
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { appraiseRepair } from '@/api/repair'
import { getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '评价维修',
    enablePullDownRefresh: false,
  },
})

/** 页面参数 */
const repairId = ref('')
const repairType = ref('')
const repairChannel = ref('')
const publicArea = ref('')
const communityId = ref('')

/** 用户信息 */
const userInfo = getUserInfo()

/** 评分 */
const rating = ref(5)

/** 评价内容 */
const content = ref('')

/** 页面加载 */
onLoad((options) => {
  repairId.value = (options?.repairId as string) || ''
  repairType.value = (options?.repairType as string) || ''
  repairChannel.value = (options?.repairChannel as string) || ''
  publicArea.value = (options?.publicArea as string) || ''
  communityId.value = (options?.communityId as string) || ''
})

/** 提交评价 */
async function handleSubmit() {
  if (!content.value.trim()) {
    uni.showToast({
      title: '请填写回访建议',
      icon: 'none',
    })
    return
  }

  try {
    uni.showLoading({ title: '提交中...' })

    await appraiseRepair({
      repairId: repairId.value,
      repairType: repairType.value,
      repairChannel: repairChannel.value,
      publicArea: publicArea.value,
      communityId: communityId.value,
      context: content.value,
    })

    uni.hideLoading()
    uni.showToast({
      title: '评价成功',
      icon: 'success',
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
  catch (error: any) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '提交失败',
      icon: 'none',
    })
  }
}
</script>

<template>
  <view class="appraise-page">
    <!-- 服务评分 -->
    <view class="mb-3 bg-white">
      <wd-cell-group border>
        <wd-cell title="服务评分" center>
          <template #value>
            <wd-rate v-model="rating" />
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 回访建议 -->
    <view class="bg-white p-3">
      <view class="mb-2 text-sm font-bold">
        回访建议
      </view>
      <wd-textarea
        v-model="content"
        placeholder="请填写您的回访建议"
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
        :disabled="!content.trim()"
        @click="handleSubmit"
      >
        提交
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.appraise-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 12px;
}
</style>
