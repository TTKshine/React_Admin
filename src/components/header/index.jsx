import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Button } from 'antd';
import menuList from '../../config/menuConfig'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import Storage from '../../utils/storageUtils'
import { reqWeather } from '../../api'
import './index.less'
const { confirm } = Modal;
class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()), //当前时间字符串
    city: '',//查询城市
    weather: '',//文本
  }

  getTime = () => {
    // 每隔1s获取当前时间，并更新状态数据
    this.timer = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({ currentTime })
    }, 1000)
  }
  getWeather = async () => {
    // 调用天气接口请求异步获取数据
    const { city, weather } = await reqWeather(110000) //该函数返回promise对象
    // 更新状态
    this.setState({ city, weather })
  }

  // 获取标题

  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname;
    let title
    menuList.forEach(item => {
      if (item.key === path) {  //如果当前item对象的key与path一样，item的title 就是需要显示的title
        title = item.title;
      } else if (item.items) {  //该方法只适合二级菜单
        // 在所有的子item中查找匹配的
        const cItem = item.items.find(cItem =>path.indexOf(cItem.key)===0)
        // 如果有值才说明有匹配的
        if (cItem) {
          // 取出title
          title = cItem.title
        }
      }
    })
    return title;
  }
  // 用来退出登录
  logout = () => {
    // 显示确认框
    confirm({
      // title: 'Do you Want to delete these items?',
      // icon: <ExclamationCircleOutlined />,
      content: '确定退出吗？',
      //  改成箭头函数后，里面的this就是外部的this
      onOk: () => {
        // 删除保存的用户数据
        Storage.removeUser()
        memoryUtils.user = {}
        // 跳转到登录界面
        this.props.history.replace('/login')
      },
      // onCancel() {
      //   console.log('Cancel');
      // },
    });
  }
  // 不能采用这种方式，这种在更新页面时标题不会改变

    // componentWillMount(){
    //   this.title = this.getTitle()
    // }
  // 在第一次render之后执行一次，一般在此执行异步操作。例如发送ajax请求/启动定时器
  componentDidMount() {
    // 获取当前的时间
    this.getTime()
    // 获取当前天气
    this.getWeather()
  }
  // 当前组件卸载前生效
  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.timer)
  }
  render() {
    const { currentTime, city, weather } = this.state;
    const username = memoryUtils.user.username;
    // 得到当前需要显示的title
    const title = this.getTitle();
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎, {username}</span>
          {/* <LinkButton onClick={this.logout}>退出</LinkButton> */}
          <Button type="link" onClick={this.logout}>退出</Button>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
           {title}
          </div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <span>{city}</span>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}


export default withRouter(Header)