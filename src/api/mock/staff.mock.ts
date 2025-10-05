import type { Staff, StaffListResponse, StaffQueryParams } from '@/types/staff'
import { defineUniAppMock, errorResponse, mockLog, randomDelay, successResponse } from './shared/utils'

/**
 * 员工通讯录 Mock 接口 - 完全自包含架构
 * 模拟原项目的 queryStaffInfos 接口行为
 *
 * 数据库对象 + 接口定义 + 数据生成器全部集成在此文件中
 */

// ==================== 员工数据生成器 ====================

/** 职位配置（基于原项目的物业管理体系） */
const POSITIONS = [
  '项目经理',
  '物业主管',
  '客服专员',
  '维修工程师',
  '保安队长',
  '清洁主管',
  '财务专员',
  '行政助理',
]

/** 部门/组织配置 */
const ORGANIZATIONS = [
  '物业管理处',
  '客服部',
  '维修部',
  '保安部',
  '清洁部',
  '财务部',
  '行政部',
]

/** 中文姓名生成器 */
function generateChineseName(): string {
  const surnames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英']

  const surname = surnames[Math.floor(Math.random() * surnames.length)]
  const name = names[Math.floor(Math.random() * names.length)]
  return surname + name
}

/** 电话号码生成器 */
function generatePhoneNumber(): string {
  const prefixes = ['138', '139', '136', '137', '135', '159', '158', '150', '151', '152']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  return prefix + suffix
}

/** 获取拼音首字母（简化版） */
function getInitials(name: string): string {
  const initialMap: Record<string, string> = {
    张: 'Z',
    王: 'W',
    李: 'L',
    赵: 'Z',
    刘: 'L',
    陈: 'C',
    杨: 'Y',
    黄: 'H',
    周: 'Z',
    吴: 'W',
    徐: 'X',
    孙: 'S',
    胡: 'H',
    朱: 'Z',
    高: 'G',
    林: 'L',
    何: 'H',
    郭: 'G',
    马: 'M',
    罗: 'L',
  }

  const firstChar = name.charAt(0)
  return initialMap[firstChar] || firstChar.toUpperCase()
}

/** 核心员工数据生成器（完全匹配原项目的数据结构） */
function createMockStaff(id: string): Staff {
  const name = generateChineseName()
  const initials = getInitials(name)

  return {
    id: `STAFF_${id}`,
    name,
    tel: generatePhoneNumber(),
    orgName: ORGANIZATIONS[Math.floor(Math.random() * ORGANIZATIONS.length)],
    initials,
    position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
    email: `staff${id}@property.com`,
    avatar: `https://picsum.photos/100/100?random=${id}`,
    isOnline: Math.random() > 0.3,
  }
}

// ==================== 员工数据库对象 ====================

