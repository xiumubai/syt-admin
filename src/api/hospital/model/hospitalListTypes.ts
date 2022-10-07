// 获取医院列表参数类型
export interface ReqGetHospitalListParams {
  page: number; // 当前页码
  limit: number; // 每页条数

  hoscode?: string; // 医院编码
  hosname?: string; // 医院名称
  hostype?: string; // 医院类型
  provinceCode?: string; // 省编码
  cityCode?: string; // 市编码
  districtCode?: string; // 区编码
  status?: Status; // 状态：0：未上线 1：已上线
}

// 状态类型
export type Status = 0 | 1; // 0代表未上线 1 代表已上线

// 医院基本信息的类型
interface Hospital {
  id: string;
  createTime: string; // 创建时间
  param: {
    hostypeString: string; // 医院类型
    fullAddress: string; // 医院完整地址
  };
  hoscode: string; // 医院编码
  hosname: string; // 医院名称
  hostype: string; // 医院类型标识
  provinceCode: string; // 省编码
  cityCode: string; // 市编码
  districtCode: string; // 区编码
  logoData: string; // 医院logo
  intro: string; // 医院介绍
  route: string; // 交通方式
  status: Status; // 状态：0：未上线 1：已上线
}

// 预约规则的类型
interface BookingRule {
  cycle: number; // 预约周期
  releaseTime: string; // 放号时间
  stopTime: string; // 停挂时间
  quitTime: string; // 退号时间
  rule: string[]; // 预约规则
}

// 单个医院类型
export interface HospitalItemType extends Hospital {
  bookingRule: BookingRule;
}

// 医院详情的类型
export interface HospitalShowType {
  hospital: Hospital;
  bookingRule: BookingRule;
}

// 医院列表类型
export type HospitalListType = HospitalItemType[];

// 获取医院列表返回值类型
export interface ReqGetHospitalListResponse {
  // 注意接口返回值字段与之前不一样~所以使用前需要测试接口
  content: HospitalListType;
  totalElements: number;
}

// 省/市/区的信息对象类型
export interface Location {
  id: number;
  name: string; // 名称
  value: string; // 标识值
}

// 省/市/区的数组
export type LocationList = Location[];

/* 
[
    {
      "depcode": "a4e171f4cf9b6816acdfb9ae62c414d7",
      "depname": "专科",
      "children": [ // 包含多个科室的数组
        {
          "depcode": "200040878",
          "depname": "多发性硬化专科门诊",
          "children": null
        },
      ]
    }
]
*/

/* 
单个科室
*/
export interface DepartmentItem {
  depcode: string; // 科室编码   => key
  depname: string; //  科室名称  => title
  children: DepartmentList | null; // 子科室列表 或 null
}

/* 
科室列表
*/
export type DepartmentList = DepartmentItem[];

/* 
排班规则分页列表的参数类型
*/
export interface ReqGetScheduleRuleListParams {
  page: number; // 页码
  limit: number; // 每页数量
  hoscode: string; // 医院编号
  depcode: string; // 科室编号
}

/* 

  {
    "total": 37,
    "bookingScheduleList": [
      {
        "workDate": "2022-04-28",
        "workDateMd": null,
        "dayOfWeek": "周四",
        "docCount": 3,
        "reservedNumber": 100,
        "availableNumber": 38,
        "status": null
      },
    ]
   "baseMap": {
      "hosname": "北京协和医院"
    }
  },
*/

// 单个排班规则类型
export interface ScheduleRuleItem {
  workDate: string; // 工作日期 号源时间 
  dayOfWeek: string;  // 星期几
  reservedNumber: 100; // 预约号的总数量
  availableNumber: 38; // 预约号的剩余数量
}

// 排班规则的列表类型
export type ScheduleRuleList = ScheduleRuleItem[]

// 排班规则分页列表响应数据类型
export interface ReqGetScheduleRuleListResponse {
  total: number; // 总数量
  bookingScheduleList: ScheduleRuleList; // 当前页排班规则列表
  baseMap: {
    hosname: string; // 医院名称
  };
}


// 获取排班列表的参数类型
export interface ReqGetScheduleListParams {
  hoscode: string;
  depcode: string;
  workDate: string;
}

// 单个医生排班项类型
export interface ScheduleItem {
  id: string;
  title: string; // 职位
  workDate: string; // 号源时间
  reservedNumber: number; // 总预约数
  availableNumber: number; // 剩余预约数
  amount: number; // 挂号费
  skill: string; // 擅长技能
  docname: string; // 医生姓名
}

// 医生排班列表类型
export type ScheduleList = ScheduleItem[]