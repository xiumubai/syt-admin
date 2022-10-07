import { reqGetDictList } from "@/api/cmn/dict";
import type { DictList, DictItem } from "@/api/cmn/dict/model/dictTypes";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Card } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";

// 写在外面效率高    只执行一次,   在组件内就会多次执行
const columns: ColumnsType<DictItem> = [
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "编码",
    dataIndex: "dictCode",
  },
  {
    title: "值",
    dataIndex: "value",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
];

export default function Dict() {

  // 字典列表
  const [dictList, setDictList] = useState<DictList>([])
  // 初始化请求获取列表显示
  useEffect(() => {
    const getDictList = async () => {
      const list = await reqGetDictList(1)
      // 如果字典项的hasChildren为true, 给它添加一个children属性, 值为[]
      list.forEach(item => {
        if (item.hasChildren) {
          item.children = []
        }
      })

      setDictList(list)
    }
    getDictList()
  }, [])


  return (
    <Card>
      <Table 
        columns={columns} 
        dataSource={dictList} 
        bordered 
        rowKey="id" 
        pagination={false} 
        expandable={{
          // 展开/关闭时的图标
            // expanded: 当前是否是展开状态
            // record: 当前行的数据对象
            // onExpand: 切换图标的函数
          expandIcon: ({expanded, record, onExpand}) => {

            // const dictItem  =  record as DictItem
            // 如果当前节点标识没有孩子, 不需要返回图标显示  => 让标题同级对齐
            if (!record.hasChildren) {
              return <span style={{display: 'inline-block', width: 24}}></span>
            }


            // console.log(expanded, record)
            if (expanded) { // 当前是展开的状态
              // 点击此图标不需要请求加载子列表
              return <DownOutlined style={{marginRight: 10}} onClick={(e) => onExpand(record, e)} />
            }
            // 点击此图标很可能需要请求加载子列表
            return <RightOutlined style={{marginRight: 10}} onClick={async (e) => {
              
              // 标识有孩子, 但还没有, 请求获取子列表
              if (record.hasChildren && record.children.length===0) {
                const childList = await reqGetDictList(record.id)
                // 如果字典项的hasChildren为true, 给它添加一个children属性, 值为[]
                childList.forEach(item => {
                  if (item.hasChildren) {
                    item.children = []
                  }
                })

                // 添加为当前字典项的孩子
                record.children = childList
              }

              // 切换图标
              onExpand(record, e)
            }} />
          }
        }}
      />
    </Card>
  );
}
