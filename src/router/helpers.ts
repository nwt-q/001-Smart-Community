/**
 * 路由辅助函数和类型安全的路由跳转工具
 */

import type { PageParams, PageRoute, TabRoute } from '@/types/routes'

/** 类型安全的路由跳转函数 */
export function navigateToTyped<T extends keyof PageParams>(
  url: T,
  params?: PageParams[T],
  options?: UniApp.NavigateToOptions,
) {
  let fullUrl: string = url
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params as any).toString()
    fullUrl = `${url}?${query}`
  }

  return uni.navigateTo({
    url: fullUrl,
    ...options,
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

/** 类型安全的重定向函数 */
export function redirectToTyped<T extends keyof PageParams>(
  url: T,
  params?: PageParams[T],
) {
  let fullUrl: string = url
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params as any).toString()
    fullUrl = `${url}?${query}`
  }

  return uni.redirectTo({
    url: fullUrl,
    fail: (err) => {
      console.error('页面重定向失败:', err)
    },
  })
}

/** 类型安全的Tab切换函数 */
export function switchTabTyped(url: TabRoute) {
  return uni.switchTab({
    url,
    fail: (err) => {
      console.error('Tab切换失败:', err)
    },
  })
}

/** 返回上一页或指定页面 */
export function goBack(delta: number = 1) {
  const pages = getCurrentPages()
  if (pages.length > delta) {
    uni.navigateBack({
      delta,
      fail: (err) => {
        console.error('返回失败:', err)
        // 如果返回失败，尝试跳转到首页
        switchTabTyped('/pages/index/index')
      },
    })
  }
  else {
    // 如果没有足够的历史页面，跳转到首页
    switchTabTyped('/pages/index/index')
  }
}

/** 路由工具类 */
export class TypedRouter {
  /** 维修模块导航 (10个页面) */

  /** 跳转到维修工单池 */
  static toRepairList(params?: PageParams['/pages-sub/repair/order-list']) {
    return navigateToTyped('/pages-sub/repair/order-list', params)
  }

  /** 跳转到维修待办单 */
  static toRepairDispatch(params?: PageParams['/pages-sub/repair/dispatch']) {
    return navigateToTyped('/pages-sub/repair/dispatch', params)
  }

  /** 跳转到维修已办 */
  static toRepairFinish(params?: PageParams['/pages-sub/repair/finish']) {
    return navigateToTyped('/pages-sub/repair/finish', params)
  }

  /** 跳转到维修详情 */
  static toRepairDetail(repairId: string, storeId: string) {
    return navigateToTyped('/pages-sub/repair/order-detail', { repairId, storeId })
  }

  /** 跳转到新增维修记录 */
  static toAddRepair(communityId?: string) {
    return navigateToTyped('/pages-sub/repair/add-order', { communityId })
  }

  /** 跳转到订单处理 */
  static toRepairHandle(params: PageParams['/pages-sub/repair/handle']) {
    return navigateToTyped('/pages-sub/repair/handle', params)
  }

  /** 跳转到选择物品 */
  static toSelectResource(feeFlag: string) {
    return navigateToTyped('/pages-sub/repair/select-resource', { feeFlag })
  }

  /** 跳转到结束订单 */
  static toEndRepair(repairId: string, communityId: string) {
    return navigateToTyped('/pages-sub/repair/end-order', { repairId, communityId })
  }

  /** 跳转到回访工单 */
  static toAppraiseRepair(params: PageParams['/pages-sub/repair/appraise']) {
    return navigateToTyped('/pages-sub/repair/appraise', params)
  }

  /** 跳转到回复评价 */
  static toReplyAppraise(ruId: string, repairId: string) {
    return navigateToTyped('/pages-sub/repair/appraise-reply', { ruId, repairId })
  }

  /** 投诉模块导航 */
  static toComplaintList(params?: PageParams['/pages-sub/complaint/list']) {
    return navigateToTyped('/pages-sub/complaint/list', params)
  }

  static toComplaintDetail(complaintId: string) {
    return navigateToTyped('/pages-sub/complaint/detail', { complaintId })
  }

  static toComplaintHandle(complaintId: string) {
    return navigateToTyped('/pages-sub/complaint/handle', { complaintId })
  }

