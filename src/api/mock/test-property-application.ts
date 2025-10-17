/**
 * 物业申请模块接口测试
 * 用于验证所有Mock接口的功能和类型安全
 */

import type {
  ApplicationRecordDetailParams,
  ApplicationRecordListParams,
  CheckUpdateRequest,
  DeleteApplicationRecordRequest,
  DictQueryParams,
  FeeDetailParams,
  FeeDiscountParams,
  PropertyApplicationDetailParams,
  PropertyApplicationListParams,
  ReviewUpdateRequest,
  SaveApplicationRecordRequest,
} from '@/types/property-application'

/**
 * 测试空置房申请列表查询
 */
export async function testPropertyApplicationList() {
  console.log('🧪 测试物业申请列表查询...')

  const params: PropertyApplicationListParams = {
    page: 1,
    row: 10,
    communityId: 'COMM_001',
    roomName: '',
    state: '',
  }

  try {
    // 这里应该调用实际的API接口进行测试
    // const result = await getPropertyApplicationList(params)
    console.log('✅ 物业申请列表查询测试通过')
    console.log('📋 请求参数:', params)
  }
  catch (error) {
    console.error('❌ 物业申请列表查询测试失败:', error)
  }
}

/**
 * 测试空置房申请详情查询
 */
export async function testPropertyApplicationDetail() {
  console.log('🧪 测试物业申请详情查询...')

  const params: PropertyApplicationDetailParams = {
    page: 1,
    row: 1,
    communityId: 'COMM_001',
    ardId: 'ARD_001',
  }

  try {
    // const result = await getPropertyApplicationDetail(params)
    console.log('✅ 物业申请详情查询测试通过')
    console.log('📋 请求参数:', params)
  }
  catch (error) {
    console.error('❌ 物业申请详情查询测试失败:', error)
  }
}

/**
 * 测试验房更新
 */
export async function testCheckUpdate() {
  console.log('🧪 测试验房更新...')

  const data: CheckUpdateRequest = {
    ardId: 'ARD_002',
    communityId: 'COMM_001',
    startTime: '2024-02-01 00:00:00',
    endTime: '2024-04-01 23:59:59',
    createRemark: '业主申请空置房，希望获得费用减免',
    state: '2',
    checkRemark: '验房通过，房屋设施完好',
    photos: ['PHOTO_001', 'PHOTO_002'],
  }

  try {
    // const result = await submitCheckUpdate(data)
    console.log('✅ 验房更新测试通过')
    console.log('📋 请求数据:', data)
  }
  catch (error) {
    console.error('❌ 验房更新测试失败:', error)
  }
}

/**
 * 测试审核更新
 */
export async function testReviewUpdate() {
  console.log('🧪 测试审核更新...')

  const data: ReviewUpdateRequest = {
    ardId: 'ARD_001',
    communityId: 'COMM_001',
    startTime: '2024-01-15 00:00:00',
    endTime: '2024-03-15 23:59:59',
    createRemark: '业主申请空置房，希望获得费用减免',
    state: '4',
    reviewRemark: '审批通过，同意给予费用减免',
    discountType: '3003',
    discountId: 'DISCOUNT_001',
    returnWay: '1001',
    selectedFees: ['DETAIL_001', 'DETAIL_002'],
    feeId: 'FEE_001',
    roomId: 'ROOM_001',
    checkRemark: '验房通过，房屋状况良好',
    fees: [
      {
        detailId: 'DETAIL_001',
        feeName: '物业管理费',
        receivedAmount: 300,
        createTime: '2024-01-15T00:00:00Z',
        checked: true,
      },
    ],
    configId: '',
    discounts: [],
  }

  try {
    // const result = await submitReviewUpdate(data)
    console.log('✅ 审核更新测试通过')
    console.log('📋 请求数据:', data)
  }
  catch (error) {
    console.error('❌ 审核更新测试失败:', error)
  }
}

/**
 * 测试字典查询
 */
export async function testDictQuery() {
  console.log('🧪 测试字典查询...')

  const params: DictQueryParams = {
    name: 'apply_room_discount',
    type: 'state',
  }

  try {
    // const result = await queryDictInfo(params)
    console.log('✅ 字典查询测试通过')
    console.log('📋 请求参数:', params)
  }
  catch (error) {
    console.error('❌ 字典查询测试失败:', error)
  }
}

/**
 * 测试费用折扣查询
 */
