import { request } from "@/utils/http"
import type { Key } from "react";
import { GetUserListParams, GetUserListResponse, UserTypes, RoleTypes } from "./modal/userTypes";
const api_name = '/admin/acl/user'

/**
 * @description: 获取后台用户分页列表(带搜索)
 * @param {GetUserListParams} param
 * @returns {*}
 */
export const getUserList = ({page, limit, username}: GetUserListParams) => {
  return request.get<any, GetUserListResponse>(`${api_name}/${page}/${limit}`, {
    params: {
      username
    }
  });
}

/**
 * @description: 添加用户
 * @param {UserTypes} user
 * @returns {*}
 */
export const adduser = (user: UserTypes) => {
  return request.post<any, null>(`${api_name}/save`, {...user})
}

/**
 * @description: 修改用户
 * @param {UserTypes} user
 * @returns {*}
 */
export const updateUser = (user: UserTypes) => {
  return request.put<any, null>(`${api_name}/update`, {...user})
}

/**
 * @description: 删除用户
 * @param {UserTypes} user
 * @returns {*}
 */
export const delUser = (id: number) => {
  return request.delete<any, null>(`${api_name}/remove/${id}`,)
}

/**
 * @description: 批量删除用户
 * @param {UserTypes} user
 * @returns {*}
 */
 export const batchDelUser = (idList: Key[]) => {
  return request.delete<any, null>(`${api_name}/batchRemove`, {data: idList})
}

/**
 * @description: 获取所有角色
 * @param {number} userId
 * @returns {*}
 */
export const getRoles = (userId: number | undefined) => {
  return request.get<any, RoleTypes>(`${api_name}/toAssign/${userId}`);
}


/**
 * @description: 给用户分配角色
 * @returns {*}
 */
 export const assignRoles = (adminId: number, roleId: string) => {
  return request.post<any, null>(`${api_name}/doAssign?adminId=${adminId}&roleId=${roleId}`)
}


