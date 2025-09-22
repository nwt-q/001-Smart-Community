import type { Contact, DepartmentType } from '@/types/contact'
import { createMockContact, DepartmentTypes } from './shared/mockData'
import { createPaginationResponse, defineUniAppMock, errorResponse, generatePhoneNumber, randomDelay, successResponse } from './shared/utils'

/**
 * 通讯录模块 Mock 接口
 * 基于现代化接口架构设计，提供完整的员工通讯录管理功能
 */

// 模拟通讯录数据库
const mockContactDatabase = {
  contacts: Array.from({ length: 30 }, (_, index) =>
    createMockContact((index + 1).toString().padStart(3, '0'))),

  // 获取联系人详情
  getContactById(contactId: string) {
    return this.contacts.find(contact => contact.contactId === contactId)
  },

  // 获取联系人列表（支持筛选）
  getContactList(params: {
    page: number
    row: number
    department?: DepartmentType
    keyword?: string
    isOnline?: boolean
  }) {
    let filteredContacts = [...this.contacts]

    // 部门筛选
    if (params.department) {
      filteredContacts = filteredContacts.filter(contact => contact.department === params.department)
    }

    // 在线状态筛选
    if (params.isOnline !== undefined) {
      filteredContacts = filteredContacts.filter(contact => contact.isOnline === params.isOnline)
    }

    // 关键词筛选
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredContacts = filteredContacts.filter(contact =>
        contact.name.toLowerCase().includes(keyword)
        || contact.position.toLowerCase().includes(keyword)
        || contact.department.toLowerCase().includes(keyword)
        || contact.phone.includes(keyword)
        || contact.email.toLowerCase().includes(keyword),
      )
    }

    // 按部门和姓名排序
    filteredContacts.sort((a, b) => {
      if (a.department !== b.department) {
        return a.department.localeCompare(b.department)
      }
      return a.name.localeCompare(b.name)
    })

    return createPaginationResponse(filteredContacts, params.page, params.row)
  },

  // 按部门分组获取联系人
  getContactsByDepartment() {
    const grouped = this.contacts.reduce((acc, contact) => {
      if (!acc[contact.department]) {
        acc[contact.department] = []
      }
      acc[contact.department].push(contact)
      return acc
    }, {} as Record<DepartmentType, Contact[]>)

    // 排序每个部门内的联系人
    Object.keys(grouped).forEach((dept) => {
      grouped[dept].sort((a, b) => a.name.localeCompare(b.name))
    })

    return grouped
  },

  // 更新联系人在线状态
  updateOnlineStatus(contactId: string, isOnline: boolean) {
    const contact = this.getContactById(contactId)
    if (contact) {
      contact.isOnline = isOnline
      return contact
    }
    return null
  },
}

