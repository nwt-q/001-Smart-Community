<!--
  房屋申请记录详情页
  功能：显示房屋申请记录的详细信息，支持删除操作
-->
<script setup lang="ts">
import type { ApplicationRecord, ApplicationRecordDetail } from '@/types/property-application'
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '记录详情',
  },
})

const recordInfo = ref<ApplicationRecord & { communityId?: string, roomName?: string }>({} as ApplicationRecord & { communityId?: string, roomName?: string })
const recordList = ref<ApplicationRecordDetail[]>([])
const imgRecordList = ref<ApplicationRecordDetail[]>([])
const videoRecordList = ref<ApplicationRecordDetail[]>([])
const commonBaseUrl = ref<string>('')

function loadRecordDetail() {
  // TODO: 实现加载记录详情逻辑
  console.log('加载记录详情')
}

function preview(e: { target: { dataset: { index: number } } }) {
  const index = e.target.dataset.index
  const urls: string[] = []
  imgRecordList.value.forEach((item: ApplicationRecordDetail) => {
    urls.push(item.url)
  })
  uni.previewImage({
    current: index,
    urls,
  })
}

function deleteRecord() {
  uni.showModal({
    title: '提示',
    content: '是否确认删除？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 实现删除记录逻辑
        console.log('删除记录')
        uni.navigateBack({
          delta: 1,
        })
      }
    },
  })
}

onLoad((options: { apply: string }) => {
  recordInfo.value = JSON.parse(options.apply)
  commonBaseUrl.value = '' // TODO: 从配置中获取
  loadRecordDetail()
})

onReady(() => {
  // 页面初次渲染完成
})

onShow(() => {
  // 页面显示
})
</script>

<template>
  <view>
    <view class="cu-list menu margin-top">
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-deletefill text-green" />
          <text class="text-grey">操作</text>
        </view>
        <view class="action">
          <text class="cu-btn bg-red" @click="deleteRecord">删除</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green" />
          <text class="text-grey">申请房间</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ recordInfo.roomName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-footprint text-green" />
          <text class="text-grey">跟踪备注</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">
            {{ recordList.length > 0 ? recordList[0].remark : '' }}
          </text>
        </view>
      </view>
      <view v-if="imgRecordList.length > 0">
        <view class="text-grey">
          图片
        </view>
        <view class="cu-item">
          <view class="col-4 grid-square grid text-center">
            <view
              v-for="(item, index) in imgRecordList"
              :key="index"
              class=""
            >
              <image
                mode="widthFix"
                :data-url="item.url"
                :data-index="index"
                :src="item.url"
                @tap="preview"
              />
            </view>
          </view>
        </view>
      </view>
      <view v-if="videoRecordList.length > 0">
        <view class="text-grey">
          视频
        </view>
        <view v-for="(item, index) in videoRecordList" :key="index">
          <video
            class="record-video"
            object-fit="contain"
            :src="commonBaseUrl + item.url"
            controls
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
uni-video {
  width: 100%;
}
</style>
