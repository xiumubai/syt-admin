import React, { useEffect, useState } from 'react'
import { Card, Tree, Space, Button, message } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { toAssign, doAssign } from '@/api/acl/permision'
import { useSearch } from '@/app/hooks'
import {AssignItemType } from '@/api/acl/modal/roleTypes'
import './index.less'

/**
 * @description: 【antd】Tree组件子节点不完全勾选获取父节点的值问题解决方案 
 * @returns {*}
 * @docs https://zhuanlan.zhihu.com/p/77026123
 * 1.循环遍历出最深层子节点，存放在一个数组中
 * 2.将后台返回的含有父节点的数组和第一步骤遍历的数组做比较
 * 3.如果有相同值，将相同值取出来，push到一个新数组中
 * 4.利用这个新的重组的数组给Tree组件selected赋值
 */

const fieldNames = {
  title: 'name',
  key: 'id',
}

const Auth: React.FC = () => {
  const [roleList, setRoleList] = useState()
  const [checkedIds, setCheckedIds] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const [idsList, setIdsList] = useState([]) // 需要传给后端的id
  const [childIds, setChildIds] = useState([])
  const { id } = useParams()
  const { roleName } = useSearch()
  const navigate = useNavigate()

  const childList: any[] = []
  useEffect(() => {
    getList(id)
  }, [])

  /**
   * @description: 获取权限列表
   * @returns {*}
   */
  const getList = async (id: string | undefined) => {
    try {
      const res: any = await toAssign(id)
      const arr: any = getChildList(res)
      setChildIds(arr);
      const menuIds: any = getCheckedIds(res, [])
      const uniqueChild = uniqueTree(menuIds, arr)
      setExpandedKeys(menuIds)
      setRoleList(res)
      // 5.利用这个新的重组的数组给Tree组件selected赋值
      setCheckedIds(uniqueChild)
      
    } catch (e) {}
  }

  // 1.循环遍历出最深层子节点，存放在一个数组中
  const getChildList = (data: any) => {
    data && data.map((item: { children: string | any[]; id: any }) =>{
      if(item.children && item.children.length>0){
        getChildList(item.children)
      }else{
        childList.push(item.id)
      }
      return null
    })
    return childList;
  }

  // 2.将后台返回的含有父节点的数组和第一步骤遍历的数组做比较
  // 3.如果有相同值，将相同值取出来，push到一个新数组中
  const uniqueTree = (uniqueArr: any, Arr: any) => {
    let uniqueChild: any = []
    for(var i in Arr){
      for(var k in uniqueArr){
      if(uniqueArr[k] === Arr[i]){
          uniqueChild.push(uniqueArr[k])
      }
     }
    }
    return uniqueChild
  }


  // 4.拿到后端返回的所有选中的节点
  const getCheckedIds = (auths: AssignItemType[], initArr: any[]) =>{ 
    auths.forEach((item) => {
      if (item.select) {
        initArr.push(item?.id)
      }
      if (item.children) {
        getCheckedIds(item.children, initArr)
      }
    })
    return initArr
  }

  const handleSave = async() => {
    try {
      await doAssign(id, idsList);
      message.success('分配权限成功')
      navigate('/syt/acl/role', {replace: true})
      // TODO：分配权限以后还需要判断当前用户是否有分配的权限
    } catch(e) {}
  }

  const onCheck = (keys: any, e: any) => {
    const arr = keys.concat(e.halfCheckedKeys)
    // setCheckedIds(arr)
    //  当选中的时候，还需要对id进行控制
    const uniqueChild = uniqueTree(arr, childIds) 
    setCheckedIds(uniqueChild)
    setIdsList(arr);
  };
  const onExpand = (expandedKeysValue: any) => {
    setExpandedKeys(expandedKeysValue)
  }

  const handleCancel = () => {
    navigate('/syt/acl/role', {replace: true})
  }

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card>
          <h1>你好！{roleName}</h1>
          <p>请选择该用户拥有的权限</p>
        </Card>

        <Card>
          <Tree
            checkable
            onCheck={onCheck}
            onExpand={onExpand}
            checkedKeys={checkedIds}
            expandedKeys={expandedKeys}
            treeData={roleList}
            fieldNames={fieldNames}
          />
        </Card>
        <Card>
          <Space
            size="middle"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
          </Space>
        </Card>
      </Space>
    </Card>
  )
}

export default Auth
