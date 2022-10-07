import { request } from "@/utils/http";
import type { DepartmentList, HospitalShowType, LocationList, ReqGetHospitalListParams, ReqGetHospitalListResponse, ReqGetScheduleListParams, ReqGetScheduleRuleListParams, ReqGetScheduleRuleListResponse, ScheduleList, Status } from "./model/hospitalListTypes";

// 获取医院分页列表
// GET /admin/hosp/hospital/{page}/{limit}
// params: 传入的对象中除了page, limit之外的所有属性组成的对象
export const reqGetHospitalList = ({page, limit, ...restParams}: ReqGetHospitalListParams) => {
  return request.get<any, ReqGetHospitalListResponse>(`/admin/hosp/hospital/${page}/${limit}`, {
    params: restParams
  });
};

/* 
GET /admin/cmn/dict/findByParentId/{parentId}
获取省/市/区的列表
省列表的parentId为固定值: 86
函数默认返回省的列表: reqGetLocationList()  调用时不用传递参数
*/
export const reqGetLocationList = (parentId: number|string=86) => {
  return request.get<any, LocationList>(`/admin/cmn/dict/findByParentId/${parentId}`)
}

/* 
获取医院类型列表
*/
export const reqGetHospitalTypes = () => {
  return request.get<any, LocationList>(`/admin/cmn/dict/findByParentId/10000`)
}

/* 
GET /admin/hosp/hospital/show/{id}
获取医院详情
*/
export const reqGetHospitalShow = (id: string) => {
  return request.get<any, HospitalShowType>(`/admin/hosp/hospital/show/${id}`)
}


/* 
GET /admin/hosp/department/{hoscode}
获取指定医院的科室/部门的列表
*/
export const reqGetDepartmentList = (hoscode: string) => {
  return request.get<any, DepartmentList>(`/admin/hosp/department/${hoscode}`)
}


/* 
GET /admin/hosp/schedule/getScheduleRule/{page}/{limit}/{hoscode}/{depcode}
获取排班规则的分页列表
*/
export const reqGetScheduleRuleList = ({page, limit, hoscode, depcode}: ReqGetScheduleRuleListParams) => {
  return request.get<any, ReqGetScheduleRuleListResponse>(`/admin/hosp/schedule/getScheduleRule/${page}/${limit}/${hoscode}/${depcode}`)
}

/* 
GET /admin/hosp/schedule/findScheduleList/{hoscode}/{depcode}/{workDate}
获取某天的医生排班列表
*/
export const reqGetScheduleList = ({hoscode, depcode, workDate}: ReqGetScheduleListParams) => {
  return request.get<any, ScheduleList>(
    `/admin/hosp/schedule/findScheduleList/${hoscode}/${depcode}/${workDate}`
  )
}

/* 
更新医院状态
GET /admin/hosp/hospital/updateStatus/{id}/{status}
*/
export const reqUpdateStatus = (id: string, status: Status) => {
  return request.get<any, null>(
    `/admin/hosp/hospital/updateStatus/${id}/${status}`
  )
}