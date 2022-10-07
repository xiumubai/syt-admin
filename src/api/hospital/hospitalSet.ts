import { request } from "@/utils/http";
import type { Key } from "react";
import type { GetHospitalSetListParams, GetHospitalSetListResponse, HospitalItem, ReqAddHospitalParams, ReqUpdateHospitalParams } from "./model/hospitalSetTypes";

/* 
包含医院设置相关接口请求函数
*/

// 查询医院设置列表
// 目标接口: http://syt-api.atguigu.cn/admin/hosp/hospitalSet/1/5?hosname=%E4%BA%BA%E6%B0%91&hoscode=1000_3
// 需要利用代理帮我们转发
// 浏览器发出的请求: http://localhost:3000/dev-api/admin/hosp/hospitalSet/1/5
  // /admin/hosp/hospitalSet/1/5
  // request中指定好了: baseURL=/dev-api
  // 当前项目运行的基础路径:  http://localhost:3000

export const reqGetHospitalSetList = ({page, limit, hosname, hoscode}: GetHospitalSetListParams) => {
  // return axios.get<any, AxiosResponse<GetInfoResponse>>("/admin/auth/index/info");
  return request.get<any, GetHospitalSetListResponse>(`/admin/hosp/hospitalSet/${page}/${limit}`, {
    params: {
      hosname,
      hoscode
    }
  });
};

/* 
POST /admin/hosp/hospitalSet/save
{"hosname":"ghgh","hoscode":"jhjh22","apiUrl":"a","contactsName":"a","contactsPhone":"13412341234"}
添加医院
*/
export const reqAddHospital = (hospital: ReqAddHospitalParams) => {
  return request.post<any, null>('/admin/hosp/hospitalSet/save', hospital)
}

/* 
GET /admin/hosp/hospitalSet/get/{id}
获取医院
*/
export const reqGetHospitalItem = (id: number) => {
  return request.get<any, HospitalItem>(`/admin/hosp/hospitalSet/get/${id}`)
} 

/* 
PUT /admin/hosp/hospitalSet/update
修改医院
*/
export const reqUpdateHospital = (hospital: ReqUpdateHospitalParams) => {
  return request.put<any, null>('/admin/hosp/hospitalSet/update', hospital)
}

/* 
DELETE /admin/hosp/hospitalSet/remove/{id}
删除医院
*/
export const reqDeleteHospital = (id: number) => {
  return request.delete<any, null>(`/admin/hosp/hospitalSet/remove/${id}`)
}

/* 
DELETE /admin/hosp/hospitalSet/batchRemove
idList以请求体的形式传过去
批量删除
*/
export const reqBatchDeleteHospitals = (idList: Key[]) => {
  return request.delete<any, null>('/admin/hosp/hospitalSet/batchRemove', {
    data: idList // 请求体参数
  })
}