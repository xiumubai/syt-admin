import { reqGetDepartmentList, reqGetScheduleList, reqGetScheduleRuleList } from "@/api/hospital/hospitalList";
import { DepartmentList, ScheduleItem, ScheduleList, ScheduleRuleList } from "@/api/hospital/model/hospitalListTypes";
import { Card, Col, message, Pagination, Row, Table, Tag, Tree } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Key, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function HospitalSchedule() {



  const columns: ColumnsType<ScheduleItem> = [
    {
      title: '序号',
      render (_x, _y, index) {
        return index + 1
      },
      width: 80,
      align: 'center',
    },
    /* 
    title: string; // 职位
  workDate: string; // 号源时间
  reservedNumber: number; // 总预约数
  availableNumber: number; // 剩余预约数
  amount: number; // 挂号费
  skill: string; // 擅长技能
  docname: string; // 医生姓名
    */
    {
      title: '医生',
      dataIndex: 'docname'
    },
    {
      title: '职称',
      dataIndex: 'title'
    },
    {
      title: '号源时间',
      dataIndex: 'workDate'
    },
    {
      title: '总预约数',
      dataIndex: 'reservedNumber'
    },
    {
      title: '剩余预约数',
      dataIndex: 'availableNumber'
    },
    {
      title: '挂号费(元)',
      dataIndex: 'amount'
    },
    {
      title: '擅长技能',
      dataIndex: 'skill'
    }
  ]

  // 获取hoscode参数  指定为string类型
  const hoscode = useParams().hoscode as string

  /* 
    title: 标题
    key: 标识名称 => 用于确定展开/选中, 每个项的key都是唯一的
    children: 子列表数据数组
    disabled: 是否禁用此节点
  */
  // 科室列表state
  const [departmentList, setDepartmentList] = useState<DepartmentList>([])
  // 指定展开的key数组  => 最终的值应该是所有一级科室的depcode的数组
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([])
  /* 
  设计一个代表选中的科室的depcode的状态, 将它指定 selectedKeys= [depcode]
  当我们得到科室列表后, 将第一个科室的第一个子科室的depcode保存到状态中
  点击选择某个科室节点, 将点击科室的depcode保存到状态中
  */
  const [depcode, setDepcode] = useState('')

  // 初始化获取科室列表显示
  useEffect(() => {
    const getDepartmentList = async () => {
      const departmentList = await reqGetDepartmentList(hoscode)
      // 为了让所有一级科室节点是禁用状态, 给一级的数据对象添加一个disabled为true的属性
      setDepartmentList(departmentList.map(item => ({...item, disabled: true})))

      // 将所有一级科室的depcode的数组指定为expandedKeys
      setExpandedKeys(departmentList.map(item => item.depcode))

      // 如果当前医院没有科室数据, 提示一下
      if (departmentList.length===0) {
        message.warn('当前医院还没有添加科室')
        return
      }

      // 将第一个科室的第一个子科室的depcode保存到状态中
      if (departmentList[0].children) {
        // 确定depcode和depname
        const {depcode, depname} = departmentList[0].children[0]
        setDepcode(depcode)
        setDepname(depname)

        // 获取对应的排班规则列表
        getScheduleRuleList(1, 5, depcode)
      }
      
    }

    getDepartmentList()
  }, [])

  // 选择某个科室的回调
  // e:{selected: bool, selectedNodes, node, event}   node是当前科室数据对象
  const onSelect = function(selectedKeys: Key[], event: any) {
    console.log(selectedKeys, event)
    // 点击当前选中项
    if (selectedKeys.length===0) return

    // 得到点击科室的depcode
    const depcode = selectedKeys[0] as string  // selectedKeys  ['200004057']
    // 保存到state中 => 就会选中
    setDepcode(depcode)
    // 得到科室的名称
    const depname = event.node.depname
    // 更新到状态中
    setDepname(depname)

    // 重新获取排班规则列表显示
    getScheduleRuleList(1, 5, depcode)
  }


  /* 
  1. 排班规则分页列表的相关状态数据
  2. 定义一个请求获取分页列表显示的函数
      在初始确定第一个科室时调用
      在点击某个科室时调用
  3. 遍历分页数组显示列表
  4. 分页器页码改变, 调用获取列表的函数
  */

  // 排班规则分页列表的相关状态数据
  const [scheduleRuleList, setScheduleRuleList] = useState<ScheduleRuleList>([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)

  // 定义一个请求获取分页列表显示的函数
  // 注意: 一定要接收最新的depcode
  const getScheduleRuleList = async (page: number, limit: number, depcode: string) => {
    // 更新当前页码和每页数量
    setCurrent(page)
    setPageSize(limit)
    // 请求获取分页列表数据
    const result = await reqGetScheduleRuleList({ page, limit, hoscode, depcode })
    // 取出数据
    const {total, bookingScheduleList, baseMap} = result
    // 更新hosname
    setHosname(baseMap.hosname)

    // 更新显示分页列表
    setScheduleRuleList(bookingScheduleList)
    setTotal(total)

    // 如果没有排班数据, 提示一下
    if (total===0) {
      message.warn('当前科室没有排班数据!')
      // 清除一些老的数据
      setScheduleList([])
      setWorkDate('')
    } else {
      // 在初始显示排班规则列表后, 显示第一个规则对应的排班列表
      const workDate = bookingScheduleList[0].workDate
      // 保存到状态中
      setWorkDate(workDate)
      getScheduleList(depcode, workDate)
    }
  }

  /* 
  1, 定义排班列表状态数据
  2. 定义请求获取排班列表的函数
      在初始显示排班规则列表后, 显示第一个规则对应的排班列表
      点击某个排班规则项时, 显示对应的规则列表
  3. 遍历排班列表数据, 显示列表
  4. 默认选中第一个排班规则, 点击谁, 就选中谁
  */
  // 定义排班列表状态数据
  const [scheduleList, setScheduleList] = useState<ScheduleList>([])
  // 当前规则对象的workDate
  const [workDate, setWorkDate] = useState('')

  // 定义请求获取排班列表的函数
  const getScheduleList = async (depcode: string, workDate: string) => {
    const scheduleList = await reqGetScheduleList({ hoscode, depcode, workDate })
    setScheduleList(scheduleList)
  }

  // 医院名称  => 在得到排班规则列表时确定
  const [hosname, setHosname] = useState('')
  // 科室名称  => 初始化/点击科室确定
  const [depname, setDepname] = useState('')

  
  // 窗口的高度 document.documentElement.clientHeight

  // 计算: 窗口的高度 - Header高度(64) - tab和margin的高度(44) - Card的padding(48) - p标签的高度和margin(36)
  const treeHeight = document.documentElement.clientHeight - 64 - 44 - 48 - 36

  return (
    <Card>
      <p>选择：{hosname} / {depname} / {workDate}</p>
      <Row gutter={20}>
        <Col span={5}>
          <div style={{
            height: treeHeight,
            overflowY: 'scroll'
          }}>
            {/* 
            
            treeData: 列表数据
            fieldNames: 指定数据对象中key和title的属性名
            expandedKeys: 根据指定的值来展开列表

            [

              {
                id: 'xxx',
                depname: 'yyy',
                depcode: 'zzz',
                children: [
                  {}
                ]
              }
            ]

            */}
          <Tree
            treeData={departmentList as []} 
            fieldNames={{key: 'depcode', title: 'depname'}}
            expandedKeys={expandedKeys}
            selectedKeys={[depcode]}
            onSelect={onSelect}
          />
          </div>
        </Col>
        <Col span={19}>

          {
            scheduleRuleList.map(item => (
              <Tag key={item.workDate} color={workDate===item.workDate ? 'green' : ''}
                onClick={() => {
                  if (item.workDate!==workDate) { // 点击的不是当前的
                    // 更新一个workDate  => 选中当前项
                    setWorkDate(item.workDate)
                    // 重新获取排班列表显示
                    // getScheduleList(depcode, workDate)
                    getScheduleList(depcode, item.workDate)
                  }
                }}>
                <div>{item.workDate} {item.dayOfWeek}</div>
                <div>{item.availableNumber} / {item.reservedNumber}</div>
              </Tag>
            ))
          }

          <Pagination
            style={{margin: '20px 0'}}
            current={current}
            pageSize={pageSize}
            total={total}
            pageSizeOptions={[5, 10, 15]}
            showSizeChanger
            /* 点击页码/改变每页数量 */
            onChange={(page, pageSize) => getScheduleRuleList(page, pageSize, depcode)}
          />

          <Table
            dataSource={scheduleList}
            columns={columns}
            pagination={false}
            rowKey='id'
          />
        </Col>
      </Row>
    </Card>
  )
}

export default HospitalSchedule;