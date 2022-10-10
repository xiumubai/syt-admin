/*
 * @Author: 朽木白
 * @Date: 2022-10-10 08:47:16
 * @LastEditors: 1547702880@@qq.com
 * @LastEditTime: 2022-10-10 11:54:40
 * @Description: 权限管理相关的API请求函数
 */
import { request } from "@/utils/http"
const api_name = '/admin/acl/permission'

/**
 * 获取权限(菜单/功能)列表
 * @returns 
 */
export const getPermissionList = () => {
  return request.get<any, null>(`${api_name}`);
}

/**
 * 删除一个权限项
 * @param id 
 * @returns 
 */
export const removePermission = (id: string) => {
  return request.delete<any, string>(`${api_name}/remove/${id}`)
}
  
/**
 * 保存一个权限项
 */
export const addPermission = (permission: any) => {
  return request.post(`${api_name}/save`, {...permission})
}

/**
 * 更新一个权限项
 */
export const updatePermission = (permission: any) => {
  return request.put(`${api_name}/update`, { ...permission })
}

/**
 * 查看某个角色的权限列表
 */
export const toAssign = (roleId: number) => {
  return request.get(`${api_name}/toAssign/${roleId}`)
}

/**
 * 给某个角色授权
 */
export const doAssign = (roleId: number, permissionId: number) => {
  return request.post(`${api_name}/doAssign`, {params: {roleId, permissionId}})
}
