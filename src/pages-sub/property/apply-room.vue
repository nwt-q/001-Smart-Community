<!--
  房屋申请列表页
  功能：显示房屋申请列表，支持搜索和筛选

  访问地址: http://localhost:9000/#/pages-sub/property/apply-room
-->
<script setup lang="ts">
import type { PropertyApplication } from '@/types/property-application'
import { onReachBottom, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '房屋申请',
    enablePullDownRefresh: true,
  },
})

const communityId = ref<string>('')
const applyRoomList = ref<PropertyApplication[]>([])
const page = ref(1)
const loadingStatus = ref<'loading' | 'more' | 'noMore'>('loading')
const loadingContentText = ref({
  contentdown: '上拉加载更多',
  contentrefresh: '加载中',
  contentnomore: '没有更多',
})

const applyStates = ref<Array<{ name: string, statusCd?: string }>>([{ name: '请选择' }])
const applyStatesIndex = ref(0)
const applyState = ref<string>('')
const roomName = ref<string>('')

function searchApply() {
  applyRoomList.value = []
  page.value = 1
  loadApply()
}

function loadApplyState() {
  // TODO: 实现加载申请状态逻辑
  console.log('加载申请状态')
}

function applyStatesChange(e: { detail: { value: number } }) {
  applyStatesIndex.value = e.detail.value
  if (applyStatesIndex.value === 0) {
    applyState.value = ''
    return
  }
  const selected = applyStates.value[applyStatesIndex.value]
  applyState.value = selected.statusCd || ''
}

function loadApply() {
  // TODO: 实现加载申请列表逻辑
  console.log('加载申请列表')
}

function toApplyRoomDetail(item: PropertyApplication) {
  uni.navigateTo({
    url: `/pages-sub/property/apply-room-detail?ardId=${item.ardId}&communityId=${item.communityId}`,
  })
}

onShow(() => {
  page.value = 1
  applyRoomList.value = []
  communityId.value = '' // TODO: 获取当前小区ID
  loadApply()
})

onReachBottom(() => {
  if (loadingStatus.value === 'noMore') {
    return
  }
  loadApply()
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
      <uni-load-more :status="loadingStatus" :content-text="loadingContentText" />
    </view>
    <view v-else>
      <no-data-page />
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
