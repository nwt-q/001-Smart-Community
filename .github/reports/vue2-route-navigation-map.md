# Vue2 旧项目路由跳转关系脑图

本文档展示了 `gitee-example` 目录下 Vue2 uni-app 项目的路由跳转关系。

## 说明

- 只展示 `uni.navigateTo()`, `uni.redirectTo()`, `uni.reLaunch()` 三种 forward 跳转
- 忽略返回操作 (`navigateBack`) 和 Tab 切换 (`switchTab`)
- 标注了关键的跳转参数

---

## 1. 总览图：以首页/工作台为中心的导航结构

```mermaid
graph TB
    %% 入口页面
    Index["首页<br/>pages/index/index"]
    Work["工作台<br/>pages/index/work"]
    My["我的<br/>pages/my/my"]

    %% 主要功能模块入口
    RepairOrder["维修工单池<br/>pages/repairOrder/repairOrder"]
    RepairDispatch["维修待办单<br/>pages/repairDispatch/repairDispatch"]
    ComplaintList["投诉受理单<br/>pages/complaintList/complaintList"]
    Inspection["巡检打卡<br/>pages/inspection/inspection"]
    PurchaseManage["采购申请管理<br/>pages/resource/purchaseApplyManage"]
    ItemOutManage["物品领用管理<br/>pages/resource/itemOutManage"]

    %% 个人中心功能
    UserInfo["个人信息<br/>pages/userInfo/userInfo"]
    ChangePwd["修改密码<br/>pages/changePwd/changePwd"]
    ChangeCommunity["切换小区<br/>pages/changeCommunity/changeCommunity"]
    RepairFinish["维修已办<br/>pages/repairDispatchFinish"]
    ComplaintFinish["投诉已办<br/>pages/complaintFinish"]
    StaffAttendance["员工考勤<br/>pages/my/staffDetailAttendance"]
    Login["登录页<br/>pages/login/login"]

    %% 连接关系 - 从我的页面出发
    My --> ChangeCommunity
    My --> UserInfo
    My --> RepairFinish
    My --> ComplaintFinish
    My --> StaffAttendance
    My --> ChangePwd
    My -->|退出系统| Login
    ChangePwd -->|修改成功| Login

    %% 标注：工作台和首页是主要入口，通过TabBar访问各功能模块
    style Index fill:#e1f5ff
    style Work fill:#e1f5ff
    style My fill:#e1f5ff
    style Login fill:#ffe1e1
```

---

## 2. 维修工单流程模块

```mermaid
graph TB
    %% 维修工单主要页面
    RepairOrder["维修工单池<br/>pages/repairOrder/repairOrder"]
    RepairDispatch["维修待办单<br/>pages/repairDispatch/repairDispatch"]
    RepairDetail["维修详情<br/>pages/repairDetail/repairDetail"]
    RepairHandle["订单处理<br/>pages/repairHandle/repairHandle"]
    RepairAdd["添加维修记录<br/>pages/repairAdd/repairAdd"]
    RepairFinish["维修已办<br/>pages/repairDispatchFinish"]
    AppraiseRepair["回访工单<br/>pages/appraiseRepair/appraiseRepair"]
    RepairEnd["结束订单<br/>pages/repairOrder/repairEnd"]
    ReplyAppraise["回复评价<br/>pages/repairOrder/replyRepairAppraise"]
    SelectResource["选择物品<br/>pages/repairHandle/selectResource"]

    %% 选择房屋相关页面
    SelectFloor["选择楼栋<br/>pages/selectFloor/selectFloor"]
    SelectUnit["选择单元<br/>pages/selectUnit/selectUnit"]
    SelectRoom["选择房屋<br/>pages/selectRoom/selectRoom"]

    %% 维修工单池的跳转
    RepairOrder -->|查看详情<br/>repairId, storeId| RepairDetail
    RepairOrder -->|派单<br/>action=DISPATCH<br/>repairId, repairType| RepairHandle
    RepairOrder -->|结束订单<br/>repairId, communityId| RepairEnd

    %% 维修待办单的跳转
    RepairDispatch -->|查看详情<br/>repairId, storeId| RepairDetail
    RepairDispatch -->|转单/退单/办结<br/>action=TRANSFER/BACK/FINISH<br/>repairId, repairType| RepairHandle
    RepairDispatch -->|回访<br/>repairId, repairType<br/>preStaffId, preStaffName| AppraiseRepair

    %% 维修详情的跳转
    RepairDetail -->|回复评价<br/>ruId, repairId| ReplyAppraise

    %% 订单处理的跳转
    RepairHandle -->|选择物品<br/>feeFlag| SelectResource
    RepairHandle -.->|派单成功| RepairOrder
    RepairHandle -.->|转单/退单/办结成功| RepairDispatch

    %% 添加维修记录的跳转
    RepairAdd -->|选择楼栋| SelectFloor
    RepairAdd -->|选择单元<br/>floorId| SelectUnit
    RepairAdd -->|选择房屋<br/>floorId, unitId| SelectRoom
    RepairAdd -.->|提交成功| RepairOrder

    %% 维修已办的跳转
    RepairFinish -->|查看详情<br/>repairId, storeId| RepairDetail

    %% 样式
    style RepairOrder fill:#fff4e6
    style RepairDispatch fill:#fff4e6
    style RepairHandle fill:#ffe6e6
    style AppraiseRepair fill:#e6ffe6
```

