import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Select, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import {reqGetHospitalList, reqGetHospitalTypes, reqGetLocationList, reqUpdateStatus} from '@/api/hospital/hospitalList'
import './index.less'
import { HospitalItemType, HospitalListType, LocationList, Status } from "@/api/hospital/model/hospitalListTypes";
import { useForm } from "antd/lib/form/Form";
import { useNavigate } from "react-router-dom";

const {Option} = Select


export default function HospitalList() {

  // 分页列表相关状态数据
  const [hospitalList, setHospitalList] = useState<HospitalListType>([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // 请求获取医院列表动态显示
  const getHospitalList = async (page=current, limit=pageSize) => {
    // 在请求前,显示loading
    setLoading(true)
    // 更新一下当前页码和每页数量
    setCurrent(page)
    setPageSize(limit)

    // 得到表单输入的条件参数
    const values = form.getFieldsValue()
    console.log(values)

    // 发请求获取分页列表数据
    const {content, totalElements} = await reqGetHospitalList({page, limit, ...values})

    // 更新数据显示分页列表
    setHospitalList(content)
    setTotal(totalElements)
    setLoading(false) // 隐藏loading

  }

  // 初始化获取医院列表显示
  useEffect(() => {
    getHospitalList()
  }, [])

  // 路由跳转函数
  const navigate = useNavigate()

  const goSchedule = (hoscode: string) => {
    return () => {
      navigate(`/syt/hospital/hospitallist/schedule/${hoscode}`)
    }
  }

  /* 
  更新指定医院的状态
  */
  const updateStatus = async (row: HospitalItemType) => {
    await reqUpdateStatus(row.id, row.status===0 ? 1 : 0)
    message.success('更新状态成功')
    getHospitalList()
  }

  const columns: ColumnsType<HospitalItemType>= [
    {
      title: '序号',
      render (_x, _y, index) {
        return index + 1
      },
      width: 100,
      align: "center"
    },
    { // 先放一下
      title: '医院LOGO',
      dataIndex: 'logoData',
      render (val) {
        // 缺少左侧的标识字符: data:image/jpeg;base64,
        return <img className="hospital-logo" src={'data:image/jpeg;base64,' + val} alt="logo"/>
      }
    },
    {
      title: '医院名称',
      dataIndex: 'hosname'
    },
    {
      title: '等级',
      dataIndex: 'param',
      render (val, row) {
        // return val.hostypeString  // 没有提示
        return row.param.hostypeString  // 有提示
      }
    },
    {
      title: '详细地址',
      render (row: HospitalItemType) {
        return row.param.fullAddress  // 有提示
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render (val: Status) {
        return val===0 ? '未上线' : '已上线'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '操作',
      render (row: HospitalItemType) {
        return (
          <>
            <Button 
              type="primary" 
              size="small"
              onClick={() => navigate(`/syt/hospital/hospitallist/show/${row.id}`)}
            >查看</Button>
            <Button type="primary" className="ml" size="small"
            onClick={goSchedule(row.hoscode)}>排班</Button>
            <Button onClick={() => updateStatus(row)} type="primary" className="ml" size="small">{row.status===0 ? '上线' : '下线'}</Button>
            {/* 
            onClick={() => navigate(`/syt/hospital/hospitallist/schedule/${row.hoscode}`)}>排班</Button>
            onClick={() => goSchedule(row.hoscode)}>排班</Button>
            onClick={goSchedule(row.hoscode)}>排班</Button>
            */}
          </>
        )
      },
      width: 200,
      fixed: 'right'
    },

  ]

  // 用来管理form输入数据的对象
  const [form] = useForm()
  // 省列表状态
  const [provinceList, setProvinceList] = useState<LocationList>([])
  // 市列表状态
  const [cityList, setCityList] = useState<LocationList>([])
  // 区列表状态
  const [districtList, setDistrictList] = useState<LocationList>([])

  // 初始化请求获取省列表显示
  useEffect(() => {
    const getProvinceList = async () => {
      const provinceList = await reqGetLocationList()
      setProvinceList(provinceList)
    }
    getProvinceList()
  }, [])

  // 选择省的回调   value: 是选择省的value属性值, 就是省id的字符串值
  const handleProvinceChange = async (value: string) => {
    // 重新选择省:  还会显示前面选择的市/区, 以及区的列表   => 应该清除
    // form.resetFields() // 重置所有表单项的数据
    form.resetFields(['cityCode', 'districtCode']) // 清除指定表单项的输入数据
    setDistrictList([])

    const cityList = await reqGetLocationList(value)
    setCityList(cityList)
  }

  // 选择市的回调   value: 是选择市的value属性值, 就是市id的字符串值
  const handleCityChange = async (value: string) => {
    // 重新选择市:  还会显示前面选择的区  => 应该清除
    form.resetFields(['districtCode']) // 清除指定表单项的输入数据

    const districtList = await reqGetLocationList(value)
    setDistrictList(districtList)
  }

  // 医院类型列表状态
  const [hospitalTypes, setHospitalTypes] = useState<LocationList>([])
  // 初始显示医院类型列表
  useEffect(() => {
    async function getHospitalTypes() {
      const hospitalTypes = await reqGetHospitalTypes()
      setHospitalTypes(hospitalTypes)
    }
    getHospitalTypes()
  }, [])

  // 清除
  const onReset = () => {
    // 清除表单输入
    form.resetFields()
    // 清除市和区的列表
    setCityList([])
    setDistrictList([])
    // 重新获取列表
    getHospitalList()
  }

  return (
    <Card>
      <Form layout="inline" form={form}>
        {/*
          Select的width
          Form.Item的margin-bttom
          不能通过class来修改样式, 只能用style 
        */}
        <Form.Item name='provinceCode' style={{marginBottom: 20}}>
          <Select placeholder="请选择省" style={{width: 200}} onChange={handleProvinceChange}>
            {
              provinceList.map(item => <Option key={item.id} value={item.value}>{item.name}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item name='cityCode'>
          <Select placeholder="请选择市" style={{width: 200}} onChange={handleCityChange}>
            {
              cityList.map(item => <Option key={item.id} value={item.value}>{item.name}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item name='districtCode'>
          <Select placeholder="请选择区" style={{width: 200}}>
            {
              districtList.map(item => <Option key={item.id} value={item.value}>{item.name}</Option>)
            }
          </Select>
        </Form.Item>

        <Form.Item name='hosname'>
          <Input placeholder="医院名称"></Input>
        </Form.Item>
        <Form.Item name='hoscode'>
          <Input placeholder="医院编号"></Input>
        </Form.Item>

        <Form.Item name='hostype'>
          <Select placeholder="医院类型" style={{width: 200}}>
            {
              hospitalTypes.map(item => <Option key={item.id} value={item.value}>{item.name}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item name='status'>{/* Form.Item标签后的注释不能与标签之间有空格 */}
          <Select placeholder="医院状态" style={{width: 200}}> {/* status值只能是数值0或1, 不能是字符串'0'或'1' */}
            {/* value必须用jsx的表达式写法, 收集值才是数值 */}
            <Option value={0}>未上线</Option>
            <Option value={1}>已上线</Option>
          </Select>
        </Form.Item>

        <Form.Item className="item-mb">
          <Button onClick={() => getHospitalList()} type="primary" icon={<SearchOutlined/>}>查询</Button>
          <Button className="ml" onClick={onReset}>清空</Button>
        </Form.Item>
      </Form>

      <Table 
        bordered
        loading={loading}
        dataSource={hospitalList} 
        columns={columns}
        rowKey="id"
        scroll={{x: 1200}}
        pagination={{
          current,
          pageSize,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: getHospitalList
        }}
      />
    </Card>
  )
}
