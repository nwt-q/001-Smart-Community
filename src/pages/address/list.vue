<script setup lang="ts">
import { useAddressList } from '@/hooks/useAddressList'

// 页面配置
definePage({
  style: {
    navigationBarTitleText: '员工通讯录',
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
  },
})

// ==================== 使用组合式 API ====================

// 使用员工通讯录 hook，自动处理所有业务逻辑
const {
  // 状态
  list,
  searchKeyword: name,
  hidden,
  listCurID,
  listCur,
  isLoading,
  isEmpty,
  CustomBar,
  totalStaffCount,
  onlineStaffCount,

  // 方法
  loadStaffInfo,
  callPhone,
  searchStaff,
  clearSearch,

  // 索引交互方法
  getCur,
  setCur,
  tMove,
  tStart,
  tEnd,
} = useAddressList({
  autoInitialize: true, // 自动初始化所有功能
  immediate: true, // 立即加载数据
})
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 搜索栏 - 优化版 -->
    <view class="sticky top-0 z-20 bg-white shadow-sm">
      <view class="flex items-center justify-between p-4">
        <!-- 搜索表单 -->
        <view class="mr-3 flex-1">
          <view class="flex items-center rounded-full bg-gray-100 px-4 py-2">
            <wd-icon name="search" size="16" color="#999" class="mr-2" />
            <input
              v-model="name"
              type="text"
              placeholder="输入姓名或部门搜索"
              confirm-type="search"
              class="flex-1 bg-transparent text-sm outline-none"
              @confirm="searchStaff"
            >
            <wd-icon
              v-if="name"
              name="close"
              size="14"
              color="#999"
              class="ml-2 cursor-pointer"
              @click="clearSearch"
            />
          </view>
        </view>
        <!-- 搜索按钮 -->
        <view class="action">
          <wd-button
            type="primary"
            size="small"
            class="rounded-full shadow-md"
            :loading="isLoading"
            @click="searchStaff"
          >
            搜索
          </wd-button>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isLoading" class="flex items-center justify-center py-8">
      <wd-loading type="ring" color="#0081FF" size="20" />
      <text class="ml-2 text-gray-500">加载中...</text>
    </view>

    <!-- 主内容区域 -->
    <view v-else class="relative">
      <!-- 空状态 -->
      <view v-if="isEmpty" class="flex flex-col items-center justify-center py-16">
        <wd-icon name="user" size="48" color="#ccc" />
        <text class="mt-4 text-gray-400">暂无员工数据</text>
        <wd-button
          type="primary"
          size="small"
          class="mt-4"
          @click="loadStaffInfo"
        >
          重新加载
        </wd-button>
      </view>

      <!-- 滚动列表 -->
      <scroll-view
        v-else
        scroll-y
        class="relative"
        :scroll-into-view="`indexes-${listCurID}`"
        :style="{ height: `calc(100vh - ${CustomBar}px - 80px)` }"
        :scroll-with-animation="true"
        :enable-back-to-top="true"
      >
        <block v-for="(item, index) in list" :key="index">
          <view
            :id="`indexes-${item.initials}`"
            :class="`indexItem-${item.initials}`"
            :data-index="item.initials"
          >
            <!-- 字母标题 -->
            <view class="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-sm text-gray-600 font-semibold">
              {{ item.initials }}
              <text class="ml-2 text-xs text-gray-400">({{ item.staffs.length }}人)</text>
            </view>
            <!-- 员工列表 -->
            <view class="bg-white">
              <!-- 单个员工项 -->
              <view
                v-for="(staff, staffIndex) in item.staffs"
                :key="staffIndex"
                class="flex items-center border-b border-gray-100 px-4 py-3 transition-colors active:bg-blue-50 hover:bg-gray-50"
                @click="callPhone(staff.tel)"
              >
                <!-- 头像 -->
                <view class="mr-3 h-12 w-12 flex items-center justify-center rounded-full from-blue-500 to-blue-600 bg-gradient-to-br text-lg text-white font-semibold shadow-sm">
                  {{ staff.name[0] }}
                </view>
                <!-- 员工信息 -->
                <view class="flex-1">
                  <!-- 姓名 -->
                  <view class="mb-1 flex items-center text-base text-gray-800 font-medium">
                    {{ staff.name }}
                    <view
                      v-if="staff.isOnline"
                      class="ml-2 rounded-full bg-green-100 px-1.5 py-0.5 text-xs text-green-600"
                    >
                      在线
                    </view>
                  </view>
                  <!-- 部门和电话 -->
                  <view class="text-sm text-gray-500">
                    <text>{{ staff.orgName }}</text>
                    <text class="mx-1">·</text>
                    <text>{{ staff.tel }}</text>
                  </view>
                  <!-- 职位信息 -->
                  <view v-if="staff.position" class="mt-0.5 text-xs text-gray-400">
                    {{ staff.position }}
                  </view>
                </view>
                <!-- 电话按钮 -->
                <view class="action ml-4">
                  <wd-icon
                    name="phone-filled"
                    size="20"
                    color="#0081FF"
                    class="cursor-pointer text-2xl transition-transform active:scale-90"
                    @click.stop="callPhone(staff.tel)"
                  />
                </view>
              </view>
            </view>
          </view>
        </block>
      </scroll-view>

      <!-- 字母索引栏 -->
      <view
        v-if="list.length > 3"
        class="indexBar fixed right-0 top-20 z-10"
        :style="{ height: `calc(100vh - ${CustomBar}px - 100px)` }"
      >
        <view
          class="indexBar-box mr-2.5 w-10 border border-gray-100 rounded-xl bg-white/90 shadow-md backdrop-blur-sm"
          @touchstart="tStart"
          @touchend="tEnd"
          @touchmove.stop="tMove"
        >
          <view
            v-for="(item, index) in list"
            :id="index"
            :key="index"
            class="indexBar-item h-10 w-10 flex cursor-pointer items-center justify-center rounded-lg text-xs text-gray-600 font-medium transition-all duration-200 hover:bg-blue-50 hover:text-primary"
            @touchstart="getCur"
            @touchend="setCur"
          >
            {{ item.initials }}
          </view>
        </view>
      </view>

      <!-- 索引提示 -->
      <view
        v-show="!hidden"
        class="indexToast fixed left-1/2 top-1/2 z-50 h-20 w-20 transform rounded-2xl bg-black/80 text-center text-2xl text-white font-bold leading-20 shadow-2xl backdrop-blur-sm -translate-x-1/2 -translate-y-1/2"
      >
        {{ listCur }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/*
  员工通讯录页面样式 - Vue3 + TypeScript 版
  从 Vue2 ColorUI 架构迁移到 UnoCSS + wot-design-uni
*/

// ==================== 交互效果增强 ====================

// 索引栏项目交互
.indexBar-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: var(--wot-color-theme, #0957de);
    background-color: rgba(9, 87, 222, 0.08);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.92);
    background-color: rgba(9, 87, 222, 0.12);
  }
}

