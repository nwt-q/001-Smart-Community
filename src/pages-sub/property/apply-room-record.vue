<!--
  房屋申请记录页
  功能：显示房屋申请的跟踪记录列表

  访问地址: http://localhost:9000/#/pages-sub/property/apply-room-record
  建议携带参数: ?apply=JSON.stringify(applyRoomInfo)
-->
<script setup lang="ts">
import type { ApplicationRecord, PropertyApplication } from '@/types/property-application'
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
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
const loadingStatus = ref<'loading' | 'more' | 'noMore'>('loading')
const loadingContentText = ref({
  contentdown: '上拉加载更多',
  contentrefresh: '加载中',
  contentnomore: '没有更多',
})

/** 加载申请记录列表 */
async function loadApply() {
  loadingStatus.value = 'more'
  try {
    const res = await getApplicationRecordList({
      page: page.value,
      row: 10,
      communityId: applyRoomInfo.value.communityId,
      applicationId: applyRoomInfo.value.ardId,
      roomId: applyRoomInfo.value.roomId,
      roomName: applyRoomInfo.value.roomName,
    })

    applyRoomRecordList.value = applyRoomRecordList.value.concat(res.data)
    page.value++

    if (applyRoomRecordList.value.length >= res.total) {
      loadingStatus.value = 'noMore'
    }
  }
  catch (error) {
    console.error('加载申请记录失败', error)
    loadingStatus.value = 'noMore'
  }
}

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
      <uni-load-more :status="loadingStatus" :content-text="loadingContentText" />
    </view>
    <view v-else>
      <no-data-page />
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