export default defineUniAppMock([
  // 获取通讯录列表
  {
    url: '/app/contact.listContacts',
    method: ['GET', 'POST'],
    delay: [200, 600],
    body: async ({ query, body }) => {
      await randomDelay(200, 600)

      const params = { ...query, ...body }

      try {
        const result = mockContactDatabase.getContactList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 20,
          department: params.department,
          keyword: params.keyword,
          isOnline: params.isOnline !== undefined ? Boolean(params.isOnline) : undefined,
        })

        console.log('🚀 Mock API: listContacts', params, '→', `${result.list.length} items`)
        return successResponse({
          contacts: result.list,
          total: result.total,
          page: result.page,
          row: result.pageSize,
        }, '获取通讯录列表成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listContacts', error)
        return errorResponse(error.message || '获取通讯录列表失败')
      }
    },
  },

  // 获取联系人详情
  {
    url: '/app/contact.getContactDetail',
    method: ['GET', 'POST'],
    delay: [100, 300],
    body: async ({ query, body }) => {
      await randomDelay(100, 300)

      const params = { ...query, ...body }

      try {
        if (!params.contactId) {
          return errorResponse('联系人ID不能为空', '400')
        }

        const contact = mockContactDatabase.getContactById(params.contactId)
        if (!contact) {
          return errorResponse('联系人不存在', '404')
        }

        console.log('🚀 Mock API: getContactDetail', params, '→', contact)
        return successResponse({
          contact,
        }, '获取联系人详情成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getContactDetail', error)
        return errorResponse(error.message || '获取联系人详情失败')
      }
    },
  },

  // 按部门分组获取通讯录
  {
    url: '/app/contact.getContactsByDepartment',
    method: ['GET', 'POST'],
    delay: [300, 700],
    body: async ({ query, body }) => {
      await randomDelay(300, 700)

      try {
        const groupedContacts = mockContactDatabase.getContactsByDepartment()

        // 转换为数组格式
        const departments = Object.keys(groupedContacts).map(deptName => ({
          departmentName: deptName,
          contacts: groupedContacts[deptName],
          onlineCount: groupedContacts[deptName].filter(c => c.isOnline).length,
          totalCount: groupedContacts[deptName].length,
        }))

        // 按部门名称排序
        departments.sort((a, b) => a.departmentName.localeCompare(b.departmentName))

        console.log('🚀 Mock API: getContactsByDepartment', '→', `${departments.length} departments`)
        return successResponse({
          departments,
          totalContacts: mockContactDatabase.contacts.length,
          onlineContacts: mockContactDatabase.contacts.filter(c => c.isOnline).length,
        }, '获取部门通讯录成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getContactsByDepartment', error)
        return errorResponse(error.message || '获取部门通讯录失败')
      }
    },
  },

  // 搜索联系人
  {
    url: '/app/contact.searchContacts',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      const params = { ...query, ...body }

      try {
        if (!params.keyword?.trim()) {
          return errorResponse('搜索关键词不能为空', '400')
        }

        const result = mockContactDatabase.getContactList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 50,
          keyword: params.keyword,
          department: params.department,
        })

        // 按匹配相关性排序
        const keyword = params.keyword.toLowerCase()
        result.list.sort((a, b) => {
          const aScore = (
            (a.name.toLowerCase().includes(keyword) ? 3 : 0)
            + (a.position.toLowerCase().includes(keyword) ? 2 : 0)
            + (a.department.toLowerCase().includes(keyword) ? 1 : 0)
          )
          const bScore = (
            (b.name.toLowerCase().includes(keyword) ? 3 : 0)
            + (b.position.toLowerCase().includes(keyword) ? 2 : 0)
            + (b.department.toLowerCase().includes(keyword) ? 1 : 0)
          )
          return bScore - aScore
        })

        console.log('🚀 Mock API: searchContacts', params, '→', `${result.list.length} results`)
        return successResponse({
          contacts: result.list,
          total: result.total,
          keyword: params.keyword,
        }, '搜索联系人成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: searchContacts', error)
        return errorResponse(error.message || '搜索联系人失败')
      }
    },
  },

  // 获取部门列表
  {
    url: '/app/contact.getDepartments',
    method: ['GET', 'POST'],
    delay: [100, 200],
    body: async () => {
      await randomDelay(100, 200)

      try {
        const departments = DepartmentTypes.map((deptName) => {
          const deptContacts = mockContactDatabase.contacts.filter(c => c.department === deptName)
          return {
            departmentName: deptName,
            totalCount: deptContacts.length,
            onlineCount: deptContacts.filter(c => c.isOnline).length,
          }
        })

        console.log('🚀 Mock API: getDepartments', '→', departments)
        return successResponse({
          departments,
        }, '获取部门列表成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getDepartments', error)
        return errorResponse(error.message || '获取部门列表失败')
      }
    },
  },

  // 更新联系人在线状态（模拟实时状态）
  {
    url: '/app/contact.updateOnlineStatus',
    method: 'POST',
    delay: [50, 150],
    body: async ({ body }) => {
      await randomDelay(50, 150)

      try {
        if (!body.contactId) {
          return errorResponse('联系人ID不能为空', '400')
        }

        const contact = mockContactDatabase.updateOnlineStatus(
          body.contactId,
          Boolean(body.isOnline),
        )

        if (!contact) {
          return errorResponse('联系人不存在', '404')
        }

        console.log('🚀 Mock API: updateOnlineStatus', body, '→', contact)
        return successResponse({
          contact,
        }, '更新在线状态成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateOnlineStatus', error)
        return errorResponse(error.message || '更新在线状态失败')
      }
    },
  },

  // 获取常用联系人
  {
    url: '/app/contact.getFavoriteContacts',
    method: ['GET', 'POST'],
    delay: [200, 400],
    body: async () => {
      await randomDelay(200, 400)

      try {
        // 模拟返回一些常用联系人
        const favoriteContacts = mockContactDatabase.contacts
          .slice(0, 8)
          .filter(contact => contact.isOnline || Math.random() > 0.3)

        console.log('🚀 Mock API: getFavoriteContacts', '→', favoriteContacts)
        return successResponse({
          contacts: favoriteContacts,
        }, '获取常用联系人成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getFavoriteContacts', error)
        return errorResponse(error.message || '获取常用联系人失败')
      }
    },
  },

  // 获取紧急联系人
  {
    url: '/app/contact.getEmergencyContacts',
    method: ['GET', 'POST'],
    delay: [100, 200],
    body: async () => {
      await randomDelay(100, 200)

      try {
        const emergencyContacts = [
          {
            contactId: 'EMG_001',
            name: '24小时值班室',
            phone: '400-888-9999',
            department: '物业管理处',
            position: '值班',
            description: '24小时为您服务',
            isOnline: true,
            priority: 'HIGH' as const,
          },
          {
            contactId: 'EMG_002',
            name: '保安队长',
            phone: generatePhoneNumber(),
            department: '保安部',
            position: '队长',
            description: '负责社区安全管理',
            isOnline: true,
            priority: 'HIGH' as const,
          },
          {
            contactId: 'EMG_003',
            name: '维修主管',
            phone: generatePhoneNumber(),
            department: '维修部',
            position: '主管',
            description: '负责紧急维修事务',
            isOnline: Math.random() > 0.3,
            priority: 'MEDIUM' as const,
          },
          {
            contactId: 'EMG_004',
            name: '医疗急救',
            phone: '120',
            department: '外部联系',
            position: '急救服务',
            description: '医疗紧急情况',
            isOnline: true,
            priority: 'CRITICAL' as const,
          },
          {
            contactId: 'EMG_005',
            name: '火警报警',
            phone: '119',
            department: '外部联系',
            position: '消防服务',
            description: '火灾紧急情况',
            isOnline: true,
            priority: 'CRITICAL' as const,
          },
          {
            contactId: 'EMG_006',
            name: '治安报警',
            phone: '110',
            department: '外部联系',
            position: '治安服务',
            description: '治安紧急情况',
            isOnline: true,
            priority: 'CRITICAL' as const,
          },
        ]

        console.log('🚀 Mock API: getEmergencyContacts', '→', emergencyContacts)
        return successResponse({
          contacts: emergencyContacts,
        }, '获取紧急联系人成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getEmergencyContacts', error)
        return errorResponse(error.message || '获取紧急联系人失败')
      }
    },
  },
])