const mockStaffDatabase = {
  /** 初始化员工数据（模拟原项目的数据量） */
  staffs: Array.from({ length: 50 }, (_, index) =>
    createMockStaff((index + 1).toString().padStart(3, '0'))) as Staff[],

  /** 获取员工详情 */
  getStaffById(staffId: string): Staff | undefined {
    return this.staffs.find(staff => staff.id === staffId)
  },

  /** 查询员工列表（完全匹配原项目的 queryStaffInfos 逻辑） */
  queryStaffInfos(params: StaffQueryParams): StaffListResponse {
    let filteredStaffs = [...this.staffs]

    // 按名称搜索（兼容原项目的 name 参数）
    if (params.name?.trim()) {
      const keyword = params.name.toLowerCase()
      filteredStaffs = filteredStaffs.filter(staff =>
        staff.name.toLowerCase().includes(keyword)
        || staff.position?.toLowerCase().includes(keyword)
        || staff.orgName.toLowerCase().includes(keyword),
      )
    }

    // 按组织筛选
    if (params.orgName?.trim()) {
      filteredStaffs = filteredStaffs.filter(staff =>
        staff.orgName === params.orgName,
      )
    }

    // 按首字母筛选
    if (params.initials?.trim()) {
      filteredStaffs = filteredStaffs.filter(staff =>
        staff.initials === params.initials,
      )
    }

    // 按首字母排序（完全兼容原项目的 localeCompare 逻辑）
    filteredStaffs.sort((a, b) => {
      return (`${a.initials}`).localeCompare(`${b.initials}`)
    })

    // 分页处理
    const page = params.page || 1
    const row = params.row || 1000
    const startIndex = (page - 1) * row
    const endIndex = startIndex + row
    const paginatedStaffs = filteredStaffs.slice(startIndex, endIndex)

    return {
      staffs: paginatedStaffs,
      total: filteredStaffs.length,
      page,
      row,
    }
  },

  /** 按部门获取员工 */
  getStaffsByDepartment(orgName: string): Staff[] {
    return this.staffs.filter(staff => staff.orgName === orgName)
  },

  /** 获取所有组织 */
  getAllOrganizations(): string[] {
    const orgSet = new Set(this.staffs.map(staff => staff.orgName))
    return Array.from(orgSet).sort()
  },

  /** 搜索员工（增强版搜索） */
  searchStaffs(keyword: string): Staff[] {
    if (!keyword?.trim()) {
      return []
    }

    const lowerKeyword = keyword.toLowerCase()
    return this.staffs.filter(staff =>
      staff.name.toLowerCase().includes(lowerKeyword)
      || staff.tel.includes(keyword)
      || staff.position?.toLowerCase().includes(lowerKeyword)
      || staff.orgName.toLowerCase().includes(lowerKeyword)
      || staff.email?.toLowerCase().includes(lowerKeyword),
    )
  },

  /** 获取在线员工 */
  getOnlineStaffs(): Staff[] {
    return this.staffs.filter(staff => staff.isOnline)
  },

  /** 更新员工在线状态（模拟实时状态变化） */
  updateStaffOnlineStatus(staffId: string, isOnline: boolean): Staff | null {
    const staff = this.getStaffById(staffId)
    if (staff) {
      staff.isOnline = isOnline
      return staff
    }
    return null
  },

  /** 添加新员工（模拟数据增长） */
  addStaff(staff: Omit<Staff, 'id'>): Staff {
    const newStaff: Staff = {
      ...staff,
      id: `STAFF_${Date.now()}`,
    }
    this.staffs.unshift(newStaff)
    return newStaff
  },
}

