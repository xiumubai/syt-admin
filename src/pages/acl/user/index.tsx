import React, { useEffect, useState } from 'react'
import {
  Card,
  Table,
  Form,
  Input,
  Button,
  Modal,
  message,
  Checkbox,
} from 'antd'
import {
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form'
import {
  getUserList,
  adduser,
  updateUser,
  delUser,
  batchDelUser,
  getRoles,
  assignRoles,
} from '@/api/acl/user'
import type { Key } from 'react'
import {
  UserItem,
  UserList,
  UserType,
  OptionTypes,
} from '@/api/acl/modal/userTypes'

import type { ColumnsType } from 'antd/lib/table'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import './index.less'
import AuthButton from '@/components/authButton'

const { confirm } = Modal

const User: React.FC = () => {
  const [userList, setUserList] = useState<UserList>([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState<number>(0)
  const [selectedIds, setSelectedIds] = useState<Key[]>([])
  const [modalTitle, setModalTitle] = useState<string>('添加用户')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<UserType>(1)
  const [user, setUser] = useState<UserItem>()
  const [roleList, setRoleList] = useState<OptionTypes[]>([])
  const [userRolesIds, setUserRolesIds] = useState<number[]>([])
  const [checkAll, setCheckAll] = useState<boolean>(false)
  const [form] = useForm()
  const [formSearch] = useForm()
  const [roleForm] = useForm()
  
  useEffect(() => {
    initUserList()
  }, [])

  const initUserList = async (page = current, limit = pageSize) => {
    try {
      setCurrent(page)
      setPageSize(limit)
      const { username } = formSearch.getFieldsValue()
      const { records, total } = await getUserList({ page, limit, username })
      setUserList(records)
      setTotal(total)
    } catch (e) {}
  }

  const onFinish = () => {
    initUserList(1, 5)
  }

  const onReset = () => {
    formSearch.resetFields()
    // 重新请求获取分页列表  第一页/5条
    initUserList(1, 5)
  }

  /**
   * @description: 添加用户/修改用户
   * @returns {*}
   */
  const handleAddUser = (type: UserType, row?: UserItem) => {
    changeModalTitlte(type)
    setModalType(type)
    if (type === 1) {
      form.resetFields()
    } else if (type === 2) {
      form.setFieldsValue(row)
    } else {
      setUser(row)
      getRoleList(row?.id)
    }
    setIsModalOpen(true)
  }

  const getRoleList = async (id: any) => {
    try {
      const res: any = await getRoles(id)

      // 设置options
      const r = res.allRolesList.map((item: any) => {
        return {
          label: item.roleName,
          value: item.id,
        }
      })
      
      setRoleList(r)
      console.log(res.assignRoles);
      
      const l: number[] = res?.assignRoles.map((i: any) => i?.id)
      
      setUserRolesIds(l)
      setCheckAll(res.allRolesList.length === res.assignList.length)
    } catch (e) {}
  }

  /**
   * @description: 修改Modal标题
   * @returns {*}
   */
  const changeModalTitlte = (type: UserType) => {
    switch (type) {
      case 1:
        setModalTitle('添加用户')
        break
      case 2:
        setModalTitle('修改用户')
        break
      case 3:
        setModalTitle('设置角色')
        break
      default:
        setModalTitle('添加用户')
    }
  }

  /**
   * @description: 批量删除用户
   * @returns {*}
   */
  const batchDeleteUser = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除所选择的用户, 是否继续?',
      async onOk() {
        try {
          await batchDelUser(selectedIds)
          message.success('删除成功')
          initUserList(1, 5)
        } catch (e) {}
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  /**
   * @description: Modal确认
   * @returns {*}
   */
  const handleOk = () => {
    if (modalType === 3) {
      submitAssign()
      return
    }
    // 表单校验通过
    form
      .validateFields()
      .then(async (values) => {
        if (modalType === 1) {
          await adduser(values)
          initUserList(1, 5)
          message.success('添加成功')
        } else if (modalType === 2) {
          await updateUser(values)
          initUserList()
          message.success('修改成功')
        }
        setIsModalOpen(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const submitAssign = async () => {
    const roleId = userRolesIds.join(',')
    const adminId: any = user?.id
    try {
      await assignRoles(adminId, roleId)
      initUserList()
      message.success('分配角色成功')
      setIsModalOpen(false)
    } catch (e) {}
  }
  /**
   * @description: 关闭Modal
   * @returns {*}
   */
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  /**
   * @description: 全选
   * @param {CheckboxChangeEvent} e
   * @returns {*}
   */
  const handleCheckAll = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked
    const l: any = checked ? roleList.map((item) => item.value) : []
    console.log(l);
    
    setCheckAll(checked)
    setUserRolesIds(l)
  }

  /**
   * @description: 单选
   * @param {any} values
   * @returns {*}
   */
  const handleCheckBoxChange = (values: any) => {
    setUserRolesIds(values)
    setCheckAll(values.length === roleList.length)
  }

  /**
   * @description: 删除用户
   * @param {number} id
   * @returns {*}
   */
  const handleRemoveUser = (id: number) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该记录, 是否继续?',
      async onOk() {
        try {
          await delUser(id)
          message.success('删除成功')
          initUserList(1, 5)
        } catch (e) {}
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const columns: ColumnsType<UserItem> = [
    {
      title: '序号',
      dataIndex: 'hoscode',
      render(value, row, index) {
        return index + 1
      },
      width: 100,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
    },
    {
      title: '角色列表',
      dataIndex: 'roleName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      render(row: UserItem) {
        return (
          <>
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={() => handleAddUser(3, row)}
            ></Button>
            <AuthButton authKey="btn.User.update">
              <Button
                type="primary"
                icon={<EditOutlined />}
                className="ml"
                onClick={() => handleAddUser(2, row)}
              ></Button>  
            </AuthButton>
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              className="ml"
              onClick={() => handleRemoveUser(row.id)}
              danger
            ></Button>
          </>
        )
      },
      width: 200,
      fixed: 'right',
    },
  ]

  return (
    <Card>
      <Form form={formSearch} onFinish={onFinish} layout="inline">
        <Form.Item name="username">
          <Input placeholder="用户名" type="text" />
        </Form.Item>
        <Form.Item>
          {/* 按钮的2种类型submit/button */}
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            查询
          </Button>
          <Button className="ml" onClick={onReset}>
            清空
          </Button>
        </Form.Item>
      </Form>
      <div className="mtb">
        <Button type="primary" onClick={() => handleAddUser(1)}>
          添加
        </Button>
        <Button
          type="primary"
          danger
          className="ml"
          disabled={selectedIds.length === 0}
          onClick={batchDeleteUser}
        >
          批量删除
        </Button>
      </div>
      <Table
        bordered
        dataSource={userList}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          current,
          pageSize,
          total,
          pageSizeOptions: [5, 10, 15, 20],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `总共 ${total} 条`,
          onChange: initUserList,
        }}
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys: Key[], selectedRows: UserItem[]) => {
            console.log(selectedRowKeys, selectedRows)
            // 保存选中的id数组
            setSelectedIds(selectedRowKeys)
          },
        }}
      ></Table>

      <Modal
        title={modalTitle}
        forceRender
        destroyOnClose
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {modalType !== 3 ? (
          <Form form={form} labelCol={{ span: 6 }}>
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '用户名必须输入' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="用户昵称" name="nickName">
              <Input value={user?.username} />
            </Form.Item>
            {modalType === 1 && (
              <Form.Item
                label="用户密码"
                name="password"
                rules={[{ required: true, message: '用户密码必须输入' }]}
              >
                <Input />
              </Form.Item>
            )}
          </Form>
        ) : (
          <Form form={roleForm} labelCol={{ span: 4 }}>
            <Form.Item label="用户名">
              <Input disabled value={user?.username} />
            </Form.Item>
            <Form.Item label="全选">
              <Checkbox
                className="mtp-6"
                checked={checkAll}
                onChange={handleCheckAll}
              />
              <div className="mbp-15"></div>
              <Checkbox.Group
                onChange={handleCheckBoxChange}
                value={userRolesIds}
                options={roleList}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Card>
  )
}

export default User