---

## 3. 投诉处理流程模块

```mermaid
graph TB
    %% 投诉处理主要页面
    ComplaintList["投诉受理单<br/>pages/complaintList/complaintList"]
    ComplaintOrder["投诉录单<br/>pages/complaintOrder/complaintOrder"]
    ComplaintDetail["投诉单详情<br/>pages/complaintOrderDetail/complaintOrderDetail"]
    AuditComplaint["处理投诉单<br/>pages/auditComplaintOrder/auditComplaintOrder"]
    ComplaintHandle["投诉处理<br/>pages/complaintHandle/complaintHandle"]
    ComplaintFinish["投诉已办单<br/>pages/complaintFinish/complaintFinish"]
    ReplyAppraise["回复评价<br/>pages/complaintOrderDetail/replyComplainAppraise"]

    %% 选择房屋相关页面
    FloorList["楼栋列表<br/>pages/floorList/floorList"]
    UnitList["单元列表<br/>pages/unitList/unitList"]
    RoomList["房屋列表<br/>pages/roomList/roomList"]

    %% 投诉受理单的跳转
    ComplaintList -->|查看详情<br/>complaintId| ComplaintDetail
    ComplaintList -->|处理<br/>complaintId, taskId| ComplaintHandle

    %% 投诉录单的跳转
    ComplaintOrder -->|查看详情<br/>complaintId| ComplaintDetail
    ComplaintOrder -->|选择楼栋<br/>communityId| FloorList
    ComplaintOrder -->|选择单元<br/>communityId| UnitList
    ComplaintOrder -->|选择房屋<br/>communityId| RoomList

    %% 投诉单详情的跳转
    ComplaintDetail -->|回复评价<br/>appraiseId, communityId| ReplyAppraise

    %% 投诉已办单的跳转
    ComplaintFinish -->|查看详情<br/>complaintId| ComplaintDetail

    %% 样式
    style ComplaintList fill:#e6f3ff
    style ComplaintOrder fill:#ffe6f0
    style ComplaintHandle fill:#ffe6e6
    style ComplaintFinish fill:#e6ffe6
```

---

## 4. 巡检管理流程模块

```mermaid
graph TB
    %% 巡检管理主要页面
    Inspection["巡检打卡<br/>pages/inspection/inspection"]
    ExcuteInspection["巡检过程<br/>pages/excuteInspection/excuteInspection"]
    ExcuteOne["执行巡检<br/>pages/excuteOneInspection/excuteOneInspection"]
    QrCodeInspection["二维码巡检<br/>pages/excuteOneQrCodeInspection/excuteOneQrCodeInspection"]
    InspectionReexamine["巡检补检<br/>pages/inspectionReexamine/inspectionReexamine"]
    InspectionTransfer["任务流转<br/>pages/inspectionTransfer/inspectionTransfer"]

    %% 巡检打卡的跳转
    Inspection -->|开始巡检<br/>参数: taskId, inspectionPlanName| ExcuteInspection
    Inspection -->|任务流转<br/>参数: task对象JSON| InspectionTransfer
    Inspection -->|补检| InspectionReexamine

    %% 巡检过程的跳转
    ExcuteInspection -->|单项巡检<br/>参数: taskDetailId, taskId<br/>inspectionId, inspectionName, itemId| ExcuteOne

    %% 执行巡检的跳转
    ExcuteOne -.->|提交成功| Inspection
    ExcuteOne -->|二维码巡检<br/>参数: taskDetailId, taskId等| QrCodeInspection

    %% 二维码巡检的跳转
    QrCodeInspection -->|执行单项<br/>参数: taskDetailId, taskId等| ExcuteOne

    %% 巡检补检的跳转
    InspectionReexamine -->|开始巡检<br/>参数: taskId, inspectionPlanName| ExcuteInspection

    %% 任务流转的跳转
    InspectionTransfer -.->|流转成功| Inspection

    %% 样式
    style Inspection fill:#e6f7ff
    style ExcuteInspection fill:#fff7e6
    style ExcuteOne fill:#ffe6f0
    style InspectionTransfer fill:#ffe6e6
```

---

## 5. 采购/资源管理流程模块

