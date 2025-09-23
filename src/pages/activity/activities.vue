<script setup lang="ts">
import type { Activity, ActivityListParams, ActivityListResponse } from '@/types/activity'
import { onLoad, onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { getActivityList, increaseActivityView } from '@/api/activity'
import { ActivityNavigation } from '@/utils/navigation'

// 页面配置
definePage({
  name: 'Activities',
  style: {
    navigationBarTitleText: '社区活动',
    navigationBarBackgroundColor: '#368CFE',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'light',
    onReachBottomDistance: 50,
  },
})

// 接口参数类型
interface PageOptions {
  currentCommunityId: string
}

// 响应式数据状态
const currentCommunityId = ref<string>('')
const activities = ref<Activity[]>([])
const currentPage = ref<number>(1)
const pageSize = ref<number>(15)
const hasMore = ref<boolean>(true)
const isLoadingMore = ref<boolean>(false)
const error = ref<string>('')

// API请求管理 - 优化请求参数
const {
  loading,
  data: activitiesResponse,
  send: fetchActivities,
  onSuccess,
  onError,
} = useRequest(
  (params: ActivityListParams) => getActivityList(params),
  {
    immediate: false,
  },
)

// 计算属性
const isEmpty = computed(() => !loading.value && activities.value.length === 0)
const showLoadMore = computed(() => hasMore.value && !loading.value)

// 请求成功处理
onSuccess((event) => {
  const response = event.data as ActivityListResponse
  if (response?.activitiess) {
    processActivitiesData(response.activitiess, response)
  }
})

// 请求错误处理
onError((event) => {
  const err = event.error
  console.error('获取活动列表失败:', err)
  error.value = err?.message || '网络异常，请稍后重试'
  showErrorToast('加载失败，请稍后重试')
})

// 工具函数
/**
 * 格式化时间显示
 */
function formatTime(timeString: string): string {
  if (!timeString)
    return ''
  return dayjs(timeString).format('YYYY-MM-DD HH:mm')
}

/**
 * 格式化数字显示（如浏览量、点赞数）
 */
function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

/**
 * 处理图片路径 - 优化以匹配Mock接口的图片处理逻辑
 */
function getImageUrl(headerImg: string): string {
  if (!headerImg)
    return ''
  // 检查是否为完整URL（Mock接口返回的图片）
  if (headerImg.startsWith('http')) {
    return headerImg
  }
  // 🔴 兼容原Java110Context的文件路径格式
  return `/api/file?fileId=${headerImg}&communityId=${currentCommunityId.value}&time=${Date.now()}`
}

/**
 * 显示错误提示
 */
function showErrorToast(message: string) {
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000,
  })
}

/**
 * 处理活动数据 - 完全匹配原Java110Context的数据处理逻辑
 */
function processActivitiesData(newActivities: Activity[], response: ActivityListResponse) {
  const processedActivities = newActivities.map((item: Activity) => ({
    ...item,
    // 🔴 重要：图片URL处理逻辑匹配原Java110Context
    src: item.src || getImageUrl(item.headerImg || ''), // 优先使用Mock接口提供的src
    // 🔴 数据格式兼容性处理 - 保持与原系统一致
    readCount: item.readCount || item.viewCount || 0, // readCount优先，向后兼容viewCount
    likeCount: item.likeCount || 0,
    collectCount: item.collectCount || 0, // 收藏功能
    // 时间格式化处理
    formattedStartTime: formatTime(item.startTime),
    formattedCreateTime: formatTime(item.createTime),
    formattedEndTime: item.endTime ? formatTime(item.endTime) : '',
  }))

  // 🔴 分页数据处理逻辑
  if (currentPage.value === 1) {
    activities.value = processedActivities
  }
  else {
    activities.value.push(...processedActivities)
  }

  // 🔴 分页状态更新 - 基于实际返回的数据量判断是否还有更多
  hasMore.value = processedActivities.length >= pageSize.value
  error.value = ''

  // 输出处理结果用于调试
  console.log('🎯 Activities processed:', {
    total: response.total,
    currentPage: currentPage.value,
    newItems: processedActivities.length,
    totalItems: activities.value.length,
    hasMore: hasMore.value,
  })
}

