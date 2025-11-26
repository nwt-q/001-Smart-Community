<script setup lang="ts">
import type { Floor } from '@/types/selector'
import { ref } from 'vue'
import { getFloorList } from '@/api/floor'
import { useSelectorStore } from '@/stores/useSelectorStore'

definePage({
  name: 'select-floor',
  style: {
    navigationBarTitleText: '选择楼栋',
  },
})

const selectorStore = useSelectorStore()

// 搜索关键词
const searchValue = ref('')

// 当前页码
const currentPage = ref(1)

// 每页条数
const pageSize = ref(50)

// 楼栋列表
const floorList = ref<Floor[]>([])

// 加载状态
const loading = ref(false)

// 是否还有更多数据
const hasMore = ref(true)

// 搜索
function handleSearch() {
  currentPage.value = 1
  floorList.value = []
  loadFloorList()
}

// 加载楼栋列表
async function loadFloorList() {
  if (loading.value || !hasMore.value)
    return

  loading.value = true
  try {
    const { data } = await getFloorList({
      communityId: 'COMM_001', // 实际应从登录信息获取
      page: currentPage.value,
      row: pageSize.value,
      floorNum: searchValue.value || undefined,
    })

    if (data?.records) {
      if (currentPage.value === 1) {
        floorList.value = data.records
      }
      else {
        floorList.value = [...floorList.value, ...data.records]
      }

      hasMore.value = floorList.value.length < data.total
    }
  }
  finally {
    loading.value = false
  }
}

// 选择楼栋
function handleSelectFloor(floor: Floor) {
  selectorStore.selectFloor(floor)
  uni.navigateBack()
}

// 上拉加载更多
function handleLoadMore() {
  if (!hasMore.value)
    return
  currentPage.value++
  loadFloorList()
}

// 页面加载时获取数据
onLoad(() => {
  loadFloorList()
})
</script>

<template>
  <!--
    选择楼栋页面
    功能：选择楼栋，支持搜索和分页加载

    访问地址: http://localhost:9000/#/pages-sub/selector/select-floor
  -->
  <view class="h-screen flex flex-col bg-gray-50">
    <!-- 搜索栏 -->
    <view class="bg-white p-4">
      <wd-search v-model="searchValue" placeholder="搜索楼栋编号" @search="handleSearch" />
    </view>

    <!-- 列表 -->
    <scroll-view scroll-y class="flex-1" @scrolltolower="handleLoadMore">
      <wd-cell-group>
        <wd-cell
          v-for="floor in floorList"
          :key="floor.floorId"
          :title="`${floor.floorNum}栋`"
          :label="floor.floorName"
          is-link
          @click="handleSelectFloor(floor)"
        >
          <template #icon>
            <wd-icon name="building" custom-class="i-carbon-building mr-2 text-blue-500" />
          </template>
        </wd-cell>
      </wd-cell-group>

      <!-- 加载状态 -->
      <view v-if="loading" class="p-4 text-center text-sm text-gray-500">
        加载中...
      </view>

      <!-- 没有更多数据 -->
      <view v-if="!hasMore && floorList.length > 0" class="p-4 text-center text-sm text-gray-500">
        已经到底了
      </view>
    </scroll-view>

    <!-- 空状态 -->
    <view v-if="!loading && floorList.length === 0" class="flex flex-1 items-center justify-center">
      <wd-status-tip image="search" tip="暂无楼栋数据" />
    </view>
  </view>
</template>
