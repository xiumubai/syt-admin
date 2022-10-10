import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, message } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import {
  getPermissionList,
  addPermission,
  removePermission,
  updatePermission,
} from '@api/acl/permision'
import {
  PermisionTypes,
  PermisionType,
  PermisionItem,
  PermisionItemList,
} from '@api/acl/modal/permisionTypes'
import type { ColumnsType } from 'antd/lib/table'

const defalutPermision = {
  level: 0,
  name: '',
  code: '',
  toCode: '',
}

const { confirm } = Modal

const Permision: React.FC = () => {
  const [permmisionList, setPermisionList] = useState<PermisionItemList>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalTitle, setModalTitle] = useState<string>('添加菜单')
  const [permision, setPermision] = useState<PermisionType>(defalutPermision)
  const [form] = Form.useForm()
  useEffect(() => {
    getList()
  }, [])

  /**
   * @description: 获取权限列表
   * @returns {*}
   */
  const getList = async () => {
    const res: any = await getPermissionList()
    setPermisionList(res)
  }

  /**
   * @description: 添加菜单
   * @returns {*}
   */
  const toAddPermission = (row: PermisionTypes, title: string) => {
    setPermision(permision => {
      return {
        ...permision,
        id: '',
        pid: row.id,
        level: row.level + 1,
        type: permision.level === 4 ? 2 : 1,
      }
    })
    
    setModalTitle(title)
    
    setIsModalOpen(true)
    form.resetFields()
  }

  /**
   * @description: 修改菜单
   * @returns {*}
   */
  const toUpdatePermission = (row: PermisionTypes, title: string) => {
    console.log(row);
    
    setIsModalOpen(true)
    setModalTitle(title)
    setPermision(() => {
      return {
        ...row,
        type: permision.level === 4 ? 2 : 1, 
      }
    })

    form.setFieldsValue(row)
  }

  /**
   * @description: 关闭Modal
   * @returns {*}
   */
  const handleCancel = () => {
    setIsModalOpen(false)
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
        try {
          console.log(permision, values);
          
          if (permision.id) {
            await updatePermission({ ...permision, ...values })
            message.success('修改成功')
          } else {
            await addPermission({ ...permision, ...values })
            message.success('添加成功')
          }
          setIsModalOpen(false)
          getList()
        } catch (e) {}
      })
      .catch((error) => {
        console.log(error)
      })
  }
  /**
   * @description: 删除菜单
   * @param {string} id
   * @returns {*}
   */
  const removePermision = (id: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该记录, 是否继续?',
      async onOk() {
        try {
          await removePermission(id)
          message.success('删除成功')
          getList()
        } catch (e) {}
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const columns: ColumnsType<PermisionItem> = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '权限值',
      dataIndex: 'code',
    },
    {
      title: '跳转权限值',
      dataIndex: 'toCode',
    },
    {
      title: '操作',
      render(row: PermisionTypes) {
        return (
          <>
            <Button
              disabled={row.level === 4}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => toAddPermission(row, '添加菜单')}
            ></Button>
            <Button
              disabled={row.level === 1}
              type="primary"
              icon={<EditOutlined />}
              className="ml"
              onClick={() => toUpdatePermission(row, '修改菜单')}
            ></Button>
            <Button
              disabled={row.level === 1}
              type="primary"
              icon={<DeleteOutlined />}
              className="ml"
              onClick={() => removePermision(row.id)}
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
      <Table
        bordered
        dataSource={permmisionList}
        defaultExpandedRowKeys={['1']}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={false}
      />

      <Modal
        title={modalTitle}
        forceRender
        destroyOnClose
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} labelCol={{ span: 6 }} >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '名称必须输入' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="功能权限值"
            name="code"
            rules={[{ required: true, message: '功能权限值必须输入' }]}
          >
            <Input />
          </Form.Item>
          {
            permision.level===4 ? <Form.Item label="路由跳转权限值" name="toCode">
            <Input />
          </Form.Item> : null
          }
          
        </Form>
      </Modal>
    </Card>
  )
}

export default Permision