```mermaid
graph TB
    %% 采购资源管理主要页面
    PurchaseRequest["采购申请<br/>pages/purchaseRequest/purchaseRequest"]
    PurchaseManage["采购申请管理<br/>pages/resource/purchaseApplyManage"]
    AddPurchase["添加采购申请<br/>pages/resource/addPurchaseApply"]
    PurchaseDetail["采购申请详情<br/>pages/resource/purchaseApplyDetail"]
    UrgentPurchase["紧急采购<br/>pages/urgentPurchaseApplyStep"]

    ItemOutManage["物品领用管理<br/>pages/resource/itemOutManage"]
    AddItemOut["领用申请<br/>pages/resource/addItemOut"]

    PurchaseList["选择类型<br/>pages/purchaseList/purchaseList"]

    %% 采购申请的跳转
    PurchaseRequest -->|选择类型<br/>参数: communityId| PurchaseList

    %% 采购申请管理的跳转
    PurchaseManage -->|查看详情<br/>参数: apply对象JSON| PurchaseDetail
    PurchaseManage -->|新增申请| AddPurchase
    PurchaseManage -->|紧急采购| UrgentPurchase

    %% 物品领用管理的跳转
    ItemOutManage -->|查看详情<br/>参数: apply对象JSON| PurchaseDetail
    ItemOutManage -->|新增领用| AddItemOut

    %% 样式
    style PurchaseManage fill:#e6fff7
    style ItemOutManage fill:#fff7e6
    style AddPurchase fill:#ffe6f0
    style UrgentPurchase fill:#ffe6e6
```

---

## 6. 个人中心模块

```mermaid
graph TB
    %% 个人中心主要页面
    My["我的<br/>pages/my/my"]
    UserInfo["个人信息<br/>pages/userInfo/userInfo"]
    ChangePwd["修改密码<br/>pages/changePwd/changePwd"]
    ChangeCommunity["切换小区<br/>pages/changeCommunity/changeCommunity"]
    RepairFinish["维修已办<br/>pages/repairDispatchFinish"]
    ComplaintFinish["投诉已办<br/>pages/complaintFinish"]
    StaffAttendance["员工考勤<br/>pages/my/staffDetailAttendance"]
    Login["登录页<br/>pages/login/login"]

    %% 我的页面的跳转
    My --> ChangeCommunity
    My --> UserInfo
    My --> RepairFinish
    My --> ComplaintFinish
    My --> StaffAttendance
    My --> ChangePwd
    My -->|退出系统| Login

    %% 修改密码的跳转
    ChangePwd -->|修改成功| Login

    %% 样式
    style My fill:#e6f3ff
    style Login fill:#ffe6e6
    style ChangePwd fill:#fff7e6
```

---

## 7. 其他辅助功能模块

### 7.1 房屋选择流程

```mermaid
graph LR
    SelectFloor["选择楼栋<br/>pages/selectFloor/selectFloor"]
    SelectUnit["选择单元<br/>pages/selectUnit/selectUnit"]
    SelectRoom["选择房屋<br/>pages/selectRoom/selectRoom"]

    SelectFloor -->|选择楼栋<br/>返回floorId| SelectUnit
    SelectUnit -->|选择单元<br/>返回unitId| SelectRoom
    SelectRoom -->|选择房屋<br/>返回roomId| SelectFloor

    style SelectFloor fill:#e6fff7
    style SelectUnit fill:#fff7e6
    style SelectRoom fill:#ffe6f0
```

### 7.2 工作单流程

```mermaid
graph TB
    WorkTask["工作单任务<br/>pages/work/workTask"]
    WorkDetail["工作单详情<br/>pages/work/workDetail"]
    DoWork["办理工作单<br/>pages/work/doWork"]
    DoWorkAudit["工作单审核<br/>pages/work/doWorkAudit"]
    EditWork["修改工作单<br/>pages/work/editWrok"]
    CopyWork["抄送工作单<br/>pages/work/copyWork"]
    DoCopyWork["已阅<br/>pages/work/doCopyWork"]

    WorkTask -->|查看详情<br/>workId, taskId| WorkDetail
    WorkDetail -->|修改<br/>workId| EditWork
    DoWork -->|查看详情<br/>workId, taskId| WorkDetail
    DoWork -->|审核<br/>workId, taskId| DoWorkAudit
    CopyWork -->|查看任务<br/>workId| WorkTask
    CopyWork -->|已阅<br/>workId, copyId| DoCopyWork

    style WorkDetail fill:#e6f3ff
    style DoWork fill:#fff7e6
    style DoWorkAudit fill:#ffe6e6
```

---

## 关键跳转模式总结

|  跳转类型  |    使用场景    | 示例              |
| :--------: | :------------: | :---------------- |
| navigateTo |  普通页面跳转  | 列表 → 详情       |
| redirectTo | 表单提交后跳转 | 提交成功 → 列表页 |
|  reLaunch  |    应用重启    | 登录成功 → 首页   |

## 参数传递方式

|      方式      | 说明     | 示例                              |
| :------------: | :------- | :-------------------------------- |
| URL 查询字符串 | 简单参数 | `?repairId=xxx&storeId=xxx`       |
|  JSON 序列化   | 复杂对象 | `?apply=` + `JSON.stringify(obj)` |
|    本地存储    | 大量数据 | `uni.setStorageSync()`            |

---

**生成时间**: 2025-10-20
**项目**: HC 掌上物业 Vue2 版本 (gitee-example)
