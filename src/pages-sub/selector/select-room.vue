<!--
  选择房屋页面
  功能：选择房屋，支持搜索和分页加载

  访问方式: TypedRouter.toSelectRoom(floorId, unitId)
  访问地址: http://localhost:9000/#/pages-sub/selector/select-room?floorId=F_COMM_001_001&unitId=U_001_01
  必须参数:
    - floorId - 楼栋ID（从选择楼栋页面获取）
    - unitId - 单元ID（从选择单元页面获取）

  完整示例: http://localhost:9000/#/pages-sub/selector/select-room?floorId=F_COMM_001_001&unitId=U_001_01

  旧代码：gitee-example/pages/selectRoom/selectRoom.vue
-->

<script setup lang="ts">
import type { Room } from '@/types/selector'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref, watch } from 'vue'
import { getRoomList } from '@/api/room'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { useSelectorStore } from '@/stores/useSelectorStore'

definePage({
  name: 'select-room',
  style: {
    navigationBarTitleText: '选择房屋',
  },
})

const selectorStore = useSelectorStore()
const toast = useGlobalToast()

// 从路由参数获取楼栋ID和单元ID
const floorId = ref<string>('')
const unitId = ref<string>('')

// z-paging ref
const pagingRef = ref()

// 搜索关键词
const searchValue = ref('')

// 搜索历史记录
const searchHistory = ref<string[]>([])

// 是否显示搜索历史
const showSearchHistory = ref(false)

// 是否正在搜索
const isSearching = ref(false)

// 搜索防抖定时器
const searchTimer = ref<NodeJS.Timeout>()

// 房屋列表
const roomList = ref<Room[]>([])

// 选中项
const selectedRoomId = ref<string>('')

// 参数校验错误状态
const hasParameterError = ref(false)

// 社区ID（实际应从登录信息获取）
const communityId = ref('COMM_001')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(50)

/**
 * 使用 useRequest 管理房屋列表请求
 */
const {
  loading,
  send: loadRoomData,
} = useRequest(
  () => getRoomList({
    communityId: communityId.value,
    floorId: floorId.value,
    unitId: unitId.value,
    page: currentPage.value,
    row: pageSize.value,
    roomNum: searchValue.value?.trim() || undefined,
  }),
  {
    immediate: false, // 🔴 强制要求：不自动执行
  },
)

/** z-paging 查询回调 */
async function handleQuery(pageNo: number, pageSizeValue: number) {
  currentPage.value = pageNo
  pageSize.value = pageSizeValue

  try {
    const response = await loadRoomData()

    if (response) {
      // z-paging complete 接收数组
      pagingRef.value?.complete(response.list || [])
    }
    else {
      pagingRef.value?.complete([])
    }
  }
  catch (error) {
    console.error('获取房屋列表失败:', error)
    // 通知 z-paging 加载失败
    pagingRef.value?.complete(false)

    uni.showToast({
      title: '加载房屋列表失败',
      icon: 'none',
    })
  }
}

/** 选择房屋 */
function handleSelectRoom(room: Room) {
  if (!room.roomId || !room.roomNum || !room.unitId || !room.floorId) {
    toast.error('房屋信息不完整')
    return
  }

  // 设置选中状态
  selectedRoomId.value = room.roomId

  // 添加触觉反馈
  uni.vibrateShort({
    type: 'light',
    fail: () => {}, // 忽略振动失败
  })

  selectorStore.selectRoom(room)

  toast.success({
    msg: `已选择 ${room.roomNum}室`,
    duration: 1200,
  })

  // 延迟返回以便用户看到成功提示
  setTimeout(() => {
    uni.navigateBack({
      fail: () => {
        toast.error('返回失败')
      },
    })
  }, 1200)
}

/** 实时搜索处理 */
function handleRealTimeSearch() {
  // 清除之前的定时器
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }

  // 如果搜索内容为空，隐藏搜索历史
  if (!searchValue.value?.trim()) {
    showSearchHistory.value = false
    isSearching.value = false
    return
  }

  isSearching.value = true

  // 防抖处理，500ms后执行搜索
  searchTimer.value = setTimeout(() => {
    executeSearch()
  }, 500)
}

