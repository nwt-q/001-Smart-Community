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

function loadApply() {
  // TODO: 实现加载申请记录逻辑
  console.log('加载申请记录')
}

function addRecord() {
  uni.navigateTo({
    url: `/pages-sub/property/apply-room-record-handle?apply=${JSON.stringify(applyRoomInfo.value)}`,
  })
}

function showDetail(_item: ApplicationRecord) {
  const itemWithCommunityId = { ..._item, communityId: applyRoomInfo.value.communityId }
  uni.navigateTo({
    url: `/pages-sub/property/apply-room-record-detail?apply=${JSON.stringify(itemWithCommunityId)}`,
  })
}

onLoad((options: { apply: string }) => {
  applyRoomInfo.value = JSON.parse(options.apply)
  console.log(applyRoomInfo.value)
})

onShow(() => {
  page.value = 1
  applyRoomRecordList.value = []
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
