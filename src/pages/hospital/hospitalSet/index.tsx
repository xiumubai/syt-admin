import { reqBatchDeleteHospitals, reqDeleteHospital, reqGetHospitalSetList } from "@/api/hospital/hospitalSet";
import type { HospitalItem, HospitalItemList } from "@/api/hospital/model/hospitalSetTypes";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Popconfirm, Table, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import type { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import type { Key } from "react";
import { useNavigate } from "react-router-dom";
import './index.less' // 引入组件的样式模块
import confirm from "antd/lib/modal/confirm";

export default function HospitalSet() {

  // 定义分页相关的state数据
  /* 
  current: 2,
  pageSize: 5, 
  total: 23,
  */
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState<number>(2)
  const [hospitalList, setHospitalList] = useState<HospitalItemList>([])  // 分页列表数组
  const [loading, setLoading] = useState(false) // 标识是否正在加载中

  // 创建一个管理Form中数据的对象form
  // 得到输入数据 / 设置要显示的数据 / 重置数据
  // form.getFieldsValue()  field表单项  {hosname: 'xxx', hoscode: 'yyy'}
  // form.setFieldsValue({hosname: 'xxx', hoscode: 'yyy'})
  // form.resetFields()
  const [form] = useForm()

  // 点击提交按钮的回调 => 不太准确
  // 其实只有在表单校验通过后才会调用   当前没有表单校验
  const onFinish = (values: any) => {
    // console.log(values); // {hosname: 'aa', hoscode: 'bb'}
    // console.log(form.getFieldsValue()) // {hosname: 'aa', hoscode: 'bb'}
    // 重新请求获取分页列表 第一页/5条
    getHospitalList(1, 5)
  };

  // 点击重置按钮的回调
  const onReset = () => {
    // 重置表单数据
    form.resetFields();
    // 重新请求获取分页列表  第一页/5条
    getHospitalList(1, 5)
  };


  // 请求获取指定页码和每页数量的医院设置分页列表
  // 指定参数的默认值就是current与pageSize的初始值
  const getHospitalList = async (page=current, limit=pageSize) => {
    console.log('getHospitalList', page, limit)
    // 更新当前页码和每页数量
    setCurrent(page)
    setPageSize(limit)
    // 显示loading
    setLoading(true)

    // 得到输入的搜索条件
    const {hosname, hoscode} = form.getFieldsValue()
    // console.log(form.getFieldsValue())

    // 调用对应的接口请求函数   带上搜索条件参数
    const {records, total} = await reqGetHospitalSetList({ page, limit, hosname, hoscode }) // 对象属性简写

    // 隐藏loading
    setLoading(false)
    // 更新状态
    setHospitalList(records)
    setTotal(total)
  }

  // 初始化请求获取医院设置分页列表
  useEffect(() => {
    getHospitalList() // 不传递参数
  }, [])


  /* 
  columns: Table的所有列
    title: 列的标题
    dataIndex: 当列显示数据对象的哪个属性
    render: 返回当前列要显示的界面(非属性值文本)
      value: any, row: any, index: any)    
        当没有dataIndex, 参数分别为 当前行的数据对象 / 当前行的数据对象 / 下标
        当有dataIndex, 参数分别为: 对应的属性值 / 当前行的数据对象 / 下标
  */
  const columns: ColumnsType<HospitalItem> = [// 指定每一行的数据对象的类型
    {
      title: '序号',
      dataIndex: 'hoscode',
      render (value, row, index) {
        // console.log('render', value, row, index)
        return index + 1
      },
      // fixed: 'left'
      width: 100, // 宽度
      align: 'center' // 水平居中
    },
   
    {
      title: '医院名称',
      dataIndex: 'hosname',
    },
    {
      title: '医院编号',
      dataIndex: 'hoscode',
    },
    {
      title: 'api基础路径',
      dataIndex: 'apiUrl',
    },
    {
      title: '签名',
      dataIndex: 'signKey',
    },
    {
      title: '联系人姓名',
      dataIndex: 'contactsName',
    },
    {
      title: '联系人手机',
      dataIndex: 'contactsPhone',
    },

    {
      title: '操作',
      render: (value, row, index) => {
        return (
          <> {/* 必须要一个根标签 */}
            <Tooltip placement="top" title='修改医院'>
              <Button type="primary" icon={<EditOutlined/>} 
                onClick={goUpdateHospital(row.id)}></Button>
            </Tooltip>
            <Tooltip placement="top" title='删除医院'>
              <Popconfirm
                title={`确定删除${row.hosname}吗?`}
                onConfirm={deleteHospital(row.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary"  danger icon={<DeleteOutlined/>} className="ml" />
              </Popconfirm>
            </Tooltip>
            
          </>
        )
      },
      fixed: 'right', // 固定在右侧
      width: 120 // 指定宽度
    },
  ];

  // 请求删除指定id的医院
  const deleteHospital = (id: number) => {
    return async () => {
      // 发删除请求
      await reqDeleteHospital(id)
      // 成功后提示
      message.success('删除医院成功')
      // 重新获取当页的列表
      getHospitalList()
    }
  }

  // 点击跳转路由   使用柯里化函数 / 高阶函数
  const goUpdateHospital = (id: number) => {
    return () => navigate(`/syt/hospital/hospitalset/edit/${id}`)
  }

  // 得到一个路由跳转导航的函数
  const navigate = useNavigate()

  // 跳转到添加医院路由 => 编程式路由导航
  const goAddHospital = () => {
    navigate('/syt/hospital/hospitalset/add') // push模式
    // navigate('/syt/hospital/hospitalset/add', {replace: true}) // replace模式
    // /syt/hospital/hospitalset
    // navigate('add') // 简写方式
  }

  // 所有选中项的id数组
  const [selectedIds, setSelectedIds] = useState<Key[]>([])

  const batchDeleteHospital = () => {
    // 显示确认框
    confirm({
      title: '批量删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除吗?',
      async onOk() { // 确定的回调
        await reqBatchDeleteHospitals(selectedIds)
        message.success('批量删除医院成功')
        getHospitalList()
      },
      onCancel() { // 取消的回调
        console.log('Cancel');
      },
    });
    // 点击确定后才请求删除 
  }


  return (
    <Card>

      {/* 
        使用antd组件: 1. 找类型例子代码浏览代码 / 使用 / 修改 2, 如果有语法不理解, 再去看它的API
        Form 表单组件
          form: 管理表单数据的对象
          layout: 内部布局 
            'horizontal': 标题与input在一行, 但多个Item是垂直的
            'vertical': 所有的都垂直的
            'inline': 所有的都水平行内的
          Form.Item 表单项组件
            name: 指定表单项的标识, 也就是收集数据的标识名称
            label: 标题
            Input 输入框组件
            Button 按钮组件
              type 按钮的类型
              htmlType 指定提交按钮的, 默认是一般button
              icon 图标
      */}
      <Form
        form={form}
        onFinish={onFinish}
        layout="inline"
      >
        <Form.Item name='hosname'>
          <Input placeholder="医院名称"/>
        </Form.Item>
        <Form.Item name='hoscode'>
          <Input placeholder="医院编号"/>
        </Form.Item>
        <Form.Item>
          {/* 按钮的2种类型submit/button */}
          <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
            查询
          </Button>
          <Button className="ml" onClick={onReset}>清空</Button>
        </Form.Item>
      </Form>

      {/* 
        当标签属性值是true时, 可以省略属性值, 只写属性名
        定义组件的less样式, 并引入使用
      */}
      <div className="mtb">
        <Button type="primary" onClick={goAddHospital}>添加</Button>
        <Button type="primary" danger className="ml" disabled={selectedIds.length===0}
          onClick={batchDeleteHospital}>批量删除</Button>
      </div>

      {/* 
      Table 表格组件
        bordered: 是否带边框
        loading: 是否显示loading界面
        dataSource: 数据对象的数组
        columns: 列的描述信息对象的数组
        rowKey: 指定取数据对象的哪个属性值作为列表项的key   一般都是id
        scroll: 指定table的宽度大于1300就形成滚动条 一般与columns中的fixed配合使用
        pagination: 分页器配置对象
          current 当前页码
          pageSize 每页条数
          total 总数量
          showSizeChanger  是否显示可选择每页数量列表
          pageSizeOptions: 可选择每页条数的列表
          showQuickJumper  是否显示快速跳转页码的输入框 
          showTotal=  total => `Total ${total} items`  指定左侧总页面文本
          onChange	页码或 pageSize 改变的回调，	function(page, pageSize)  // 页码 / 每页数量
      */}
      <Table 
        bordered
        loading={loading}
        dataSource={hospitalList} 
        columns={columns} 
        rowKey="id"
        scroll={{ x: 1300 }} 
        pagination={{
          current,
          pageSize, 
          total,
          pageSizeOptions: [5, 10, 15, 20],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `总共 ${total} 条`,
          onChange: getHospitalList
        }}
        rowSelection={{
          type: 'checkbox', // 默认就是这个值, 也可以是radio 单选
          // 当勾选状态发生改变时, 调用
          // selectedRowKeys: 选中项数据对象的id的数组   后面就是要根据这个值来删除对应的医院
          // selectedRows: 选中的所有数据对象数组
          onChange: (selectedRowKeys: Key[], selectedRows: HospitalItem[]) => {
            console.log(selectedRowKeys, selectedRows)
            // 保存选中的id数组
            setSelectedIds(selectedRowKeys)
          }
        }}
      />
    </Card>
  );
}
