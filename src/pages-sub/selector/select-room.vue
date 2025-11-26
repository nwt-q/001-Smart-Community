<script setup lang="ts">
import type { Room } from '@/types/selector'
import { onLoad, ref } from 'vue'
import { getRoomList } from '@/api/room'
import { useSelectorStore } from '@/stores/useSelectorStore'

definePage({
  name: 'select-room',
  style: {
    navigationBarTitleText: '选择房屋',
  },
})

const route = useRoute()
const selectorStore = useSelectorStore()

// 从路由参数获取楼栋ID和单元ID
const floorId = ref<string>(route.query.floorId as string)
const unitId = ref<string>(route.query.unitId as string)

// 搜索关键词
const searchValue = ref('')

// 当前页码
const currentPage = ref(1)

// 每页条数
const pageSize = ref(50)

// 房屋列表
const roomList = ref<Room[]>([])

// 加载状态
const loading = ref(false)

// 是否还有更多数据
const hasMore = ref(true)

// 搜索
function handleSearch() {
  currentPage.value = 1
  roomList.value = []
  loadRoomList()
}

// 加载房屋列表
async function loadRoomList() {
  if (loading.value || !hasMore.value)
    return

  loading.value = true
  try {
    const { data } = await getRoomList({
      communityId: 'COMM_001', // 实际应从登录信息获取
      floorId: floorId.value,
      unitId: unitId.value,
      page: currentPage.value,
      row: pageSize.value,
      roomNum: searchValue.value || undefined,
    })

    if (data?.records) {
      if (currentPage.value === 1) {
        roomList.value = data.records
      }
      else {
        roomList.value = [...roomList.value, ...data.records]
      }

      hasMore.value = roomList.value.length < data.total
    }
  }
  finally {
    loading.value = false
  }
}

// 选择房屋
function handleSelectRoom(room: Room) {
  selectorStore.selectRoom(room)
  uni.navigateBack()
}

// 上拉加载更多
function handleLoadMore() {
  if (!hasMore.value)
    return
  currentPage.value++
  loadRoomList()
}

// 页面加载时获取数据
onLoad(() => {
  if (!floorId.value || !unitId.value) {
    uni.showToast({
      title: '缺少必要参数',
      icon: 'none',
    })
    return
  }
  loadRoomList()
})
</script>

<template>
  <!--
    选择房屋页面
    功能：选择房屋，支持搜索和分页加载

    访问地址: http://localhost:9000/#/pages-sub/selector/select-room?floorId=F_COMM_001_001&unitId=U_001_01
  -->

  <view class="h-screen flex flex-col bg-gray-50">
    <!-- 搜索栏 -->
    <view class="bg-white p-4">
      <wd-search v-model="searchValue" placeholder="搜索房间号" @search="handleSearch" />
    </view>

    <!-- 列表 -->
    <scroll-view scroll-y class="flex-1" @scrolltolower="handleLoadMore">
      <wd-cell-group>
        <wd-cell
          v-for="room in roomList"
          :key="room.roomId"
          :title="`${room.roomNum}室`"
          is-link
          @click="handleSelectRoom(room)"
        >
          <template #icon>
            <wd-icon name="home" custom-class="i-carbon-home mr-2 text-purple-500" />
          </template>
        </wd-cell>
      </wd-cell-group>

      <!-- 加载状态 -->
      <view v-if="loading" class="p-4 text-center text-sm text-gray-500">
        加载中...
      </view>

      <!-- 没有更多数据 -->
      <view v-if="!hasMore && roomList.length > 0" class="p-4 text-center text-sm text-gray-500">
        已经到底了
      </view>
    </scroll-view>

    <!-- 空状态 -->
    <view v-if="!loading && roomList.length === 0" class="flex flex-1 items-center justify-center">
      <wd-status-tip image="search" tip="暂无房屋数据" />
    </view>
  </view>
</template>
