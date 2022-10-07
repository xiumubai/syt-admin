/* 
{
      "createTime": "2022-07-12T02:31:55.612Z",
      "dictCode": "string",
      "hasChildren": false,
      "id": 0,
      "isDeleted": 0,
      "name": "string",
      "param": {},
      "parentId": 0,
      "updateTime": "2022-07-12T02:31:55.612Z",
      "value": "string"
    }
*/

// 字典项类型
export interface DictItem {
  id: number;
  name: string;
  dictCode: string;
  value: string;
  createTime: string;
  hasChildren: boolean;
  children: DictList; // 子列表   页面显示需要
}

// 字典列表类型
export type DictList = DictItem[]