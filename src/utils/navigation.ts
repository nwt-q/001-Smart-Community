/**
 * 类型安全的路由导航工具
 */

// 路由参数类型定义
export interface RouteParams {
  '/pages/activity/activities': {
    currentCommunityId: string
  }
  '/pages/activity/detail': {
    activitiesId: string
    currentCommunityId: string
  }
  '/pages/index/index': {}
  '/pages/login/login': {
    redirect?: string
  }
}

/**
 * 类型安全的页面跳转
 */
export function navigateTo<T extends keyof RouteParams>(
  url: T,
  params?: RouteParams[T],
  options?: {
    animationType?: 'pop-in' | 'fade-in' | 'slide-in-right' | 'slide-in-left' | 'slide-in-top' | 'slide-in-bottom' | 'none'
    animationDuration?: number
  },
) {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : ''
  const fullUrl = url + query

  return uni.navigateTo({
    url: fullUrl,
    animationType: options?.animationType,
    animationDuration: options?.animationDuration,
    fail: (err) => {
      console.error('页面跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

/**
 * 重定向到指定页面
 */
export function redirectTo<T extends keyof RouteParams>(
  url: T,
  params?: RouteParams[T],
) {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : ''
  const fullUrl = url + query

  return uni.redirectTo({
    url: fullUrl,
    fail: (err) => {
      console.error('页面重定向失败:', err)
    },
  })
}

/**
 * 切换 Tab 页面
 */
export function switchTab(url: '/pages/index/index' | '/pages/about/about' | '/pages/me/me') {
  return uni.switchTab({
    url,
    fail: (err) => {
      console.error('Tab切换失败:', err)
    },
  })
}

/**
 * 返回上一页或指定页面
 */
export function goBack(delta: number = 1) {
  const pages = getCurrentPages()
  if (pages.length > delta) {
    uni.navigateBack({
      delta,
      fail: (err) => {
        console.error('返回失败:', err)
        // 如果返回失败，尝试跳转到首页
        switchTab('/pages/index/index')
      },
    })
  }
  else {
    // 如果没有足够的历史页面，跳转到首页
    switchTab('/pages/index/index')
  }
}

/**
 * 活动模块路由导航工具类
 */
export class ActivityNavigation {
  /**
   * 跳转到社区活动列表
   */
  static toActivityList(currentCommunityId: string) {
    return navigateTo('/pages/activity/activities', { currentCommunityId })
  }

  /**
   * 跳转到活动详情
   */
  static toActivityDetail(activitiesId: string, currentCommunityId: string) {
    return navigateTo('/pages/activity/detail', { activitiesId, currentCommunityId })
  }
}

/**
 * 通用导航工具类
 */
export class NavigationUtils {
  /**
   * 预加载页面
   */
  static preloadPage<T extends keyof RouteParams>(url: T, params?: RouteParams[T]) {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    const fullUrl = url + query

    return uni.preloadPage({
      url: fullUrl,
    })
  }

  /**
   * 获取当前页面路径
   */
  static getCurrentPagePath(): string {
    const pages = getCurrentPages()
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      return `/${(currentPage as any).route}`
    }
    return ''
  }

  /**
   * 检查是否可以返回
   */
  static canGoBack(): boolean {
    return getCurrentPages().length > 1
  }

  /**
   * 安全返回（如果无法返回则跳转到首页）
   */
  static safeGoBack() {
    if (this.canGoBack()) {
      goBack()
    }
    else {
      switchTab('/pages/index/index')
    }
  }

  /**
   * 重新加载当前页面
   */
  static reloadCurrentPage() {
    const pages = getCurrentPages()
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      const route = `/${(currentPage as any).route}`
      const options = (currentPage as any).options || {}

      // 构建参数字符串
      const query = Object.keys(options).length > 0
        ? `?${new URLSearchParams(options).toString()}`
        : ''

      // 先返回再跳转实现重新加载
      if (pages.length > 1) {
        uni.navigateBack({
          delta: 1,
          success: () => {
            setTimeout(() => {
              uni.navigateTo({ url: route + query })
            }, 100)
          },
        })
      }
      else {
        uni.redirectTo({ url: route + query })
      }
    }
  }
}

// 导出便捷函数
export { ActivityNavigation as Activity }
export { NavigationUtils as Nav }
