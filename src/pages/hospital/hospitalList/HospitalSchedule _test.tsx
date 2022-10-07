import { useState } from "react";

function HospitalSchedule() {
  console.log('HospitalSchedule')
  const [msg, setMsg] = useState('abc')

  const handleClick = () => {
    setMsg(msg + '-') 
    // 调用状态数据的set方法更新状态数据后, 立即读取状态数据变量值?  旧的, 不是新的
    // 原因: set方法是更新内部管理状态数据, 内部数据确实更新了, 但组件中的对应的变量数据还没有变
    // 问题: 什么时候才会是新的?  只有组件函数再次执行时, 执行useState时才会取到新的数据
    console.log(msg) // ?
  }

  return (
    <div>
      <h2>msg: {msg}</h2>
      <button onClick={handleClick}>更新msg</button>
    </div>
  );
}

export default HospitalSchedule;

// 问题: 点击按钮输出什么?