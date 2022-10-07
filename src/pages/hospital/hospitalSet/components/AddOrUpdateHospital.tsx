import { reqAddHospital, reqGetHospitalItem, reqUpdateHospital } from "@/api/hospital/hospitalSet";
import { ReqAddHospitalParams } from "@/api/hospital/model/hospitalSetTypes";
import { Button, Card, Form, Input, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* 
添加或更新医院的路由组件
*/
export default function AddOrUpdateHospital() {
  console.log('AddOrUpdateHospital')
  const [form] = useForm()

  // 标识是否正在请求中
  const [loading, setLoading] = useState(false)

  // 得到路由跳转函数
  const navigate = useNavigate()

  // 点击提交按钮且校验通过后调用
  // 发添加医院请求, 成功后, 跳转到医院设置界面
  const onFinish = async (values: ReqAddHospitalParams) => {
    try {
      // 显示loading
      setLoading(true)

      // 如果有id, 发修改医院请求
      if (id) {
        await reqUpdateHospital({
          ...values,
          id: +id,
        })
      } else {
        // 如果没有id, 发添加医院请求
        await reqAddHospital(values)
      }
     
      // 成功后, 提示添加成功, 跳转到医院设置界面
      message.success(`${id ? '修改' : '添加'}医院成功!`)
      navigate('/syt/hospital/hospitalSet', {replace: true}) // 不用回退到当前添加界面
      // 成功后, 隐藏loading
      setLoading(false)
    } catch (error) { // 请求出错后, 隐藏Loading
      setLoading(false) // 为了下面能修改输入后, 重新点击添加
    }
  }


  // 初始化获取指定的医院信息  前提是param参数中有id
  const {id} = useParams()
  useEffect(() => {
    console.log('useEffect')
    // 请求获取医院显示到form中
    async function getHospital() {
      // 有id才请求获取   ==> 当前是修改
      if (id) {
        // 得到了医院信息对象
        const hospital = await reqGetHospitalItem(+id)
        // 显示到form
        form.setFieldsValue(hospital)
      } else { // 如果没有id, 如何处理     从修改切换到添加  => 会显示修改界面产生的数据
        form.resetFields()
      }
    }
    getHospital()
  }, [id]) // 有id变为没id | 没id变为有id, effect回调一定要重新执行


/* 
{
  "apiUrl": "string",
  "contactsName": "string",
  "contactsPhone": "string",
  "hoscode": "string",
  "hosname": "string",
}
*/
  return (
    <Card>
      {/* 
      labelCol: 左侧标题占用的列数
      wrapperCol: 右侧占用的列数
      总共是24列

      offset: 3: 指定向右偏移几列
      */}
      <Form 
        form={form} 
        onFinish={onFinish}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      >
        <Form.Item 
          label="医院名称" 
          name='hosname'
          rules={[ // 校验规则数组
            // 一个校验是一个对象
            { 
              required: true, // 必须的
              message: '请输入医院名称' // 错误提示信息
            }
          ]}>
          <Input placeholder="请输入医院名称"/>
        </Form.Item>
        <Form.Item 
          label="医院编号" 
          name='hoscode'
          rules={[{ required: true, message: '请输入医院编号'}]}
        >
          <Input placeholder="请输入医院编号"/>
        </Form.Item>
        <Form.Item label="api基础路径" name='apiUrl' rules={[
          { required: true, message: '请输入api基础路径'},
          // {type: 'url', message: '请输入正确的url格式'}
        ]}>
          <Input placeholder="请输入api基础路径"/>
        </Form.Item>
        <Form.Item label="联系人姓名" name='contactsName' rules={[{ required: true, message: '请输入联系人姓名'}]}>
          <Input placeholder="请输入联系人姓名"/>
        </Form.Item>
        <Form.Item 
          label="联系人手机" 
          name='contactsPhone' 
          rules={[
            /* 使用的是内置的校验规则来实现表单校验 */
            // { required: true, message: '请输入联系人手机'},
            // { pattern: /^1[3-8]\d{9}$/, message: '请输入正确格式的手机号'}

            // 使用自定义校验 
            {
              required: true,  // 为了显示*号
              // value就是要校验的输入数据
              // 回调函数返回失败的promise代表校验失败, 返回成功的promise代表校验通过
              validator: async (rule, value, callback) =>{ 
                if (!value) {
                  throw new Error('请输入联系人手机')   // 产生一个包含错误提示信息的失败promise, 代表校验失败
                } else if (!value.match(/^1[3-8]\d{9}$/)) {  // match: 是否匹配正则
                  throw '请输入正确格式的手机号'  // 也可以直接指定要提示的文本
                } else {
                  // 产生的是一个成功的promise, 代表校验通过
                }
              }
            }
          ]}
        >
          <Input placeholder="请输入联系人手机"/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 3}}>
          <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
          <Button className="ml" 
            onClick={() => navigate('/syt/hospital/hospitalSet', {replace: true})}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
