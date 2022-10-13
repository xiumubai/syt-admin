import React, { useEffect, useState } from 'react'
import { Card, Tree, Space, Button, message } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { toAssign, doAssign } from '@/api/acl/permision'
import { useSearch } from '@/app/hooks'
import {AssignItemType } from '@/api/acl/modal/roleTypes'
import './index.less'

const fieldNames = {
  title: 'name',
  key: 'id',
}

const Auth: React.FC = () => {
  const [roleList, setRoleList] = useState()
  const [checkedIds, setCheckedIds] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const { id } = useParams()
  const { roleName } = useSearch()
  const navigate = useNavigate()
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
      const ids: any = getCheckedIds(res, [])
      setExpandedKeys(ids)
      setRoleList(res)
      setCheckedIds(ids)
      
    } catch (e) {}
  }

  const getCheckedIds = (auths: AssignItemType[], initArr: any[]) =>{ 
    
    auths.forEach((item) => {
      if (item.select) {
        initArr.push(item?.id)
      }
      if (item.children) {
        getCheckedIds(item.children, initArr)
      }
    })
    // console.log('initArr', initArr);
    return initArr 
  }

  const handleSave = async() => {
    try {
      console.log(checkedIds);
      
      await doAssign(id, checkedIds);
      message.success('分配权限成功')
      navigate('/syt/acl/role', {replace: true})
      // TODO：分配权限以后还需要判断当前用户是否有分配的权限
    } catch(e) {}
  }

  const onCheck = (checkedKeysValue: any) => {
    setCheckedIds(checkedKeysValue)
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
            defaultExpandAll
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
