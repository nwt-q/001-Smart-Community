/**
 * API 接口类型定义
 * 基于现代化接口设计，支持完整的类型安全和智能提示
 */

// ========== 通用类型定义 ==========

// 通用响应结构
export interface ApiResponse<T = any> {
  success: boolean
  code: string
  message: string
  data: T
  timestamp: number
}

// 分页请求参数
export interface PaginationParams {
  page: number
  row: number
}

// 分页响应结构
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// 状态枚举
export type StatusType = 'ACTIVE' | 'INACTIVE' | 'DRAFT'
export type PriorityType = 'HIGH' | 'MEDIUM' | 'LOW'

// ========== 活动模块类型 ==========

// 活动基础信息
export interface Activity {
  activitiesId: string
  title: string
  userName: string
  startTime: string
  endTime: string
  context: string
  headerImg?: string
  src?: string
  communityId: string
  createTime: string
  updateTime: string
  status: StatusType
  viewCount: number
  likeCount: number
}

// 活动列表查询参数
export interface ActivityListParams extends PaginationParams {
  activitiesId?: string
  communityId: string
  status?: StatusType
  keyword?: string
  startDate?: string
  endDate?: string
}

// 活动列表响应
export interface ActivityListResponse {
  activitiess: Activity[]
  total: number
  page: number
  row: number
}

// 创建活动请求
export interface CreateActivityReq {
  title: string
  context: string
  startTime: string
  endTime: string
  headerImg?: string
  communityId?: string
  status?: StatusType
}

// 更新活动请求
export interface UpdateActivityReq extends CreateActivityReq {
  activitiesId: string
}

// ========== 维修模块类型 ==========

// 维修状态枚举
export type RepairStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

// 维修类型
export type RepairType = '水电维修' | '门窗维修' | '空调维修' | '电梯维修' | '管道疏通' | '墙面修补' | '其他维修'

// 维修工单信息
export interface RepairOrder {
  repairId: string
  title: string
  description: string
  ownerName: string
  ownerPhone: string
  address: string
  repairType: RepairType
  status: RepairStatus
  priority: PriorityType
  createTime: string
  updateTime: string
  assignedWorker?: string | null
  estimatedCost?: number
  actualCost?: number | null
  images?: string[]
  communityId?: string
  evaluation?: {
    rating: number
    comment: string
    evaluateTime: string
  }
}

// 维修工单列表查询参数
export interface RepairListParams extends PaginationParams {
  communityId?: string
  status?: RepairStatus
  repairType?: RepairType
  keyword?: string
  startDate?: string
  endDate?: string
  assignedWorker?: string
}

// 维修工单列表响应
export interface RepairListResponse {
  ownerRepairs: RepairOrder[]
  total: number
  page: number
  row: number
}

// 创建维修工单请求
export interface CreateRepairReq {
  title: string
  description: string
  ownerName: string
  ownerPhone: string
  address: string
  repairType?: RepairType
  priority?: PriorityType
  estimatedCost?: number
  images?: string[]
  communityId?: string
}

// 更新维修工单请求
export interface UpdateRepairReq extends Partial<CreateRepairReq> {
  repairId: string
}

// 维修工单统计
export interface RepairStatistics {
  total: number
  statusStats: Record<RepairStatus, number>
  typeStats: Record<string, number>
  monthlyStats: Record<string, number>
  avgResponseTime: string
  satisfactionRate: string
}

// ========== 通讯录模块类型 ==========

// 部门类型
export type DepartmentType = '物业管理处' | '保安部' | '清洁部' | '维修部' | '客服部' | '财务部'

// 联系人信息
export interface Contact {
  contactId: string
  name: string
  position: string
  department: DepartmentType
  phone: string
  email?: string
  workTime?: string
  avatar?: string
  description?: string
  isOnline: boolean
}

// 紧急联系人
export interface EmergencyContact extends Contact {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
}

// 通讯录列表查询参数
export interface ContactListParams extends PaginationParams {
  department?: DepartmentType
  keyword?: string
  isOnline?: boolean
}

// 通讯录列表响应
export interface ContactListResponse {
  contacts: Contact[]
  total: number
  page: number
  row: number
}

// 部门信息
export interface Department {
  departmentName: DepartmentType
  totalCount: number
  onlineCount: number
  contacts?: Contact[]
}

// 按部门分组的通讯录响应
export interface ContactsByDepartmentResponse {
  departments: Department[]
  totalContacts: number
  onlineContacts: number
}

// ========== 投诉模块类型 ==========

