import React, { useEffect, useState } from 'react'
import {
  Card,
  Table,
  Form,
  Input,
  Button,
  Modal,
  message,
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
  getRoleList,
  adduser,
  updateUser,
  delUser,
  batchDelUser,
} from '@/api/acl/role'
import type { Key } from 'react'
import { useNavigate } from "react-router-dom";
import {
  UserItem,
  UserList,
  UserType,
  RoleItemType
} from '@/api/acl/modal/userTypes'

import type { ColumnsType } from 'antd/lib/table'
import './index.less'

const { confirm } = Modal

const Role: React.FC = () => {
  const [userList, setUserList] = useState<UserList>([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState<number>(0)
  const [selectedIds, setSelectedIds] = useState<Key[]>([])
  const [modalTitle, setModalTitle] = useState<string>('添加用户')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<UserType>(1)
  const [user, setUser] = useState<UserItem>()
  const [form] = useForm()
  const [formSearch] = useForm()
  const navigate = useNavigate()

  useEffect(() => {
    initUserList()
  }, [])

  const initUserList = async (page = current, limit = pageSize) => {
    try {
      setCurrent(page)
      setPageSize(limit)
      const { roleName } = formSearch.getFieldsValue()
      const { records, total } = await getRoleList({ page, limit, roleName })
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
    setUser(row)
    if (type === 1) {
      form.resetFields()
    } else if (type === 2) {
      form.setFieldsValue(row)
    }
    setIsModalOpen(true)
  }
 
  /**
   * @description: 修改Modal标题
   * @returns {*}
   */
  const changeModalTitlte = (type: UserType) => {
    switch (type) {
      case 1:
        setModalTitle('添加角色')
        break
      case 2:
        setModalTitle('修改角色')
        break
      case 3:
        setModalTitle('设置角色')
        break
      default:
        setModalTitle('添加角色')
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
    // 表单校验通过
    form
      .validateFields()
      .then(async (values) => {
        if (modalType === 1) {
          await adduser(values)
          initUserList(1, 5)
          message.success('添加成功')
        } else if (modalType === 2) {
          await updateUser({...values, id: user?.id})
          initUserList()
          message.success('修改成功')
        }
        setIsModalOpen(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  /**
   * @description: 关闭Modal
   * @returns {*}
   */
  const handleCancel = () => {
    setIsModalOpen(false)
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

  const handleAuth = (row: RoleItemType) => {
    console.log(row);
    navigate(`/syt/acl/role/${row?.id}?roleName=${row.roleName}`)
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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render(row: UserItem) {
        return (
          <>
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={() => handleAuth(row)}
            ></Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="ml"
              onClick={() => handleAddUser(2, row)}
            ></Button>
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
        <Form.Item name="roleName">
          <Input placeholder="角色名" type="text" />
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
       <Form form={form} labelCol={{ span: 6 }}>
          <Form.Item
            label="角色名称"
            name="roleName"
            rules={[{ required: true, message: '角色名称必须输入' }]}
          >
            <Input placeholder='请求输入角色名称'/>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Role