/**
 * 加载活动列表（支持分页）
 */
async function loadActivities(page: number = 1, showLoading: boolean = true) {
  if (!currentCommunityId.value) {
    showErrorToast('社区ID不能为空')
    return
  }

  try {
    // 设置加载状态
    if (page > 1) {
      isLoadingMore.value = true
    }

    const params: ActivityListParams = {
      page,
      row: pageSize.value,
      communityId: currentCommunityId.value,
      status: '1', // 只获取已发布的活动
    }

    await fetchActivities(params)
    currentPage.value = page
  }
  catch (err: any) {
    console.error('加载活动失败:', err)
    // 错误已在 onError 中处理
  }
  finally {
    if (page > 1) {
      isLoadingMore.value = false
    }
  }
}

/**
 * 刷新活动列表
 */
async function refreshActivities() {
  currentPage.value = 1
  hasMore.value = true
  await loadActivities(1)
}

/**
 * 加载更多活动
 */
async function loadMoreActivities() {
  if (hasMore.value && !loading.value && !isLoadingMore.value) {
    await loadActivities(currentPage.value + 1, false)
  }
}

/**
 * 跳转到活动详情并增加浏览量
 */
async function navigateToDetail(item: Activity) {
  try {
    // 异步增加浏览量，不阻塞跳转
    increaseActivityView(item.activitiesId).catch((err) => {
      console.warn('增加浏览量失败:', err)
    })

    // 立即跳转到详情页
    await ActivityNavigation.toActivityDetail(item.activitiesId, currentCommunityId.value)

    // 乐观更新本地浏览量
    const index = activities.value.findIndex(activity => activity.activitiesId === item.activitiesId)
    if (index !== -1) {
      activities.value[index].readCount += 1
      activities.value[index].viewCount += 1
    }
  }
  catch (err) {
    console.error('跳转详情页失败:', err)
    showErrorToast('跳转失败，请重试')
  }
}

// 监听社区ID变化，自动刷新数据
watch(
  () => currentCommunityId.value,
  (newCommunityId) => {
    if (newCommunityId) {
      refreshActivities()
    }
  },
  { immediate: false },
)

// 生命周期钩子
onLoad((options: PageOptions) => {
  console.log('Activities页面加载，参数:', options)

  if (!options.currentCommunityId) {
    showErrorToast('社区参数缺失')
    return
  }

  currentCommunityId.value = options.currentCommunityId
  // 首次加载数据
  loadActivities(1)
})

// 页面显示时刷新数据（从详情页返回时）
onShow(() => {
  // 如果已有数据，则静默刷新
  if (activities.value.length > 0) {
    refreshActivities()
  }
})

// 下拉刷新
onPullDownRefresh(async () => {
  try {
    await refreshActivities()
  }
  finally {
    uni.stopPullDownRefresh()
  }
})

// 上拉加载更多
onReachBottom(() => {
  loadMoreActivities()
})
</script>

