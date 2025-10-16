<!--
  房屋申请记录页
  功能：显示房屋申请的跟踪记录列表

  访问地址: http://localhost:9000/#/pages-sub/property/apply-room-record
  建议携带参数: ?apply=JSON.stringify(applyRoomInfo)
-->
<script setup lang="ts">
import type { ApplicationRecord, PropertyApplication } from '@/types/property-application'
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref, watch } from 'vue'
import { getApplicationRecordList } from '@/api/property-application'
import { buildApplyFromParams, extractRecordDetailParams } from '@/hooks/property/use-property-apply-room'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '申请记录',
    enablePullDownRefresh: true,
  },
})

const applyRoomInfo = ref<PropertyApplication>({} as PropertyApplication)
const communityId = ref<string>('')
const applyRoomRecordList = ref<ApplicationRecord[]>([])
const page = ref(1)
const loadingState = ref<'loading' | 'finished' | 'error'>('loading')

/** 加载申请记录列表 - 使用 useRequest */
const {
  loading: recordListLoading,
  send: loadRecordListRequest,
  onSuccess: onRecordListSuccess,
  onError: onRecordListError,
  onComplete: onRecordListFinally,
} = useRequest(
  (pageNum: number) => getApplicationRecordList({
    page: pageNum,
    row: 10,
    communityId: applyRoomInfo.value.communityId,
    applicationId: applyRoomInfo.value.ardId,
    roomId: applyRoomInfo.value.roomId,
    roomName: applyRoomInfo.value.roomName,
  }),
  {
    immediate: false,
  },
)

onRecordListSuccess((res) => {
  applyRoomRecordList.value = applyRoomRecordList.value.concat(res.data.list)
  page.value++
})

onRecordListError((error) => {
  console.error('加载申请记录失败', error)
  loadingState.value = 'error'
  uni.showToast({
    title: '加载记录失败',
    icon: 'none',
  })
})

/** 统一处理 finished 状态 */
onRecordListFinally((event) => {
  // 只有在成功的情况下才判断是否设置 finished 状态
  if (event.error) {
    // 错误情况已在 onError 中处理
    return
  }

  const res = event.data
  // 判断是否已加载完所有数据：使用响应式数组长度与 total 比较
  if (!res || applyRoomRecordList.value.length >= res.total) {
    loadingState.value = 'finished'
  }
  // 注意：loading 状态由 watch 自动管理，这里不需要设置
})

/** 监听 loading 状态，自动设置 loadingState */
watch(recordListLoading, (isLoading) => {
  if (isLoading) {
    loadingState.value = 'loading'
  }
})

/** 新增跟踪记录 */
function addRecord() {
  const params = {
    ardId: applyRoomInfo.value.ardId,
    communityId: applyRoomInfo.value.communityId,
    roomId: applyRoomInfo.value.roomId,
    roomName: applyRoomInfo.value.roomName,
    state: applyRoomInfo.value.state,
    stateName: applyRoomInfo.value.stateName,
  }
  TypedRouter.toApplyRoomRecordHandle(params)
}

/** 显示记录详情 */
function showDetail(_item: ApplicationRecord) {
  const params = extractRecordDetailParams(_item, applyRoomInfo.value.communityId)
  TypedRouter.toApplyRoomRecordDetail(params)
}

onLoad((options: {
  ardId?: string
  communityId?: string
  roomId?: string
  roomName?: string
  state?: string
  stateName?: string
}) => {
  if (options.ardId && options.communityId && options.roomId && options.roomName && options.state && options.stateName) {
    applyRoomInfo.value = buildApplyFromParams({
      ardId: options.ardId,
      communityId: options.communityId,
      roomId: options.roomId,
      roomName: options.roomName,
      state: options.state,
      stateName: options.stateName,
    }) as PropertyApplication
    console.log(applyRoomInfo.value)
  }
})

onShow(() => {
  page.value = 1
  applyRoomRecordList.value = []
  loadRecordListRequest(1)
})

onReachBottom(() => {
  if (loadingState.value === 'finished' || recordListLoading.value) {
    return
  }
  loadRecordListRequest(page.value)
})
</script>

<template>
  <view>
    <view v-if="applyRoomRecordList.length > 0" class="margin-top">
      <view
        v-for="(item, index) in applyRoomRecordList"
        :key="index"
        class="cu-list menu-avatar"
        @tap="showDetail(item)"
      >
        <view class="cu-item arrow">
          <view class="item-content">
            <view class="text-grey">
              <text class="cuIcon-notification text-cut margin-right-xs text-green" />
              {{ item.stateName }}-{{ item.createTime }}
            </view>
            <view class="flex text-sm text-gray">
              <view class="text-cut">
                操作人员：{{ item.createUserName }}
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
        @reload="() => loadRecordListRequest(page)"
      />
    </view>
    <view v-else class="py-20">
      <wd-status-tip image="content" tip="暂无申请记录" />
    </view>
    <view class="record-add" @tap="addRecord">
      <img src="/static/image/renovation-add.png" alt="">
    </view>
  </view>
</template>

<style scoped>
.record-add {
  position: fixed;
  right: 10rpx;
  bottom: 50rpx;
  width: 100rpx;
  height: 100rpx;
}

.record-add img {
  width: 100%;
  height: 100%;
}

.item-content {
  width: 100%;
  margin-left: 20rpx;
  line-height: 1.6em;
}
</style>