  /** 巡检模块导航 */
  static toInspectionList(params?: PageParams['/pages-sub/inspection/list']) {
    return navigateToTyped('/pages-sub/inspection/list', params)
  }

  static toInspectionExecute(taskId: string, type?: 'normal' | 'reexamine') {
    return navigateToTyped('/pages-sub/inspection/execute', { taskId, type })
  }

  /** 基础页面导航 */
  static toLogin(redirect?: string) {
    return navigateToTyped('/pages/login/login', { redirect })
  }

  static toActivityDetail(activitiesId: string, currentCommunityId: string) {
    return navigateToTyped('/pages/activity/detail', { activitiesId, currentCommunityId })
  }

  /** Tab页面切换 */
  static toHome() {
    return switchTabTyped('/pages/index/index')
  }

  static toAddressList() {
    return switchTabTyped('/pages/address/list')
  }

  static toMe() {
    return switchTabTyped('/pages/me/me')
  }

  /** 物业管理模块导航 */
  static toApplyRoomList() {
    return navigateToTyped('/pages-sub/property/apply-room', {})
  }

  static toApplyRoomDetail(ardId: string, communityId: string) {
    return navigateToTyped('/pages-sub/property/apply-room-detail', { ardId, communityId })
  }

  static toApplyRoomRecord(params: PageParams['/pages-sub/property/apply-room-record']) {
    return navigateToTyped('/pages-sub/property/apply-room-record', params)
  }

  static toApplyRoomRecordHandle(params: PageParams['/pages-sub/property/apply-room-record-handle']) {
    return navigateToTyped('/pages-sub/property/apply-room-record-handle', params)
  }

  static toApplyRoomRecordDetail(params: PageParams['/pages-sub/property/apply-room-record-detail']) {
    return navigateToTyped('/pages-sub/property/apply-room-record-detail', params)
  }
}

/** 路由参数解析工具 */
export function parseRouteParams<T extends keyof PageParams>(
  url: string,
): { path: T, params: PageParams[T] } | null {
  try {
    const [path, queryString] = url.split('?')
    const params: any = {}

    if (queryString) {
      const searchParams = new URLSearchParams(queryString)
      searchParams.forEach((value, key) => {
        params[key] = value
      })
    }

    return {
      path: path as T,
      params,
    }
  }
  catch (error) {
    console.error('解析路由参数失败:', error)
    return null
  }
}

/** 路由验证工具 */
export function isValidRoute(path: string): path is PageRoute {
  const validRoutes: PageRoute[] = [
    '/pages/index/index',
    '/pages/about/about',
    '/pages/me/me',
    '/pages/login/login',
    '/pages/address/list',
    '/pages/activity/index',
    '/pages/activity/detail',
    // 维修管理模块
    '/pages-sub/repair/order-list',
    '/pages-sub/repair/dispatch',
    '/pages-sub/repair/finish',
    '/pages-sub/repair/order-detail',
    '/pages-sub/repair/add-order',
    '/pages-sub/repair/handle',
    '/pages-sub/repair/select-resource',
    '/pages-sub/repair/end-order',
    '/pages-sub/repair/appraise',
    '/pages-sub/repair/appraise-reply',
    // 投诉管理模块
    '/pages-sub/complaint/list',
    '/pages-sub/complaint/detail',
    '/pages-sub/complaint/handle',
    // 巡检管理模块
    '/pages-sub/inspection/list',
    '/pages-sub/inspection/execute',
    // 物业管理模块
    '/pages-sub/property/apply-room',
    '/pages-sub/property/apply-room-detail',
    '/pages-sub/property/apply-room-record',
    '/pages-sub/property/apply-room-record-handle',
    '/pages-sub/property/apply-room-record-detail',
  ]

  return validRoutes.includes(path as PageRoute)
}

/** 通用导航工具类 */
export class NavigationUtils {
  /**
   * 预加载页面
   */
  static preloadPage<T extends keyof PageParams>(url: T, params?: PageParams[T]) {
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
      switchTabTyped('/pages/index/index')
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

/** 导出便捷别名 */
export { NavigationUtils as Nav }