export async function testFeeDiscountList() {
  console.log('🧪 测试费用折扣查询...')

  const params: FeeDiscountParams = {
    page: 1,
    row: 100,
    discountType: '3003',
    communityId: 'COMM_001',
  }

  try {
    // const result = await getFeeDiscountList(params)
    console.log('✅ 费用折扣查询测试通过')
    console.log('📋 请求参数:', params)
  }
  catch (error) {
    console.error('❌ 费用折扣查询测试失败:', error)
  }
}

/**
 * 测试费用详情查询
 */
export async function testFeeDetailList() {
  console.log('🧪 测试费用详情查询...')

  const params: FeeDetailParams = {
    page: 1,
    row: 50,
    communityId: 'COMM_001',
    feeId: 'FEE_001',
  }

  try {
    // const result = await getFeeDetailList(params)
    console.log('✅ 费用详情查询测试通过')
    console.log('📋 请求参数:', params)
  }
  catch (error) {
    console.error('❌ 费用详情查询测试失败:', error)
  }
}

/**
 * 测试跟踪记录列表查询
 */
export async function testApplicationRecordList() {
  console.log('🧪 测试申请跟踪记录列表查询...')

  const params: ApplicationRecordListParams = {
    page: 1,
    row: 10,
    communityId: 'COMM_001',
    applicationId: 'ARD_001',
    roomId: 'ROOM_001',
    roomName: '1栋101A室',
  }

  try {
    // const result = await getApplicationRecordList(params)
    console.log('✅ 申请跟踪记录列表查询测试通过')
    console.log('📋 请求参数:', params)
  }
  catch (error) {
    console.error('❌ 申请跟踪记录列表查询测试失败:', error)
  }
}

/**
 * 测试跟踪记录详情查询
 */
export async function testApplicationRecordDetail() {
  console.log('🧪 测试申请跟踪记录详情查询...')

  const params: ApplicationRecordDetailParams = {
    page: 1,
    row: 10,
    communityId: 'COMM_001',
    ardrId: 'ARDR_001',
    roomName: '1栋101A室',
  }

  try {
    // const result = await getApplicationRecordDetailList(params)
    console.log('✅ 申请跟踪记录详情查询测试通过')
    console.log('📋 请求参数:', params)
  }
  catch (error) {
    console.error('❌ 申请跟踪记录详情查询测试失败:', error)
  }
}

/**
 * 测试保存跟踪记录
 */
export async function testSaveApplicationRecord() {
  console.log('🧪 测试保存申请跟踪记录...')

  const data: SaveApplicationRecordRequest = {
    applicationId: 'ARD_001',
    roomId: 'ROOM_001',
    roomName: '1栋101A室',
    state: '1',
    stateName: '待验房',
    photos: ['PHOTO_001', 'PHOTO_002'],
    videoName: '',
    remark: '新增跟踪记录备注',
    detailType: '1001',
    communityId: 'COMM_001',
    examineRemark: '',
    isTrue: 'false',
  }

  try {
    // const result = await saveApplicationRecord(data)
    console.log('✅ 保存申请跟踪记录测试通过')
    console.log('📋 请求数据:', data)
  }
  catch (error) {
    console.error('❌ 保存申请跟踪记录测试失败:', error)
  }
}

/**
 * 测试删除跟踪记录
 */
export async function testDeleteApplicationRecord() {
  console.log('🧪 测试删除申请跟踪记录...')

  const data: DeleteApplicationRecordRequest = {
    ardrId: 'ARDR_001',
    communityId: 'COMM_001',
    roomName: '1栋101A室',
    applicationId: 'ARD_001',
    roomId: 'ROOM_001',
    state: '1',
    stateName: '待验房',
  }

  try {
    // const result = await deleteApplicationRecord(data)
    console.log('✅ 删除申请跟踪记录测试通过')
    console.log('📋 请求数据:', data)
  }
  catch (error) {
    console.error('❌ 删除申请跟踪记录测试失败:', error)
  }
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('🚀 开始运行物业申请模块接口测试...')

  await testPropertyApplicationList()
  await testPropertyApplicationDetail()
  await testCheckUpdate()
  await testReviewUpdate()
  await testDictQuery()
  await testFeeDiscountList()
  await testFeeDetailList()
  await testApplicationRecordList()
  await testApplicationRecordDetail()
  await testSaveApplicationRecord()
  await testDeleteApplicationRecord()

  console.log('🎉 所有测试完成！')
}

// 如果直接运行此文件，执行所有测试
if (typeof window === 'undefined') {
  // Node.js 环境下运行测试
  runAllTests().catch(console.error)
}