/** 执行搜索 */
function executeSearch() {
  // 清理搜索关键词
  const trimmedSearch = searchValue.value?.trim() || ''

  if (!trimmedSearch) {
    return
  }

  // 添加到搜索历史
  addToSearchHistory(trimmedSearch)

  // 重置到第一页
  currentPage.value = 1
  isSearching.value = false

  // 触发 z-paging 重新加载数据
  pagingRef.value?.reload()
}

/** 搜索处理（点击搜索按钮） */
function handleSearch() {
  executeSearch()
}

/** 添加到搜索历史 */
function addToSearchHistory(keyword: string) {
  // 去除重复项
  const history = searchHistory.value.filter(item => item !== keyword)

  // 添加到最前面
  history.unshift(keyword)

  // 限制历史记录数量
  if (history.length > 10) {
    history.splice(10)
  }

  searchHistory.value = history

  // 保存到本地存储
  uni.setStorageSync('room_search_history', history)
}

/** 清空搜索历史 */
function clearSearchHistory() {
  searchHistory.value = []
  uni.removeStorageSync('room_search_history')
  toast.info('搜索历史已清空')
}

/** 从搜索历史选择 */
function selectHistoryItem(keyword: string) {
  searchValue.value = keyword
  executeSearch()
}

/** 清空搜索 */
function handleClearSearch() {
  searchValue.value = ''
  showSearchHistory.value = false
  isSearching.value = false
  currentPage.value = 1
  pagingRef.value?.reload()
}

/** 聚焦搜索框 */
function handleSearchFocus() {
  if (searchHistory.value.length > 0) {
    showSearchHistory.value = true
  }
}

/** 失焦搜索框 */
function handleSearchBlur() {
  // 延迟隐藏搜索历史，以便用户可以点击历史项
  setTimeout(() => {
    showSearchHistory.value = false
  }, 200)
}

/** 下拉刷新 */
function handleRefresh() {
  currentPage.value = 1
  pagingRef.value?.refresh()
}

/** 重试加载数据 */
function handleRetry() {
  currentPage.value = 1
  pagingRef.value?.reload()
}

/** 返回上一页 */
function handleGoBack() {
  uni.navigateBack({
    fail: () => {
      toast.error('返回失败')
    },
  })
}

// 页面加载时获取数据
onLoad((options) => {
  try {
    // 参数校验
    if (!options?.floorId || !options?.unitId) {
      hasParameterError.value = true
      return
    }

    floorId.value = options.floorId
    unitId.value = options.unitId

    // 加载搜索历史
    try {
      const history = uni.getStorageSync('room_search_history')
      if (Array.isArray(history)) {
        searchHistory.value = history
      }
    }
    catch (error) {
      console.error('加载搜索历史失败:', error)
    }
  }
  catch (error) {
    hasParameterError.value = true
    console.error('页面初始化失败:', error)
  }
})

// 监听搜索输入变化，实现实时搜索
watch(searchValue, handleRealTimeSearch)

// 页面挂载时的额外处理
onMounted(() => {
  // 监听网络状态变化
  uni.onNetworkStatusChange((res) => {
    if (!res.isConnected) {
      toast.warning('网络连接已断开')
    }
  })
})
</script>

