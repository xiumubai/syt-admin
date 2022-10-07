/* 
定义医院设置相关接口的数据类型interface
1. 请求参数类型
2. 响应数据的data的类型
*/
// page, limit, hosname, hoscode
// 请求参数的类型
export interface GetHospitalSetListParams {
  page: number;
  limit: number;
 
  hosname?: string;
  hoscode?: string;
}

// 医院的类型
export interface HospitalItem {
  id: number;
  hosname: string;
  hoscode: string;
  apiUrl: string;
  signKey: string;
  contactsName: string;
  contactsPhone: string;
}

// 医院列表的类型
export type HospitalItemList = HospitalItem[];

// 响应数据的类型
export interface GetHospitalSetListResponse {
  records: HospitalItemList;
  total: number;
}

// 请求添加医院的参数类型
export interface ReqAddHospitalParams {
  hosname: string;
  hoscode: string;
  apiUrl: string;
  contactsName: string;
  contactsPhone: string;
}

// 请求更新医院的参数类型
export interface ReqUpdateHospitalParams extends ReqAddHospitalParams{
  id: number;
}