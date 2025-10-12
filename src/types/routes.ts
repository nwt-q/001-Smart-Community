/**
 * 路由系统类型定义
 * 支持约定式路由和强类型推断
 */

/** 页面路由类型（完整版本，包含主包和分包） */
export type PageRoute
  /** 主包页面 */
  = | '/pages/index/index'
    | '/pages/about/about'
    | '/pages/me/me'
    | '/pages/login/login'
    | '/pages/address/list'
    | '/pages/activity/index'
    | '/pages/activity/detail'
  /** 分包页面 */
    | '/pages-sub/repair/order-list'
    | '/pages-sub/repair/add-order'
    | '/pages-sub/repair/order-detail'
    | '/pages-sub/complaint/list'
    | '/pages-sub/complaint/detail'
    | '/pages-sub/complaint/handle'
    | '/pages-sub/inspection/list'
    | '/pages-sub/inspection/execute'
    | '/pages-sub/property/apply-room'
    | '/pages-sub/property/apply-room-detail'
    | '/pages-sub/property/apply-room-record'
    | '/pages-sub/property/apply-room-record-handle'
    | '/pages-sub/property/apply-room-record-detail'

/** Tab页面路由类型 */
export type TabRoute
  = | '/pages/index/index'
    | '/pages/address/list'
    | '/pages/me/me'

/** 页面参数类型映射（强类型约束） */
export interface PageParams {
  '/pages/index/index': {}
  '/pages/about/about': {}
  '/pages/me/me': {}
  '/pages/login/login': {
    redirect?: string
  }
  '/pages/address/list': {}
  '/pages/activity/index': {
    currentCommunityId: string
  }
  '/pages/activity/detail': {
    activitiesId: string
    currentCommunityId: string
  }
  /** 维修模块参数 */
  '/pages-sub/repair/order-list': {
    status?: 'pending' | 'processing' | 'completed'
    type?: string
  }
  '/pages-sub/repair/add-order': {
    communityId?: string
  }
  '/pages-sub/repair/order-detail': {
    repairId: string
    status?: string
  }
  /** 投诉模块参数 */
  '/pages-sub/complaint/list': {
    status?: 'pending' | 'processing' | 'resolved'
  }
  '/pages-sub/complaint/detail': {
    complaintId: string
  }
  '/pages-sub/complaint/handle': {
    complaintId: string
  }
  /** 巡检模块参数 */
  '/pages-sub/inspection/list': {
    status?: 'pending' | 'completed'
  }
  '/pages-sub/inspection/execute': {
    taskId: string
    type?: 'normal' | 'reexamine'
  }
  /** 物业管理模块参数 */
  '/pages-sub/property/apply-room': {}
  '/pages-sub/property/apply-room-detail': {
    ardId: string
    communityId: string
  }
  '/pages-sub/property/apply-room-record': {
    ardId: string
    communityId: string
    roomId: string
    roomName: string
    state: string
    stateName: string
  }
  '/pages-sub/property/apply-room-record-handle': {
    ardId: string
    communityId: string
    roomId: string
    roomName: string
    state: string
    stateName: string
  }
  '/pages-sub/property/apply-room-record-detail': {
    ardrId: string
    applicationId: string
    roomId: string
    roomName: string
    communityId: string
    state: string
    stateName: string
  }
}

/** 页面配置类型 */
export interface PageConfig {
  navigationBarTitleText?: string
  navigationBarBackgroundColor?: string
  navigationBarTextStyle?: 'black' | 'white'
  navigationStyle?: 'default' | 'custom'
  backgroundColor?: string
  backgroundTextStyle?: 'dark' | 'light'
  enablePullDownRefresh?: boolean
  onReachBottomDistance?: number
  backgroundColorTop?: string
  backgroundColorBottom?: string
  titlePenetrate?: 'YES' | 'NO'
  app?: {
    titleNView?: any
    subNVues?: any[]
  }
  h5?: {
    titleNView?: any
    pullToRefresh?: any
  }
  mp?: {
    navigationStyle?: 'default' | 'custom'
  }
}

/** 路由跳转选项 */
export interface NavigationOptions {
  animationType?: 'pop-in' | 'fade-in' | 'slide-in-right' | 'slide-in-left' | 'slide-in-top' | 'slide-in-bottom' | 'none'
  animationDuration?: number
  success?: () => void
  fail?: (err: any) => void
  complete?: () => void
}

/** 路由守卫类型 */
export type RouteGuard = (to: string, from: string) => boolean | Promise<boolean>

/** 路由信息类型 */
export interface RouteInfo {
  path: string
  query: Record<string, string>
  params: Record<string, any>
}

/** 路由历史记录类型 */
export interface RouteHistory {
  path: string
  timestamp: number
  params?: Record<string, any>
}
