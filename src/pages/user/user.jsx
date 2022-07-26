import React, { PureComponent } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'
import { reqDeleteUser, reqUsers,reqAddOrUpdateUser} from '../../api/index'
import UserForm from './user-form'
const { confirm } = Modal
// 用户管理路由
export default class User extends PureComponent {
  state = {
    users: [],   //所有用户列表
    roles: [], //所有角色的列表
    isShow: false,  //标识是否显示确认框
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <Button type='link' onClick= {() => this.showUpdate(user)}>修改</Button>
            <Button type='link' onClick={() => this.deleteUser(user)} >删除</Button>
          </span>
        )
      },
    ]
  }
  // 根据role的数组，生成包含所有角色名的对象(属性名用角色id值，属性值为角色名字)
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      // // 初始值为空对象，然后对空对象累加
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存上述数组
    this.roleNames = roleNames
   // console.log(this.roleNames)
  }
 

  获取用户信息
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const { users, roles } = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  // 显示修改界面
  showUpdate = (user) =>{
    // 保存user，一是为了能够表明该操作为修改用户信息(因为有user信息，所有不可能是添加)
    this.user  = user
    this.setState({
        isShow:true
    })
  }
  // 显示添加界面
  showAdd = ()=>{
    this.user = null  //去除前面保存的this.user
    this.setState({isShow:true})
  }
  // 删除指定用户
  deleteUser = (user) => {
    confirm({
      title: `确认删除${user.username}吗？`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功！')
          this.getUsers()
        }
      },
    });
  };
  //  添加/更新用户

  addOrUpdateUser = async() => {
    // 关闭添加的对话框
    this.setState({isShow:false})
    // 1. 收集输入的数据
    const user = this.form.getFieldValue()
    this.form.resetFields()  //清除列表内容
    // 如果是更新，需要给user指定_id属性
    if(this.user ){
        user._id = this.user._id
    }
    // 2. 提交添加的请求
    const result = await reqAddOrUpdateUser(user)
    if(result.status===0){
      // 更新列表显示
      message.success(`${this.user ? '修改':'添加'}用户成功`)
      this.getUsers()
    }
  }
  UNSAFE_componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getUsers()
  }


  render() {
    const { users, isShow ,roles} = this.state
    const user = this.user || {}
    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
    return (
      <Card title={title}>
        <Table
          bordered  //设置表格边框
          rowKey='__id'
          dataSource={users}  //显示用户的数组
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}  //设置每行跳数和快速固定到某也
        />

        <Modal
          title={user._id ? '修改用户':'添加用户'}
          visible={isShow}  //代表是否显示对话框
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields()
            this.setState({ isShow: false })
          }}
        >
          <UserForm setForm = {form => this.form = form} roles={roles} user={user}/>
        </Modal>
      </Card>
    )
  }
}