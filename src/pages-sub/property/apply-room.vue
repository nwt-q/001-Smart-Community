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
    applyStates.value = [{ name: '请选择' }, ...res]
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
    applyRoomList.value = applyRoomList.value.concat(res.data)
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
    <view class="cu-bar search bg-white">
      <view class="search-form round">
        <text class="cuIcon-search" />
        <input
          v-model="roomName"
          type="text"
          placeholder="输入房屋号"
          confirm-type="search"
        >
      </view>
      <view class="search-form round">
        <text class="cuIcon-search" />
        <picker
          :value="applyStatesIndex"
          :range="applyStates"
          range-key="name"
          @change="applyStatesChange"
        >
          <view>{{ applyStates[applyStatesIndex].name }}</view>
        </picker>
      </view>
      <view class="action">
        <button class="cu-btn bg-gradual-green shadow-blur round" @tap="searchApply">
          搜索
        </button>
      </view>
    </view>

    <view v-if="applyRoomList.length > 0" class="margin-top">
      <view
        v-for="(item, index) in applyRoomList"
        :key="index"
        class="cu-list menu-avatar"
        @tap="toApplyRoomDetail(item)"
      >
        <view class="cu-item arrow">
          <view class="item-content">
            <view class="text-grey">
              <text class="cuIcon-notification text-cut margin-right-xs text-green" />
              {{ item.stateName }}-{{ item.roomName }}
            </view>
            <view class="flex text-sm text-gray">
              <view class="text-cut">
                申请人：{{ item.createUserName }}-{{ item.createUserTel }}
              </view>
            </view>
          </view>
          <view class="action">
            <view class="text-grey text-xs">
              <text class="lg cuIcon-right margin-left-xs text-gray" />
            </view>
          </view>
        </view>
      </view>
      <wd-loadmore
        :state="loadingState"
        loading-text="加载中"
        finished-text="没有更多"
        error-text="加载失败，点击重试"
        @reload="() => loadApplyListRequest(page.value)"
      />
    </view>
    <view v-else>
      <view class="flex flex-col items-center justify-center py-20">
        <text class="text-gray-400">暂无数据</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.item-content {
  width: 100%;
  margin-left: 20rpx;
  line-height: 1.6em;
}
</style>
