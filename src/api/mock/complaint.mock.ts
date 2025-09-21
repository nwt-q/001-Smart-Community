import type { Complaint, ComplaintListParams, ComplaintStatus, ComplaintType, CreateComplaintReq } from '@/types/api'
import { defineMock } from 'vite-plugin-mock-dev-server'
import { createPaginationResponse, errorResponse, generateAddress, generateChineseName, generateId, generatePhoneNumber, generateStatus, generateTimeRange, randomDelay, successResponse } from './shared/utils'

/**
 * 投诉模块 Mock 接口
 * 展示从 Java110Context + uni.request 向现代化架构的完整迁移案例
 */

// 投诉类型配置
const ComplaintTypes: ComplaintType[] = ['噪音投诉', '卫生问题', '设施损坏', '服务态度', '收费问题', '其他投诉']
const ComplaintStatuses: ComplaintStatus[] = ['SUBMITTED', 'PROCESSING', 'RESOLVED', 'CLOSED']

// 生成模拟投诉数据
function createMockComplaint(id: string): Complaint {
  const complaintType = generateStatus(ComplaintTypes)
  const status = generateStatus(ComplaintStatuses)
  const now = Date.now()
  const createTime = generateTimeRange(-30, 0)

  return {
    complaintId: `COMP_${id}`,
    title: `${complaintType} - ${generateChineseName()}的投诉`,
    description: generateComplaintDescription(complaintType),
    complaintType,
    ownerName: generateChineseName(),
    ownerPhone: generatePhoneNumber(),
    address: generateAddress(),
    status,
    priority: generateStatus(['HIGH', 'MEDIUM', 'LOW']),
    createTime,
    updateTime: status === 'SUBMITTED' ? createTime : generateTimeRange(-15, 0),
    assignedHandler: status === 'SUBMITTED' ? undefined : `处理员${Math.floor(Math.random() * 5 + 1)}`,
    images: Math.random() > 0.5 ? [`https://picsum.photos/400/300?random=${id}`] : [],
    communityId: 'COMM_001',
    response: status === 'RESOLVED' || status === 'CLOSED' ? {
      content: generateResponseContent(complaintType),
      handlerName: `处理员${Math.floor(Math.random() * 5 + 1)}`,
      responseTime: generateTimeRange(-10, 0),
    } : undefined,
    satisfaction: status === 'CLOSED' && Math.random() > 0.3 ? {
      rating: Math.floor(Math.random() * 2) + 4, // 4-5星
      comment: ['服务很好，处理及时', '态度不错，问题解决了', '效率很高，感谢', '处理得当'][Math.floor(Math.random() * 4)],
      evaluateTime: generateTimeRange(-5, 0),
    } : undefined,
  }
}

// 生成投诉描述
function generateComplaintDescription(type: ComplaintType): string {
  const descriptions = {
    噪音投诉: [
      '楼上住户深夜装修噪音严重，影响正常休息',
      '隔壁邻居经常播放音响声音过大',
      '楼道内有人员大声喧哗，影响其他住户',
      '地下车库机械设备噪音过大',
    ],
    卫生问题: [
      '楼道垃圾未及时清理，异味严重',
      '电梯内有异味，卫生状况堪忧',
      '小区绿化带有垃圾堆积',
      '公共区域清洁不到位',
    ],
    设施损坏: [
      '电梯频繁故障，影响正常出行',
      '楼道照明设备损坏未维修',
      '小区健身器材损坏存在安全隐患',
      '停车场地面破损，车辆容易受损',
    ],
    服务态度: [
      '物业工作人员服务态度不佳',
      '保安人员对业主态度冷漠',
      '客服回复不及时，处理问题拖拉',
      '维修人员上门服务态度有待改善',
    ],
    收费问题: [
      '物业费收取标准不明确',
      '停车费收费过高且没有合理解释',
      '水电费分摊不合理',
      '额外收费项目未经业主同意',
    ],
    其他投诉: [
      '小区安全管理存在漏洞',
      '快递柜使用不便',
      '访客登记制度不完善',
      '业主活动组织不当',
    ],
  }

  const typeDescriptions = descriptions[type] || descriptions['其他投诉']
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)]
}

