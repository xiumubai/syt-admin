export interface UserTypes {
  username?: string;
  nickName?: string;
  password?: string;
  roleName?: string;
}

export interface  UserItem extends UserTypes{
  id: number;
  createTime?: string;
  updateTime?: string;
  
}

export interface PageParams {
  page: number;
  limit: number;
}

export interface GetUserListParams extends PageParams{
  username?: string;
}

export type UserList = UserItem[];

export interface GetUserListResponse {
  records: UserList;
  total: number;
}

/**
 * @description: Modal弹出类型
 * @params 1 添加
 * @params 2 修改
 * @params 3 分配角色
 */
export type UserType = 1 | 2 | 3

export interface RoleItemType {
  id?: string | number;
  remark?: string;
  roleName?: string;
}

export interface RoleTypes {
  allRolesList?: RoleItemType[];
  assignRoles?: RoleItemType[];
}

export interface OptionTypes extends RoleItemType{
  label: string;
  value: string | number;
  disabled?: boolean;
}
