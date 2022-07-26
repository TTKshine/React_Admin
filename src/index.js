// 入口js
import React from 'react'
import ReactDOM from 'react-dom'  //用来渲染组件
import 'antd/dist/antd.less'
// 引入自定义组件需要写路径
import App from "./App"
import Storage from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
// 读取local中保存的user,保存到内存中,因为从内存中读取效率更高
let user = Storage.getUser()
memoryUtils.user = user
// 将APP组件标签渲染到index页面中
ReactDOM.render(<App/>,document.getElementById('root'))