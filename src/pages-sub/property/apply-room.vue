<!--
  房屋申请列表页
  功能：显示房屋申请列表，支持搜索和筛选

  访问地址: http://localhost:9000/#/pages-sub/property/apply-room
-->
<script setup lang="ts">
import type { PropertyApplication } from '@/types/property-application'
import { onReachBottom, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
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

/** 搜索申请 */
function searchApply() {
  applyRoomList.value = []
  page.value = 1
  loadApply()
}

/** 加载申请状态字典 */
async function loadApplyState() {
  try {
    const res = await queryDictInfo({
      name: 'apply_room_discount',
      type: 'state',
    })
    console.log('字典接口返回数据：', res)
    if (res) {
      applyStates.value = [{ name: '请选择' }, ...res]
    }
  }
  catch (error) {
    console.error('加载申请状态失败', error)
  }
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

/** 加载申请列表 */
async function loadApply() {
  loadingState.value = 'loading'
  try {
    const res = await getPropertyApplicationList({
      page: page.value,
      row: 10,
      communityId: communityId.value,
      roomName: roomName.value,
      state: applyState.value,
    })

    console.log('列表接口返回数据：', res)

    if (res && res.data) {
      applyRoomList.value = applyRoomList.value.concat(res.data)
      page.value++

      if (applyRoomList.value.length >= res.total) {
        loadingState.value = 'finished'
      }
      else {
        loadingState.value = 'loading'
      }
    }
    else {
      loadingState.value = 'finished'
    }
  }
  catch (error) {
    console.error('加载申请列表失败', error)
    loadingState.value = 'error'
  }
}

/** 跳转到房屋申请详情页 */
function toApplyRoomDetail(item: PropertyApplication) {
  TypedRouter.toApplyRoomDetail(item.ardId, item.communityId)
}

onShow(() => {
  page.value = 1
  applyRoomList.value = []
  loadApplyState()
  loadApply()
})

onReachBottom(() => {
  if (loadingState.value === 'finished') {
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
      <wd-loadmore
        :state="loadingState"
        loading-text="加载中"
        finished-text="没有更多"
        error-text="加载失败，点击重试"
        @reload="loadApply"
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