// 电话按钮点击效果
.phone-button {
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.85);
  }
}

// 员工列表项交互
.staff-item {
  transition: all 0.2s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, rgba(9, 87, 222, 0.05) 0%, transparent 100%);
    transition: width 0.3s ease;
  }

  &:hover {
    background-color: rgba(249, 250, 251, 0.9);

    &::before {
      width: 4px;
    }
  }

  &:active {
    background-color: rgba(219, 234, 254, 0.8);
  }
}

// 搜索栏聚焦效果
.search-input {
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(9, 87, 222, 0.1);
    background-color: rgba(255, 255, 255, 0.95);
  }
}

// ==================== 动画效果 ====================

// 索引提示框动画
.indexToast {
  animation: indexToastAnimation 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
}

@keyframes indexToastAnimation {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6) rotate(-10deg);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
}

// 列表项进入动画
.staff-item {
  animation: slideInUp 0.4s ease-out;
  animation-fill-mode: both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 索引栏滑动指示器
.indexBar-box {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    width: 2px;
    height: 30%;
    background: linear-gradient(180deg, transparent, var(--wot-color-theme, #0957de), transparent);
    border-radius: 1px;
    opacity: 0.6;
  }
}

// ==================== 特殊效果 ====================

// 在线状态徽章
.online-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

// 头像渐变背景
.avatar-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

// 加载状态呼吸效果
.loading-breath {
  animation: breath 1.5s ease-in-out infinite;
}

@keyframes breath {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

// ==================== 响应式适配 ====================

// 小屏幕适配
@media (max-width: 750rpx) {
  .indexBar-box {
    width: 28px;
    margin-right: 6px;
  }

  .indexBar-item {
    width: 28px;
    height: 28px;
    font-size: 10px;
    border-radius: 6px;
  }

  .indexToast {
    width: 56px;
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    border-radius: 12px;
  }

  .avatar-gradient {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}

// 大屏幕适配
@media (min-width: 1200rpx) {
  .indexBar-box {
    width: 48px;
    margin-right: 12px;
  }

  .indexBar-item {
    width: 48px;
    height: 48px;
    font-size: 14px;
    border-radius: 12px;
  }

  .indexToast {
    width: 80px;
    height: 80px;
    line-height: 80px;
    font-size: 24px;
  }
}

// ==================== 深色模式支持 ====================

@media (prefers-color-scheme: dark) {
  .indexBar-box {
    background-color: rgba(37, 37, 37, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .indexBar-item {
    color: rgba(255, 255, 255, 0.8);

    &:hover {
      background-color: rgba(9, 87, 222, 0.2);
    }
  }

  .staff-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

// ==================== 可访问性优化 ====================

// 高对比度模式
@media (prefers-contrast: high) {
  .indexBar-item {
    border: 1px solid currentColor;
  }

  .staff-item {
    border-bottom-width: 2px;
  }
}

// 减少动画偏好
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