// 生成回复内容
function generateResponseContent(type: ComplaintType): string {
  const responses = {
    噪音投诉: [
      '感谢您的投诉，我们已经联系相关住户并进行了沟通，要求其注意作息时间，避免产生噪音。同时我们会加强巡查，如有再次发生类似情况，请及时联系我们。',
      '针对您反映的噪音问题，我们已制定了《住户装修管理规定》，规范装修时间为工作日8:00-18:00，周末9:00-17:00。已对违规住户进行了教育和警告。',
    ],
    卫生问题: [
      '感谢您的反馈，我们已立即安排清洁人员对相关区域进行了深度清洁，并调整了清洁频次。后续我们会加强日常巡查，确保公共区域卫生达标。',
      '针对您反映的卫生问题，我们已对保洁人员进行了培训，制定了更详细的清洁标准和检查制度。问题区域已完成整改。',
    ],
    设施损坏: [
      '感谢您的及时反馈，我们已联系专业维修公司对损坏设施进行了修复，并已通过验收。为避免类似问题再次发生，我们会加强设施的日常维护和检查。',
      '您反映的设施问题我们非常重视，已完成维修并进行了安全检测。同时我们建立了设施设备台账，实行定期巡检制度。',
    ],
    服务态度: [
      '非常感谢您的意见反馈，我们已对相关工作人员进行了谈话和培训，要求其改进服务态度。我们会持续加强员工服务意识培训，为业主提供更优质的服务。',
      '您的投诉我们已经重视并处理，对涉事员工进行了严肃批评教育。我们将建立服务质量监督机制，定期进行服务满意度调查。',
    ],
    收费问题: [
      '关于您反映的收费问题，我们已重新核算并提供了详细的费用明细。如有疑问，欢迎您到物业服务中心查看相关收费依据和标准。',
      '感谢您的监督，我们已对收费标准进行了公示，并建立了费用查询制度。如有任何收费疑问，可随时向我们咨询。',
    ],
    其他投诉: [
      '感谢您的宝贵建议，我们已对相关管理制度进行了完善，并将在今后的工作中持续改进，为业主提供更好的居住环境。',
      '您的意见我们非常重视，已成立专项工作组进行整改。我们会定期收集业主意见，不断优化管理和服务水平。',
    ],
  }

  const typeResponses = responses[type] || responses['其他投诉']
  return typeResponses[Math.floor(Math.random() * typeResponses.length)]
}

// 模拟投诉数据库
const mockComplaintDatabase = {
  complaints: Array.from({ length: 40 }, (_, index) =>
    createMockComplaint((index + 1).toString().padStart(3, '0'))),

  // 获取投诉详情
  getComplaintById(complaintId: string) {
    return this.complaints.find(complaint => complaint.complaintId === complaintId)
  },

  // 获取投诉列表
  getComplaintList(params: ComplaintListParams & { status?: ComplaintStatus, complaintType?: ComplaintType, keyword?: string, startDate?: string, endDate?: string }) {
    let filtered = [...this.complaints]

    // 状态筛选
    if (params.status) {
      filtered = filtered.filter(c => c.status === params.status)
    }

    // 投诉类型筛选
    if (params.complaintType) {
      filtered = filtered.filter(c => c.complaintType === params.complaintType)
    }

    // 关键词筛选
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(keyword)
        || c.description.toLowerCase().includes(keyword)
        || c.ownerName.toLowerCase().includes(keyword)
        || c.address?.toLowerCase().includes(keyword),
      )
    }

    // 日期范围筛选
    if (params.startDate) {
      filtered = filtered.filter(c => new Date(c.createTime) >= new Date(params.startDate!))
    }
    if (params.endDate) {
      filtered = filtered.filter(c => new Date(c.createTime) <= new Date(params.endDate!))
    }

    // 按创建时间倒序
    filtered.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())

    return createPaginationResponse(filtered, params.page, params.row)
  },

  // 添加投诉
  addComplaint(complaint: Complaint) {
    this.complaints.unshift(complaint)
    return complaint
  },

  // 更新投诉状态
  updateComplaintStatus(complaintId: string, status: ComplaintStatus, assignedHandler?: string) {
    const complaint = this.getComplaintById(complaintId)
    if (complaint) {
      complaint.status = status
      complaint.updateTime = new Date().toISOString()
      if (assignedHandler) {
        complaint.assignedHandler = assignedHandler
      }
      return complaint
    }
    return null
  },
}