<template>
  <view class="activities-container min-h-screen bg-gray-50">
    <!-- 顶部加载状态 -->
    <view v-if="loading && currentPage === 1" class="flex justify-center py-8">
      <wd-loading size="24px" color="#368CFE" />
      <text class="ml-2 text-sm text-gray-600">加载中...</text>
    </view>

    <!-- 活动列表 -->
    <view v-if="activities.length > 0" class="pb-4">
      <wd-card
        v-for="(item, index) in activities"
        :key="`${item.activitiesId}_${index}`"
        class="mx-4 mt-4 cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
        @click="navigateToDetail(item)"
      >
        <!-- 活动图片区域 -->
        <template #header>
          <view class="relative">
            <wd-image
              :src="item.src"
              width="100%"
              height="180px"
              fit="cover"
              loading-type="default"
              error-type="image"
              class="block"
              :lazy="true"
            />

            <!-- 活动状态标签 -->
            <view class="absolute right-2 top-2">
              <wd-tag
                v-if="dayjs().isAfter(dayjs(item.endTime))"
                type="primary"
                size="small"
                plain
                class="bg-black/50 text-white"
              >
                已结束
              </wd-tag>
              <wd-tag
                v-else-if="dayjs().isBefore(dayjs(item.startTime))"
                type="warning"
                size="small"
                plain
                class="bg-black/50 text-white"
              >
                未开始
              </wd-tag>
              <wd-tag
                v-else
                type="success"
                size="small"
                plain
                class="bg-black/50 text-white"
              >
                进行中
              </wd-tag>
            </view>

            <!-- 底部渐变遮罩和标题 -->
            <view class="absolute bottom-0 left-0 right-0 from-black/70 to-transparent bg-gradient-to-t px-4 py-3">
              <text class="line-clamp-2 text-base text-white font-medium leading-relaxed">{{ item.title }}</text>
            </view>
          </view>
        </template>

        <!-- 活动信息区域 -->
        <template #body>
          <wd-cell-group :border="false">
            <wd-cell>
              <template #icon>
                <!-- 发布者头像（可以后续替换为真实头像） -->
                <view class="mr-3 h-12 w-12 flex flex-shrink-0 items-center justify-center rounded-full from-blue-400 to-purple-500 bg-gradient-to-br text-white">
                  <text class="text-sm font-medium">{{ item.userName?.charAt(0) || 'A' }}</text>
                </view>
              </template>

              <template #title>
                <view class="flex items-center justify-between">
                  <text class="text-sm text-gray-600 font-medium">{{ item.userName || '管理员' }}</text>
                  <text class="text-xs text-gray-400">{{ item.formattedCreateTime }}</text>
                </view>
              </template>

              <template #label>
                <!-- 活动内容预览 -->
                <view v-if="item.context" class="mb-3 mt-2">
                  <text class="line-clamp-2 text-sm text-gray-600 leading-relaxed">{{ item.context }}</text>
                </view>

                <!-- 活动时间信息 -->
                <view class="mb-3 rounded-lg bg-gray-50 p-3">
                  <view class="mb-1 flex items-center">
                    <wd-icon name="time-filled" size="14px" color="#368CFE" class="mr-1" />
                    <text class="text-xs text-gray-500">活动时间</text>
                  </view>
                  <text class="text-sm text-gray-700 font-medium">
                    {{ item.formattedStartTime }}
                    <text v-if="item.endTime" class="text-gray-400"> ~ {{ formatTime(item.endTime) }}</text>
                  </text>
                </view>

                <!-- 统计信息栏 -->
                <view class="flex items-center justify-between border-t border-gray-100 pt-2">
                  <!-- 统计数据 -->
                  <view class="flex items-center gap-4 text-sm text-gray-500">
                    <!-- 浏览量 -->
                    <view class="flex items-center gap-1">
                      <wd-icon name="view" size="14px" color="#9ca3af" />
                      <text>{{ formatNumber(item.readCount) }}</text>
                    </view>

                    <!-- 点赞数 -->
                    <view class="flex items-center gap-1">
                      <wd-icon name="thumb-up" size="14px" color="#9ca3af" />
                      <text>{{ formatNumber(item.likeCount) }}</text>
                    </view>

                    <!-- 评论数（预留） -->
                    <view class="flex items-center gap-1">
                      <wd-icon name="chat" size="14px" color="#9ca3af" />
                      <text>{{ formatNumber(item.collectCount) }}</text>
                    </view>
                  </view>

                  <!-- 查看详情按钮 -->
                  <wd-button
                    type="primary"
                    size="small"
                    plain
                    round
                    class="px-4"
                  >
                    查看详情
                  </wd-button>
                </view>
              </template>
            </wd-cell>
          </wd-cell-group>
        </template>
      </wd-card>
    </view>

    <!-- 加载更多状态 -->
    <view v-if="showLoadMore" class="flex justify-center py-4">
      <wd-loading v-if="isLoadingMore" size="20px" color="#368CFE" />
      <text v-if="isLoadingMore" class="ml-2 text-sm text-gray-500">加载更多...</text>
      <text v-else-if="!hasMore && activities.length > 0" class="text-sm text-gray-400">没有更多了</text>
    </view>

    <!-- 空状态 -->
    <view v-if="isEmpty" class="flex flex-col items-center justify-center py-20">
      <wd-empty
        description="暂无活动"
        image-type="data"
        image-size="120px"
      >
        <template #description>
          <view class="text-center">
            <text class="mb-2 block text-gray-400">暂时没有社区活动</text>
            <text class="block text-sm text-gray-300">请稍后再来看看吧</text>
          </view>
        </template>
      </wd-empty>
    </view>

    <!-- 错误状态 -->
    <view v-if="error && isEmpty" class="flex flex-col items-center justify-center py-20">
      <wd-empty
        description="加载失败"
        image-type="error"
        image-size="120px"
      >
        <template #description>
          <view class="text-center">
            <text class="mb-2 block text-red-400">{{ error }}</text>
            <wd-button
              type="primary"
              size="small"
              plain
              round
              @click="refreshActivities"
            >
              重新加载
            </wd-button>
          </view>
        </template>
      </wd-empty>
    </view>
  </view>
