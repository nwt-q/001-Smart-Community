<script setup lang="ts">
import type { Activity } from '@/types/activity'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { reactive, ref } from 'vue'
import { getActivityDetail } from '@/api/activity'

// 页面配置
definePage({
  style: {
    navigationBarTitleText: '活动详情',
  },
})

// 接口参数
interface PageOptions {
  activitiesId: string
  currentCommunityId: string
}

// 响应式数据
const activitiesId = ref<string>('')
const currentCommunityId = ref<string>('')
const showHeadImage = ref<boolean>(true)

const activity = reactive<Activity>({
  activitiesId: '',
  title: '',
  userName: '',
  startTime: '',
  context: '',
  headerImg: '',
  src: '',
})

// 请求管理
const {
  loading,
  data: activityData,
  send: refreshActivity,
} = useRequest(
  () => getActivityDetail({
    page: 1,
    row: 1,
    activitiesId: activitiesId.value,
    communityId: currentCommunityId.value,
  }),
  {
    immediate: false,
  },
)

// 方法
function hideHeadImage() {
  console.log('图片加载失败')
  showHeadImage.value = false
}

function formatTime(timeString: string): string {
  if (!timeString)
    return ''
  return dayjs(timeString).format('YYYY-MM-DD HH:mm')
}

async function loadActivities() {
  try {
    const result = await refreshActivity()
    if (result?.activitiess?.length > 0) {
      const activityItem = result.activitiess[0]

      // 处理图片路径
      activityItem.src = `/api/file?fileId=${activityItem.headerImg}&communityId=${currentCommunityId.value}&time=${Date.now()}`

      // 更新活动数据
      Object.assign(activity, activityItem)
    }
  }
  catch (error) {
    console.error('加载活动详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
      duration: 2000,
    })
  }
}

// 生命周期
onLoad((options: PageOptions) => {
  activitiesId.value = options.activitiesId
  currentCommunityId.value = options.currentCommunityId
  loadActivities()
})
</script>

<template>
  <view class="activity-detail">
    <!-- 活动头图 -->
    <image
      v-if="showHeadImage"
      :src="activity.src"
      class="h-100 w-full"
      mode="aspectFill"
      @error="hideHeadImage"
    />

    <!-- 活动标题 -->
    <view class="mb-7.5 pt-7.5 text-center">
      <text class="text-11 text-gray-800 font-semibold">{{ activity.title }}</text>
    </view>

    <!-- 发布者和时间信息 -->
    <view class="h-15 flex items-center justify-around border-b border-solid px-4">
      <view>
        <text class="text-8 text-gray-400">{{ activity.userName }}</text>
      </view>
      <view>
        <text class="text-8 text-gray-400">{{ formatTime(activity.startTime) }}</text>
      </view>
    </view>

    <!-- 活动内容 -->
    <view class="mt-4 p-10">
      <rich-text
        :nodes="activity.context"
        class="text-gray-700 leading-6"
      />
    </view>

    <!-- 加载状态 -->
    <wd-loading v-if="loading" class="my-8" />
  </view>
</template>

<style scoped>
.activity-detail {
  @apply bg-white min-h-screen;
}

/* 自定义样式 - 当UnoCSS无法满足时 */
.activity-detail :deep(.rich-text) {
  line-height: 1.6;
}

.activity-detail :deep(.rich-text img) {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
}

.activity-detail :deep(.rich-text p) {
  margin: 8px 0;
}
</style>