export default defineMock([
  // 获取投诉列表
  {
    url: '/api/app/complaint.listComplaints',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)

      const params = { ...query, ...body }

      try {
        const result = mockComplaintDatabase.getComplaintList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
          communityId: params.communityId,
          status: params.status,
          complaintType: params.complaintType,
          keyword: params.keyword,
          startDate: params.startDate,
          endDate: params.endDate,
        })

        console.log('🚀 Mock API: listComplaints', params, '→', `${result.list.length} items`)
        return successResponse({
          complaints: result.list,
          total: result.total,
          page: result.page,
          row: result.pageSize,
        }, '获取投诉列表成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listComplaints', error)
        return errorResponse(error.message || '获取投诉列表失败')
      }
    },
  },

  // 获取投诉详情
  {
    url: '/api/app/complaint.getComplaintDetail',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      const params = { ...query, ...body }

      try {
        if (!params.complaintId) {
          return errorResponse('投诉ID不能为空', '400')
        }

        const complaint = mockComplaintDatabase.getComplaintById(params.complaintId)
        if (!complaint) {
          return errorResponse('投诉记录不存在', '404')
        }

        console.log('🚀 Mock API: getComplaintDetail', params, '→', complaint)
        return successResponse({
          complaint,
        }, '获取投诉详情成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getComplaintDetail', error)
        return errorResponse(error.message || '获取投诉详情失败')
      }
    },
  },

  // 提交投诉
  {
    url: '/api/app/complaint.submitComplaint',
    method: 'POST',
    delay: [600, 1200],
    body: async ({ body }) => {
      await randomDelay(600, 1200)

      try {
        const data = body as CreateComplaintReq

        // 数据验证
        if (!data.title?.trim()) {
          return errorResponse('投诉标题不能为空', '400')
        }
        if (!data.description?.trim()) {
          return errorResponse('投诉描述不能为空', '400')
        }
        if (!data.ownerName?.trim()) {
          return errorResponse('投诉人姓名不能为空', '400')
        }
        if (!data.ownerPhone?.trim()) {
          return errorResponse('联系电话不能为空', '400')
        }

        const newComplaint: Complaint = {
          complaintId: generateId('COMP'),
          title: data.title,
          description: data.description,
          complaintType: data.complaintType,
          ownerName: data.ownerName,
          ownerPhone: data.ownerPhone,
          address: data.address,
          status: 'SUBMITTED',
          priority: data.priority || 'MEDIUM',
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          images: data.images || [],
          communityId: data.communityId || 'COMM_001',
        }

        mockComplaintDatabase.addComplaint(newComplaint)
        console.log('🚀 Mock API: submitComplaint', data, '→', newComplaint)
        return successResponse({
          complaint: newComplaint,
        }, '投诉提交成功，我们会尽快处理')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: submitComplaint', error)
        return errorResponse(error.message || '投诉提交失败')
      }
    },
  },

  // 处理投诉
  {
    url: '/api/app/complaint.handleComplaint',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)

      try {
        if (!body.complaintId) {
          return errorResponse('投诉ID不能为空', '400')
        }

        const complaint = mockComplaintDatabase.getComplaintById(body.complaintId)
        if (!complaint) {
          return errorResponse('投诉记录不存在', '404')
        }

        // 更新投诉状态和处理信息
        complaint.status = 'PROCESSING'
        complaint.assignedHandler = body.assignedHandler || '系统自动分配'
        complaint.updateTime = new Date().toISOString()

        console.log('🚀 Mock API: handleComplaint', body, '→', complaint)
        return successResponse({
          complaint,
        }, '投诉已分配处理')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: handleComplaint', error)
        return errorResponse(error.message || '投诉处理失败')
      }
    },
  },

  // 回复投诉
  {
    url: '/api/app/complaint.replyComplaint',
    method: 'POST',
    delay: [500, 1000],
    body: async ({ body }) => {
      await randomDelay(500, 1000)

      try {
        if (!body.complaintId) {
          return errorResponse('投诉ID不能为空', '400')
        }
        if (!body.responseContent?.trim()) {
          return errorResponse('回复内容不能为空', '400')
        }

        const complaint = mockComplaintDatabase.getComplaintById(body.complaintId)
        if (!complaint) {
          return errorResponse('投诉记录不存在', '404')
        }

        // 添加回复信息
        complaint.response = {
          content: body.responseContent,
          handlerName: body.handlerName || complaint.assignedHandler || '处理员',
          responseTime: new Date().toISOString(),
        }
        complaint.status = 'RESOLVED'
        complaint.updateTime = new Date().toISOString()

        console.log('🚀 Mock API: replyComplaint', body, '→', complaint)
        return successResponse({
          complaint,
        }, '投诉回复成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: replyComplaint', error)
        return errorResponse(error.message || '投诉回复失败')
      }
    },
  },

  // 投诉满意度评价
  {
    url: '/api/app/complaint.evaluateComplaint',
    method: 'POST',
    delay: [300, 600],
    body: async ({ body }) => {
      await randomDelay(300, 600)

      try {
        if (!body.complaintId) {
          return errorResponse('投诉ID不能为空', '400')
        }
        if (!body.rating || body.rating < 1 || body.rating > 5) {
          return errorResponse('评分必须在1-5之间', '400')
        }

        const complaint = mockComplaintDatabase.getComplaintById(body.complaintId)
        if (!complaint) {
          return errorResponse('投诉记录不存在', '404')
        }

        if (complaint.status !== 'RESOLVED') {
          return errorResponse('只能对已解决的投诉进行评价', '400')
        }

        // 添加满意度评价
        complaint.satisfaction = {
          rating: body.rating,
          comment: body.comment || '',
          evaluateTime: new Date().toISOString(),
        }
        complaint.status = 'CLOSED'
        complaint.updateTime = new Date().toISOString()

        console.log('🚀 Mock API: evaluateComplaint', body, '→', complaint)
        return successResponse({
          complaint,
        }, '评价提交成功，感谢您的反馈')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: evaluateComplaint', error)
        return errorResponse(error.message || '评价提交失败')
      }
    },
  },

  // 获取投诉统计数据
  {
    url: '/api/app/complaint.getComplaintStatistics',
    method: ['GET', 'POST'],
    delay: [300, 600],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)

      try {
        const params = { ...query, ...body }
        const allComplaints = mockComplaintDatabase.complaints

        // 按状态统计
        const statusStats = ComplaintStatuses.reduce((acc, status) => {
          acc[status] = allComplaints.filter(c => c.status === status).length
          return acc
        }, {} as Record<ComplaintStatus, number>)

        // 按类型统计
        const typeStats = ComplaintTypes.reduce((acc, type) => {
          acc[type] = allComplaints.filter(c => c.complaintType === type).length
          return acc
        }, {} as Record<ComplaintType, number>)

        // 满意度统计
        const evaluatedComplaints = allComplaints.filter(c => c.satisfaction)
        const avgRating = evaluatedComplaints.length > 0
          ? (evaluatedComplaints.reduce((sum, c) => sum + (c.satisfaction?.rating || 0), 0) / evaluatedComplaints.length).toFixed(1)
          : '0'

        // 处理时效统计
        const resolvedComplaints = allComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED')
        const avgResponseTime = resolvedComplaints.length > 0 ? '1.5天' : '0天'

        const statistics = {
          total: allComplaints.length,
          statusStats,
          typeStats,
          avgRating: `${avgRating}分`,
          avgResponseTime,
          satisfactionRate: evaluatedComplaints.length > 0
            ? `${Math.round((evaluatedComplaints.filter(c => (c.satisfaction?.rating || 0) >= 4).length / evaluatedComplaints.length) * 100)}%`
            : '0%',
          monthlyTrend: {
            current: allComplaints.filter(c => new Date(c.createTime) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
            previous: allComplaints.filter((c) => {
              const createTime = new Date(c.createTime)
              const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
              return createTime >= sixtyDaysAgo && createTime < thirtyDaysAgo
            }).length,
          },
        }

        console.log('🚀 Mock API: getComplaintStatistics', params, '→', statistics)
        return successResponse(statistics, '获取投诉统计数据成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getComplaintStatistics', error)
        return errorResponse(error.message || '获取投诉统计数据失败')
      }
    },
  },
])