</template>

<style scoped>
.activities-container {
  @apply bg-gray-50 min-h-screen;
}

/* wot-design-uni 组件样式优化 */
.activities-container :deep(.wd-loading) {
  @apply flex justify-center items-center;
}

.activities-container :deep(.wd-card) {
  @apply shadow-sm border-0 rounded-xl;
  transition: box-shadow 0.2s ease-in-out;
}

.activities-container :deep(.wd-card:hover) {
  @apply shadow-md;
}

.activities-container :deep(.wd-card__header) {
  @apply p-0 overflow-hidden rounded-t-xl;
}

.activities-container :deep(.wd-card__body) {
  @apply p-0;
}

.activities-container :deep(.wd-cell) {
  @apply px-4 py-3;
}

.activities-container :deep(.wd-cell__body) {
  @apply items-start;
}

.activities-container :deep(.wd-cell__icon) {
  @apply flex items-start pt-1;
}

/* Tag 组件优化 */
.activities-container :deep(.wd-tag) {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Button 组件优化 */
.activities-container :deep(.wd-button--mini.wd-button--plain) {
  @apply border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600;
  font-size: 12px;
  padding: 4px 12px;
}

/* 文本截断样式 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 过渡动画 */
.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

.hover\:shadow-lg:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 渐变背景优化 */
.bg-gradient-to-t {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
}

.bg-gradient-to-br {
  background: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* 响应式优化 */
@media (min-width: 640px) {
  .activities-container {
    @apply px-6;
  }
}

@media (min-width: 768px) {
  .activities-container {
    @apply px-8;
  }

  .activities-container :deep(.wd-card) {
    @apply max-w-2xl mx-auto;
  }
}

@media (min-width: 1024px) {
  .activities-container {
    @apply px-12;
  }

  .activities-container :deep(.wd-card) {
    @apply max-w-3xl;
  }
}

/* 暗黑模式支持（预留） */
@media (prefers-color-scheme: dark) {
  .activities-container {
    @apply bg-gray-900;
  }

  .activities-container :deep(.wd-card) {
    @apply bg-gray-800 border-gray-700;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .activities-container :deep(.wd-card) {
    @apply border-2 border-gray-900;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .transition-shadow {
    transition: none;
  }

  .activities-container :deep(.wd-card) {
    transition: none;
  }
}
</style>
