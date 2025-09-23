/**
 * 路由系统类型定义
 */

// 页面路由类型
export type PageRoute
  = | '/pages/index/index'
    | '/pages/about/about'
    | '/pages/me/me'
    | '/pages/login/login'
    | '/pages/activity/activities'
    | '/pages/activity/detail'

// Tab页面路由类型
export type TabRoute
  = | '/pages/index/index'
    | '/pages/about/about'
    | '/pages/me/me'

// 页面参数类型映射
export interface PageParams {
  '/pages/index/index': {}
  '/pages/about/about': {}
  '/pages/me/me': {}
  '/pages/login/login': {
    redirect?: string
  }
  '/pages/activity/activities': {
    currentCommunityId: string
  }
  '/pages/activity/detail': {
    activitiesId: string
    currentCommunityId: string
  }
}

// 页面配置类型
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

// 路由跳转选项
export interface NavigationOptions {
  animationType?: 'pop-in' | 'fade-in' | 'slide-in-right' | 'slide-in-left' | 'slide-in-top' | 'slide-in-bottom' | 'none'
  animationDuration?: number
  success?: () => void
  fail?: (err: any) => void
  complete?: () => void
}

// 路由守卫类型
export type RouteGuard = (to: string, from: string) => boolean | Promise<boolean>

// 路由信息类型
export interface RouteInfo {
  path: string
  query: Record<string, string>
  params: Record<string, any>
}

// 路由历史记录类型
export interface RouteHistory {
  path: string
  timestamp: number
  params?: Record<string, any>
}
