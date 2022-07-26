import { Menu } from 'antd';
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'
import SubMenu from 'antd/lib/menu/SubMenu';
import memoryUtils from '../../utils/memoryUtils'
// 左侧导航的组件


// const items = [
//   <Link to='./home'>
//     getItem('首页', '/home', <PieChartOutlined />)
//   </Link>,

//   getItem('商品', 'sub1', <MailOutlined />, [
//     <Link to='/category'>
//       getItem('品类管理', '/category',<DesktopOutlined />)
//     </Link>,
//     <Link to='/product'>
//       getItem('商品管理', '/product',<ContainerOutlined />)
//     </Link>
//   ]),
//   <Link to='/user'>
//     getItem('用户管理', '/user', <DesktopOutlined />)
//   </Link>,
//   <Link to='/role'>
//     getItem('角色管理', '/role', <ContainerOutlined />)
//   </Link>,
//   getItem('图形图表', 'sub2', <AppstoreOutlined />, [
//     <Link to='/charts/bar'>
//       getItem('柱形图', '/charts/bar')
//     </Link>,
//     <Link to='/charts/line'>
//       getItem('折线图', '/charts/line'),
//     </Link>,
//     <Link to='/charts/pie'>
//       getItem('饼图', '/charts/pie'),
//     </Link>
//   ]),
// ];

 class LeftNav extends Component {

  // 判断当前登录用户对item是否有权限，返回值为布尔类型
  hasAuth = (item)=>{
    const key  = item.key
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    // 如果当前用户时admin
    // 当前用户有此item的权限，即key在menus中
    // 如果当前item是公开的
    if(username==='admin' || item.isPublic ===true || menus.indexOf(key) !==-1){
      return true
    }else if(item.children){
      // 如果当前用户有此item的某个子item的权限 
      // find函数返回的不是布尔值，因此需要进行类型转换
      return !!item.children.find(child =>menus.indexOf(child.key)!==-1)
        
    }
    return false
      
  }

  // 根据menu的数据数组生成对应的标签数组
  // 使用map+递归调用

  getItems_map = (menuList) => {
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }
      else {
        return (
          <SubMenu key={item.key} title={
            <span>
              {item.icon}
              <span>{item.title}</span>
            </span>
          }>
            {/* 递归调用，找出子菜单组件 */}
            {this.getItems(item.children)}
          </SubMenu>
        )
      }
    })
  }

  // 根据menu的数据数组生成对应的标签数组
  // 使用reduce+递归调用
  getItems = (menuList) => {
     // 得到当前请求的路由路径，只有路由组件中才会有location
    const path =this.props.location.pathname;
    return menuList.reduce((pre, item) => {
      // 如果当前用户有item对应的权限，才需要显示对应的菜单项
      if(this.hasAuth(item)){
          // 向pre中添加<Menu.Item>
      if (!item.children) {
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      } else {
        // 查找一个与当前请求路径匹配的子Item
        const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
        // 如果存在，说明当前item的子列表需要打开
        if(cItem){
          this.openkey = item.key;
        }
        
        // 向pre中添加<subMenu>
        pre.push((
          <SubMenu key={item.key} title={
            <span>
              {item.icon}
              <span>{item.title}</span>
            </span>
          }>
            {/* 递归调用，找出子菜单组件 */}
            {this.getItems(item.children)}
          </SubMenu>
        ))
      }
      }
    
      return pre
    }, [])
  }
  // 在第一次render之前使用，为第一个render()准备数据(同步的)
UNSAFE_componentWillMount(){
  this.menuitems=this.getItems(menuList)
}
  render() {
    // 得到当前请求的路由路径，只有路由组件中才会有location
    let path =this.props.location.pathname;
    if(path.indexOf('/product')===0){
      // 说明当前请求的是商品或其子路由界面
      path='/product'
    }
    // 得到需要打开菜单项的
    const openkey = this.openkey
    return (
      <div>
        <div className='left-nav'>
          <Link to='/' className='left-nav-header'>
            <img src={logo} alt="" />
            <h1>硅谷后台</h1>
          </Link>
        </div>
        <Menu
          defaultSelectedKeys={[path]}   //用来设置默认选中,一次刷新只能修改一次
          defaultOpenKeys={[openkey]}
          mode="inline"
          theme="dark"
        >
          {/* 获取菜单节点 */}
          { this.menuitems }
        </Menu>
      </div>
    )
  }
}

/*
 withRouter高阶组件
 包装非路由组件，返回一个新的组件
 新的组件会向非路由组件传递3个属性：history/location/match
*/

export default withRouter(LeftNav)