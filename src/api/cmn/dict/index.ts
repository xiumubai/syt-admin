import { request } from "@/utils/http"
import { DictList } from "./model/dictTypes"

/* 
GET /admin/cmn/dict/findByParentId/{parentId}
根据指定的父节点(字典项)的id, 得到子节点的列表
 */
export const reqGetDictList = (parentId: number) => {
  return request.get<any, DictList>(`/admin/cmn/dict/findByParentId/${parentId}`)
}