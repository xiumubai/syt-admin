import { reqGetHospitalShow } from "@/api/hospital/hospitalList";
import { HospitalShowType } from "@/api/hospital/model/hospitalListTypes";
import { Button, Card, Descriptions } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import './index.less'

/* 
医院详情路由组件
*/
function HospitalShow() {

  // 数据初始化要按照数据结构全部进行初始化(因为属性是必填项)
  const [hospitalShow, setHospitalShow] = useState<HospitalShowType>({
    bookingRule: {
      cycle: 0,
      releaseTime: "",
      stopTime: "",
      quitTime: "",
      rule: [],
    },
    hospital: {
      id: "",
      createTime: "",
      param: {
        hostypeString: "",
        fullAddress: "",
      },
      hoscode: "",
      hosname: "",
      hostype: "",
      provinceCode: "",
      cityCode: "",
      districtCode: "",
      logoData: "",
      intro: "",
      route: "",
      status: 0,
    },
  });

  // 获取路由参数
  const params = useParams();

  // 初始化获取医院详情数据显示
  useEffect(() => {
    const getHospitalShow = async () => {
      const res = await reqGetHospitalShow(params.id as string);
      setHospitalShow(res);
    };
    getHospitalShow();
  }, []);

  // 跳转函数
  const navigate = useNavigate()

  return (
    <Card>
      <Descriptions title="基本信息" bordered column={2}>
        <Descriptions.Item label="医院名称" labelStyle={{width: 150}}>
          {hospitalShow.hospital.hosname}
        </Descriptions.Item>
        <Descriptions.Item label="医院LOGO" labelStyle={{width: 150}}>
          <img
              className="hospital-logo"
              src={"data:image/jpeg;base64," + hospitalShow.hospital.logoData}
              alt="logo"
            />
        </Descriptions.Item>
        <Descriptions.Item label="医院编号">
          {hospitalShow.hospital.hoscode}
        </Descriptions.Item>
        <Descriptions.Item label="医院地址">
          {hospitalShow.hospital.param.fullAddress}
        </Descriptions.Item>
        <Descriptions.Item label="坐车路线" span={2}>
          {hospitalShow.hospital.route}
        </Descriptions.Item>
        <Descriptions.Item label="医院简介" span={2}>
          {hospitalShow.hospital.intro}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="预约规则信息" bordered style={{marginTop: 20}} column={2}>
        <Descriptions.Item label="预约周期" labelStyle={{width: 150}}>
          {hospitalShow.bookingRule.cycle}天
        </Descriptions.Item>
        <Descriptions.Item label="放号时间" labelStyle={{width: 150}}>
          {hospitalShow.bookingRule.releaseTime}
        </Descriptions.Item>
        <Descriptions.Item label="停挂时间">
          {hospitalShow.bookingRule.stopTime}
        </Descriptions.Item>
        <Descriptions.Item label="退号时间">
          {hospitalShow.bookingRule.quitTime}
        </Descriptions.Item>

        <Descriptions.Item label="预约规则" span={2}>
          {hospitalShow.bookingRule.rule.map((rule, index) => {
            return (
              <div key={index}>
                {index + 1}. {rule}
              </div>
            );
          })}
        </Descriptions.Item>
      </Descriptions>

      <Button className="mt" onClick={() => navigate('/syt/hospital/hospitallist', {replace: true})}>返回</Button>
    </Card>
  )
}

export default HospitalShow;