<template>
  <view class="safe-area-inset-top safe-area-inset-bottom min-h-screen flex flex-col bg-gray-50">
    <!-- 参数错误状态 -->
    <view v-if="hasParameterError" class="flex flex-1 items-center justify-center p-4">
      <view class="max-w-xs text-center">
        <wd-icon name="warning-fill" custom-class="text-6xl text-orange-400 mb-4" />
        <view class="mb-4 text-gray-600 font-medium">
          页面参数错误
        </view>
        <view class="mb-6 text-sm text-gray-400">
          缺少必要的楼栋ID或单元ID参数，无法加载房屋列表
        </view>
        <wd-button type="primary" class="w-full" @click="handleGoBack">
          <template #icon>
            <wd-icon name="arrow-left" custom-class="i-carbon-arrow-left mr-2" />
          </template>
          返回上一页
        </wd-button>
      </view>
    </view>

    <template v-else>
      <!-- 搜索栏 -->
      <view class="relative border-b border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <wd-search
          v-model="searchValue"
          placeholder="搜索房间号"
          :disabled="loading"
          @search="handleSearch"
          @clear="handleClearSearch"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        />

        <!-- 搜索中状态指示器 -->
        <view v-if="isSearching" class="absolute right-16 top-1/2 -translate-y-1/2">
          <wd-loading size="16px" />
        </view>

        <!-- 搜索历史弹层 -->
        <view
          v-if="showSearchHistory && searchHistory.length > 0"
          class="absolute left-0 right-0 top-full z-50 border border-gray-100 rounded-b-lg bg-white shadow-lg"
          role="list"
          aria-label="搜索历史"
        >
          <view class="flex items-center justify-between border-b border-gray-100 p-3">
            <text class="text-sm text-gray-600 font-medium">搜索历史</text>
            <wd-button
              type="text"
              size="small"
              @click="clearSearchHistory"
            >
              <template #icon>
                <wd-icon name="delete" custom-class="i-carbon-trash-can text-gray-400" />
              </template>
            </wd-button>
          </view>

          <view class="max-h-64 overflow-y-auto">
            <view
              v-for="(item, index) in searchHistory"
              :key="index"
              class="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
              role="listitem"
              @click="selectHistoryItem(item)"
            >
              <view class="flex items-center">
                <wd-icon name="time" custom-class="i-carbon-time text-gray-400 mr-3" />
                <text class="text-gray-700">{{ item }}</text>
              </view>
              <wd-icon name="arrow-up" custom-class="i-carbon-arrow-up text-gray-300 text-sm" />
            </view>
          </view>
        </view>
      </view>

      <!-- z-paging 列表 -->
      <z-paging
        ref="pagingRef"
        v-model="roomList"
        :default-page-size="50"
        :refresher-enabled="true"
        :loading-more-enabled="true"
        :show-scrollbar="false"
        :loading-more-threshold="50"
        :fixed="false"
        :safe-area-config="{ bottom: 0 }"
        class="flex-1"
        role="main"
        aria-label="房屋列表"
        @query="handleQuery"
      >
        <!-- 加载状态提示 -->
        <template #loading>
          <view class="flex items-center justify-center p-6">
            <view class="flex flex-col items-center">
              <!-- 增强的加载动画 -->
              <view class="relative mb-3">
                <wd-loading type="ring" size="32px" />
                <!-- 装饰性旋转元素 -->
                <view class="absolute inset-0 flex items-center justify-center">
                  <wd-icon
                    name="home"
                    custom-class="i-carbon-home text-purple-400 animate-pulse"
                    size="20px"
                  />
                </view>
              </view>

              <!-- 动态加载文案 -->
              <text class="animate-pulse text-sm text-gray-600 font-medium">
                {{ searchValue ? '正在搜索房屋...' : '正在加载房屋列表...' }}
              </text>

              <!-- 加载提示 -->
              <text class="mt-1 text-xs text-gray-400">
                请稍候片刻
              </text>
            </view>
          </view>
        </template>

        <!-- 列表内容 -->
        <wd-cell-group
          role="list"
          aria-label="房屋选择列表"
        >
          <wd-cell
            v-for="(room, index) in roomList"
            :key="room.roomId"
            :title="`${room.roomNum}室`"
            :label="`单元 ${room.unitId?.slice(-4) || ''} 的房间`"
            :value="selectedRoomId === room.roomId ? '已选择' : ''"
            is-link
            :disabled="loading"
            role="listitem"
            :aria-label="`房间 ${room.roomNum}室${selectedRoomId === room.roomId ? ', 已选择' : ''}`"
            :aria-setsize="roomList.length"
            :aria-posinset="index + 1"
            :aria-selected="selectedRoomId === room.roomId"
            tabindex="0"
            class="transition-all duration-200 active:bg-gray-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500/50" :class="[
              selectedRoomId === room.roomId && 'bg-purple-50 border-purple-200 shadow-sm',
            ]"
            :title-class="[
              'font-medium',
              selectedRoomId === room.roomId ? 'text-purple-600' : 'text-gray-900',
            ]"
            :label-class="[
              'text-sm',
              selectedRoomId === room.roomId ? 'text-purple-500' : 'text-gray-500',
            ]"
            :value-class="[
              'text-sm font-medium',
              selectedRoomId === room.roomId ? 'text-purple-600' : 'text-transparent',
            ]"
            @click="handleSelectRoom(room)"
            @keydown.enter="handleSelectRoom(room)"
            @keydown.space.prevent="handleSelectRoom(room)"
          >
            <template #icon>
              <view class="relative">
                <wd-icon
                  name="home"
                  :custom-class="`mr-3 transition-all duration-200 ${
                    selectedRoomId === room.roomId
                      ? 'i-carbon-home text-purple-500 scale-110'
                      : 'i-carbon-home text-purple-400'
                  }`"
                />
                <!-- 选中指示器 -->
                <view
                  v-if="selectedRoomId === room.roomId"
                  class="absolute h-4 w-4 flex items-center justify-center rounded-full bg-purple-500 -right-1 -top-1"
                  role="img"
                  aria-label="已选择"
                >
                  <wd-icon name="check" custom-class="i-carbon-checkmark text-white text-xs" />
                </view>
              </view>
            </template>

            <template #right-icon>
              <wd-icon
                :name="selectedRoomId === room.roomId ? 'check-circle' : 'arrow-right'"
                :custom-class="`transition-all duration-200 ${
                  selectedRoomId === room.roomId
                    ? 'i-carbon-checkmark-filled text-purple-500 scale-110'
                    : 'i-carbon-chevron-right text-gray-400'
                }`"
              />
            </template>
          </wd-cell>
        </wd-cell-group>

        <!-- 自定义空状态 -->
        <template #empty>
          <view class="flex items-center justify-center p-6 sm:p-8">
            <view class="max-w-xs text-center">
              <!-- 插画图标 -->
              <view class="relative mb-6">
                <wd-icon
                  :name="searchValue ? 'search' : 'home'"
                  :custom-class="`text-8xl transition-all duration-300 ${
                    searchValue ? 'i-carbon-search text-orange-400 animate-pulse' : 'i-carbon-home text-gray-300'
                  }`"
                />
                <!-- 装饰性元素 -->
                <view
                  v-if="!searchValue"
                  class="absolute h-8 w-8 flex items-center justify-center rounded-full bg-purple-100 animate-bounce-in -bottom-2 -right-2"
                >
                  <wd-icon name="add" custom-class="i-carbon-add text-purple-500 text-sm" />
                </view>
              </view>

              <!-- 主要文案 -->
              <view class="mb-3">
                <text class="text-lg text-gray-700 font-medium">
                  {{ searchValue ? '未找到匹配的房屋' : '还没有房屋信息' }}
                </text>
              </view>

              <!-- 次要文案 -->
              <view class="mb-4 text-sm text-gray-500">
                {{ searchValue ? '可以尝试其他关键词或清空搜索条件' : '请联系管理员添加房屋信息' }}
              </view>

              <!-- 操作按钮 -->
              <view v-if="searchValue" class="flex flex-col justify-center gap-2 sm:flex-row">
                <wd-button
                  type="primary"
                  size="small"
                  class="flex-1 transition-all duration-200 sm:flex-none hover:scale-105"
                  @click="handleClearSearch"
                >
                  清空搜索
                </wd-button>
                <wd-button
                  type="text"
                  size="small"
                  class="flex-1 transition-all duration-200 sm:flex-none hover:scale-105"
                  @click="handleRefresh"
                >
                  刷新数据
                </wd-button>
              </view>
            </view>
          </view>
        </template>
      </z-paging>
    </template>
  </view>
</template>