// 投诉状态
export type ComplaintStatus = 'SUBMITTED' | 'PROCESSING' | 'RESOLVED' | 'CLOSED'

// 投诉类型
export type ComplaintType = '噪音投诉' | '卫生问题' | '设施损坏' | '服务态度' | '收费问题' | '其他投诉'

// 投诉工单
export interface Complaint {
  complaintId: string
  title: string
  description: string
  complaintType: ComplaintType
  ownerName: string
  ownerPhone: string
  address?: string
  status: ComplaintStatus
  priority: PriorityType
  createTime: string
  updateTime: string
  assignedHandler?: string
  images?: string[]
  communityId: string
  response?: {
    content: string
    handlerName: string
    responseTime: string
  }
  satisfaction?: {
    rating: number
    comment: string
    evaluateTime: string
  }
}

// 投诉列表查询参数
export interface ComplaintListParams extends PaginationParams {
  communityId?: string
  status?: ComplaintStatus
  complaintType?: ComplaintType
  keyword?: string
  startDate?: string
  endDate?: string
}

// 创建投诉请求
export interface CreateComplaintReq {
  title: string
  description: string
  complaintType: ComplaintType
  ownerName: string
  ownerPhone: string
  address?: string
  priority?: PriorityType
  images?: string[]
  communityId?: string
}

// ========== 公告模块类型 ==========

// 公告类型
export type AnnouncementType = 'NOTICE' | 'EVENT' | 'MAINTENANCE' | 'URGENT'

// 公告信息
export interface Announcement {
  announcementId: string
  title: string
  content: string
  type: AnnouncementType
  publisherName: string
  publishTime: string
  effectiveTime?: string
  expiryTime?: string
  status: StatusType
  isTop: boolean
  viewCount: number
  communityId: string
  attachments?: string[]
  targetAudience?: string[] // 目标受众（全体/特定楼栋等）
}

// 公告列表查询参数
export interface AnnouncementListParams extends PaginationParams {
  communityId?: string
  type?: AnnouncementType
  status?: StatusType
  keyword?: string
  isTop?: boolean
}

// ========== 用户模块类型 ==========

// 用户信息
export interface User {
  userId: string
  username: string
  nickname?: string
  avatar?: string
  phone: string
  email?: string
  realName?: string
  idCard?: string
  communityId: string
  buildingInfo?: {
    building: string
    unit: string
    room: string
  }
  userType: 'OWNER' | 'TENANT' | 'PROPERTY_STAFF' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  createTime: string
  updateTime: string
  lastLoginTime?: string
}

// 登录请求
export interface LoginReq {
  username: string
  password: string
  captcha?: string
  remember?: boolean
}

// 登录响应
export interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
  expiresIn: number
}

// ========== 文件上传类型 ==========

// 文件上传响应
export interface UploadResponse {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadTime: string
}

// ========== Mock 专用类型 ==========

// Mock 请求上下文
export interface MockRequestContext {
  query: Record<string, any>
  body: Record<string, any>
  headers: Record<string, string>
  method: string
  url: string
}

// Mock 响应选项
export interface MockResponseOptions {
  status?: number
  statusText?: string
  headers?: Record<string, string>
  delay?: number | [number, number]
}

// Mock 处理器函数
export type MockHandler<T = any> = (
  context: MockRequestContext
) => Promise<ApiResponse<T>> | ApiResponse<T>

// 导出所有类型
export type {
  // 活动模块
  Activity,
  ActivityListParams,
  ActivityListResponse,
  Announcement,
  AnnouncementListParams,

  // 公告模块
  AnnouncementType,
  // 通用类型
  ApiResponse,
  Complaint,
  ComplaintListParams,
  // 投诉模块
  ComplaintStatus,

  ComplaintType,
  Contact,
  ContactListParams,
  ContactListResponse,
  ContactsByDepartmentResponse,
  CreateActivityReq,
  CreateComplaintReq,
  CreateRepairReq,

  Department,
  // 通讯录模块
  DepartmentType,
  EmergencyContact,
  LoginReq,
  LoginResponse,
  MockHandler,
  // Mock 相关
  MockRequestContext,

  MockResponseOptions,
  PaginationParams,
  PaginationResponse,
  PriorityType,
  RepairListParams,

  RepairListResponse,
  RepairOrder,
  RepairStatistics,

  // 维修模块
  RepairStatus,
  RepairType,
  StatusType,

  UpdateActivityReq,

  UpdateRepairReq,
  // 文件上传
  UploadResponse,
  // 用户模块
  User,
}
