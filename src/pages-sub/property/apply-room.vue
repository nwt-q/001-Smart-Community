<!--
  房屋申请列表页
  功能：显示房屋申请列表，支持搜索和筛选

  访问地址: http://localhost:9000/#/pages-sub/property/apply-room
-->
<script setup lang="ts">
import type { PropertyApplication } from '@/types/property-application'
import { onReachBottom, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref, watch } from 'vue'
import { getPropertyApplicationList, queryDictInfo } from '@/api/property-application'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '房屋申请',
    enablePullDownRefresh: true,
  },
})

const communityId = ref<string>('COMM_001')
const applyRoomList = ref<PropertyApplication[]>([])
const page = ref(1)
const loadingState = ref<'loading' | 'finished' | 'error'>('loading')

const applyStates = ref<Array<{ name: string, statusCd?: string }>>([{ name: '请选择' }])
const applyStatesIndex = ref(0)
const applyState = ref<string>('')
const roomName = ref<string>('')

/** 加载申请状态字典 - 使用 useRequest */
const {
  send: loadApplyStateRequest,
  onSuccess: onApplyStateSuccess,
  onError: onApplyStateError,
} = useRequest(
  () => queryDictInfo({
    name: 'apply_room_discount',
    type: 'state',
  }),
  {
    immediate: false,
  },
)

onApplyStateSuccess((res) => {
  console.log('字典接口返回数据：', res)
  if (res) {
    applyStates.value = [{ name: '请选择' }, ...res.data]
  }
})

onApplyStateError((error) => {
  console.error('加载申请状态失败', error)
  uni.showToast({
    title: '加载状态失败',
    icon: 'none',
  })
})

/** 加载申请列表 - 使用 useRequest */
const {
  loading: applyListLoading,

  send: loadApplyListRequest,
  onSuccess: onApplyListSuccess,
  onError: onApplyListError,
  onComplete: onApplyListFinally,
} = useRequest(
  (pageNum: number) => getPropertyApplicationList({
    page: pageNum,
    row: 10,
    communityId: communityId.value,
    roomName: roomName.value,
    state: applyState.value,
  }),
  {
    immediate: false,
  },
)

onApplyListSuccess((res) => {
  console.log('列表接口返回数据：', res)

  if (res && res.data) {
    applyRoomList.value = applyRoomList.value.concat(res.data.list)
    page.value++
  }
})

onApplyListError((error) => {
  console.error('加载申请列表失败', error)
  loadingState.value = 'error'
  uni.showToast({
    title: '加载列表失败',
    icon: 'none',
  })
})

/** 统一处理 finished 状态 */
onApplyListFinally((event) => {
  // 只有在成功的情况下才判断是否设置 finished 状态
  if (event.error) {
    // 错误情况已在 onError 中处理
    return
  }

  const res = event.data
  // 判断是否已加载完所有数据：使用响应式数组长度与 total 比较
  if (!res || applyRoomList.value.length >= res.total) {
    loadingState.value = 'finished'
  }
  // 注意：loading 状态由 watch 自动管理，这里不需要设置
})

/** 监听 loading 状态，自动设置 loadingState */
watch(applyListLoading, (isLoading) => {
  if (isLoading) {
    loadingState.value = 'loading'
  }
})

/** 搜索申请 */
function searchApply() {
  applyRoomList.value = []
  page.value = 1
  loadApplyListRequest(1)
}

/** 申请状态选择器变更 */
function applyStatesChange(e: { detail: { value: number } }) {
  applyStatesIndex.value = e.detail.value
  if (applyStatesIndex.value === 0) {
    applyState.value = ''
    return
  }
  const selected = applyStates.value[applyStatesIndex.value]
  applyState.value = selected.statusCd || ''
}

/** 跳转到房屋申请详情页 */
function toApplyRoomDetail(item: PropertyApplication) {
  TypedRouter.toApplyRoomDetail(item.ardId, item.communityId)
}

onShow(() => {
  page.value = 1
  applyRoomList.value = []
  loadApplyStateRequest()
  loadApplyListRequest(1)
})

onReachBottom(() => {
  if (loadingState.value === 'finished' || applyListLoading.value) {
    return
  }
  loadApplyListRequest(page.value)
})
</script>

<template>
  <view>
    <!-- 搜索栏 -->
    <view class="flex items-center justify-between bg-white p-4">
      <!-- 房屋号搜索 -->
      <view class="mr-2 flex flex-1 items-center rounded-full bg-gray-100 px-4 py-2">
        <wd-icon name="" custom-class="i-carbon-search" />
        <input
          v-model="roomName"
          type="text"
          placeholder="输入房屋号"
          confirm-type="search"
          class="ml-2 flex-1 bg-transparent text-sm outline-none"
        >
      </view>
      <!-- 状态筛选 -->
      <view class="mr-2 flex flex-1 items-center rounded-full bg-gray-100 px-4 py-2">
        <wd-icon name="" custom-class="i-carbon-search" />
        <picker
          :value="applyStatesIndex"
          :range="applyStates"
          range-key="name"
          class="ml-2 flex-1 text-sm"
          @change="applyStatesChange"
        >
          <view>{{ applyStates[applyStatesIndex].name }}</view>
        </picker>
      </view>
      <!-- 搜索按钮 -->
      <view class="ml-auto">
        <button class="cursor-pointer rounded-full px-6 py-2 text-center text-white shadow-lg transition-all bg-gradient-green" @tap="searchApply">
          搜索
        </button>
      </view>
    </view>

    <!-- 申请列表 -->
    <view v-if="applyRoomList.length > 0" class="mt-4">
      <view
        v-for="(item, index) in applyRoomList"
        :key="index"
        class="mb-2 bg-white"
        @tap="toApplyRoomDetail(item)"
      >
        <view class="flex items-center p-4">
          <!-- 内容区域 -->
          <view class="ml-5 w-full leading-relaxed">
            <view class="text-gray-600">
              <wd-icon name="" custom-class="i-carbon-notification truncate mr-1 text-colorui-green" />
              {{ item.stateName }}-{{ item.roomName }}
            </view>
            <view class="flex text-sm text-gray-500">
              <view class="truncate">
                申请人：{{ item.createUserName }}-{{ item.createUserTel }}
              </view>
            </view>
          </view>
          <!-- 箭头图标 -->
          <view class="ml-auto">
            <view class="text-xs text-gray-600">
              <wd-icon name="" custom-class="text-lg i-carbon-chevron-right ml-1 text-gray-500" />
            </view>
          </view>
        </view>
      </view>
      <wd-loadmore
        :state="loadingState"
        loading-text="加载中"
        finished-text="没有更多"
        error-text="加载失败，点击重试"
        @reload="() => loadApplyListRequest(page)"
      />
    </view>
    <view v-else class="py-20">
      <wd-status-tip image="content" tip="暂无房屋申请数据" />
    </view>
  </view>
</template>