export default defineUniAppMock([
  // ==================== 核心接口：queryStaffInfos ====================
  /** 对应原项目的 queryStaffInfos 接口 */
  {
    url: '/app/query.staff.infos',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)

      // 合并 GET 和 POST 参数（兼容原项目的请求方式）
      const params = { ...query, ...body }

      try {
        mockLog('queryStaffInfos', params)

        // 验证必要参数
        if (!params.storeId) {
          console.warn('⚠️  Missing storeId parameter, using default')
        }

        const result = mockStaffDatabase.queryStaffInfos({
          page: Number(params.page) || 1,
          row: Number(params.row) || 1000,
          storeId: params.storeId || 'DEFAULT_STORE',
          name: params.name,
          orgName: params.orgName,
          initials: params.initials,
        })

        mockLog('queryStaffInfos result', {
          total: result.total,
          staffsCount: result.staffs.length,
        })

        return successResponse({
          staffs: result.staffs,
          total: result.total,
          page: result.page,
          row: result.row,
        }, '查询员工信息成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: queryStaffInfos', error)
        return errorResponse(error.message || '查询员工信息失败')
      }
    },
  },

  // ==================== 获取员工详情 ====================
  /** 获取员工详情 */
  {
    url: '/app/staff/:staffId',
    method: 'GET',
    delay: [200, 400],
    body: async ({ params }) => {
      await randomDelay(200, 400)

      try {
        mockLog('getStaffDetail', params.staffId)

        const staff = mockStaffDatabase.getStaffById(params.staffId)

        if (!staff) {
          return errorResponse('员工不存在')
        }

        mockLog('getStaffDetail result', staff.name)
        return successResponse(staff, '获取员工详情成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getStaffDetail', error)
        return errorResponse(error.message || '获取员工详情失败')
      }
    },
  },

  // ==================== 按部门获取员工列表 ====================
  /** 按部门获取员工列表 */
  {
    url: '/app/staff/by-department',
    method: ['GET', 'POST'],
    delay: [400, 600],
    body: async ({ query, body }) => {
      await randomDelay(400, 600)

      const params = { ...query, ...body }

      try {
        const orgName = params.orgName || ''
        mockLog('getStaffByDepartment', { orgName })

        const staffs = mockStaffDatabase.getStaffsByDepartment(orgName)

        mockLog('getStaffByDepartment result', `${staffs.length} staffs`)

        return successResponse({
          staffs,
          total: staffs.length,
          page: 1,
          row: staffs.length,
        }, '获取部门员工成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getStaffByDepartment', error)
        return errorResponse(error.message || '获取部门员工失败')
      }
    },
  },

  // ==================== 搜索员工（增强版） ====================
  /** 搜索员工（增强版） */
  {
    url: '/app/staff/search',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      const params = { ...query, ...body }

      try {
        mockLog('searchStaffs', { keyword: params.keyword })

        if (!params.keyword?.trim()) {
          return errorResponse('搜索关键词不能为空')
        }

        const staffs = mockStaffDatabase.searchStaffs(params.keyword)

        mockLog('searchStaffs result', `${staffs.length} results`)

        return successResponse({
          staffs,
          total: staffs.length,
          keyword: params.keyword,
        }, '搜索员工成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: searchStaffs', error)
        return errorResponse(error.message || '搜索员工失败')
      }
    },
  },

  // ==================== 获取组织列表 ====================
  /** 获取组织列表 */
  {
    url: '/app/staff/organizations',
    method: 'GET',
    delay: [100, 200],
    body: async () => {
      await randomDelay(100, 200)

      try {
        mockLog('getOrganizations')

        const organizations = mockStaffDatabase.getAllOrganizations()

        // 计算每个组织的员工数量
        const orgStats = organizations.map(orgName => ({
          orgName,
          staffCount: mockStaffDatabase.getStaffsByDepartment(orgName).length,
          onlineCount: mockStaffDatabase.getStaffsByDepartment(orgName).filter(s => s.isOnline).length,
        }))

        mockLog('getOrganizations result', `${organizations.length} organizations`)

        return successResponse({
          organizations: orgStats,
          totalOrganizations: organizations.length,
          totalStaffs: mockStaffDatabase.staffs.length,
        }, '获取组织列表成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getOrganizations', error)
        return errorResponse(error.message || '获取组织列表失败')
      }
    },
  },

  // ==================== 更新员工在线状态 ====================
  /** 更新员工在线状态 */
  {
    url: '/app/staff/update-online-status',
    method: 'POST',
    delay: [50, 150],
    body: async ({ body }) => {
      await randomDelay(50, 150)

      try {
        const { staffId, isOnline } = body
        mockLog('updateStaffOnlineStatus', body)

        if (!staffId) {
          return errorResponse('员工ID不能为空')
        }

        const staff = mockStaffDatabase.updateStaffOnlineStatus(staffId, Boolean(isOnline))

        if (!staff) {
          return errorResponse('员工不存在')
        }

        mockLog('updateStaffOnlineStatus result', staff.name)

        return successResponse({
          staff,
        }, '更新在线状态成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateStaffOnlineStatus', error)
        return errorResponse(error.message || '更新在线状态失败')
      }
    },
  },

  // ==================== 获取在线员工列表 ====================
  /** 获取在线员工列表 */
  {
    url: '/app/staff/online',
    method: 'GET',
    delay: [200, 300],
    body: async () => {
      await randomDelay(200, 300)

      try {
        mockLog('getOnlineStaffs')

        const onlineStaffs = mockStaffDatabase.getOnlineStaffs()

        mockLog('getOnlineStaffs result', `${onlineStaffs.length} online staffs`)

        return successResponse({
          staffs: onlineStaffs,
          total: onlineStaffs.length,
          onlineRatio: Math.round((onlineStaffs.length / mockStaffDatabase.staffs.length) * 100),
        }, '获取在线员工成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getOnlineStaffs', error)
        return errorResponse(error.message || '获取在线员工失败')
      }
    },
  },

  // ==================== 添加新员工（测试用） ====================
  /** 添加新员工（测试用） */
  {
    url: '/app/staff/add',
    method: 'POST',
    delay: [500, 1000],
    body: async ({ body }) => {
      await randomDelay(500, 1000)

      try {
        const { name, tel, orgName, position } = body
        mockLog('addStaff', body)

        if (!name || !tel || !orgName) {
          return errorResponse('姓名、电话和组织名称不能为空')
        }

        const newStaff = mockStaffDatabase.addStaff({
          name,
          tel,
          orgName,
          position: position || '员工',
          initials: getInitials(name),
          email: body.email,
          isOnline: true,
        })

        mockLog('addStaff result', newStaff)

        return successResponse({
          staff: newStaff,
        }, '添加员工成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: addStaff', error)
        return errorResponse(error.message || '添加员工失败')
      }
    },
  },
])
