import React, { Component } from 'react'
import { Card, Button, Table, Modal, message, } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole,reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
import StorageUtils from '../../utils/storageUtils'
// 角色管理路由
export default class Role extends Component {
  constructor (props){
    super(props)
    this.myref = React.createRef()
  }
  state = {
    roles: [], //所有角色的列表
    role: {}, //选中的role
    isShowAdd: false,//是否显示添加角色的确认 
    isShowAuth:false, //是否显示设置权限界面
  }
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',  //列数据在数据项中对应的路径，支持通过数组查询嵌套路径
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',  //列数据在数据项中对应的路径，支持通过数组查询嵌套路径
        render : (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',  //列数据在数据项中对应的路径，支持通过数组查询嵌套路径
        render:formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',  //列数据在数据项中对应的路径，支持通过数组查询嵌套路径
      }
    ]
  }

  //点击某一行，将该行信息存储到role中,目前无法选中某一行，只能全选
  onRow = (role) => {
    return {
      onClick: event => {    
        this.setState({role});
    //    console.log(role._id)
      }
    }
  }
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }
  // // 添加角色
  addRole = () => {
    // console.log(this.form)
    this.form.validateFields()
      .then(async values => {
        // 进行表单验证，只有通过了才向下处理
        // 隐藏确认框
        this.setState({ isShowAdd: false })
        // 收集输入的数据
        const { roleName } = values
        this.form.resetFields()
        // 请求添加
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
          // 根据结果显示
          message.success('添加角色成功')
          //  新产生的角色
          const role = result.data
          // // 更新roles
          //const roles = [...this.state.roles]
          // roles.push(role)
          // this.setState({roles})
          // 更新roles状态，基于原本的状态数据进行更新
          this.setState(state => ({
            roles: [...state.roles, role]
          }))
        }
      })
      .catch(errorInfo => {
        message.error('添加角色失败')
      })
  }

  // 更新角色权限的回调
  updateRole = async() =>{
    const role = this.state.role
    // 得到最新的menus
    const menus = this.myref.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name=  memoryUtils.user.username
    // 请求更新
    const result  = await reqUpdateRole(role)
    if(result.status===0){
        message.success('设置角色权限成功')
        // 关闭对话框
        this.setState({isShowAuth:false})
        // 如果当前更新的是自己角色的权限，则需要强制退出
        if(role._id ===memoryUtils.user.role._id){
          memoryUtils.user ={}
          StorageUtils.removeUser()
          this.props.history.replace('/login')
          message.success('当前用户角色权限更新成功，请重新登录')
        }else{
             // 更新显示
       // this.getRoles()
      //  此处类似于浅拷贝，因此可以直接用
           this.setState({roles:[...this.state.roles]})
        }
       
    }

  }
  componentWillMount() {
    this.initColumn()
  }
  componentDidMount() {
    this.getRoles()
   // console.log('role', this.state.role._id)
  }
  render() {
    const { roles, role, isShowAdd,isShowAuth} = this.state
    const title = (
      <span>
        <Button type='primary' onClick={() => { this.setState({ isShowAdd: true }) }}>创建角色</Button> &nbsp;&nbsp;
        <Button type='primary' disabled={!role._id} onClick={() => { this.setState({ isShowAuth: true }) }}>设置角色权限</Button>
      </span>
    )
    // const onSelectChange = (newSelectedRowKeys) => {
    //   console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    //   this.setState({selectedRowKeys:newSelectedRowKeys});
    // }
    // const rowSelection = {
    //   type: 'radio',
    //   selectedRowKeys: [role._id], //选中某一行的数组
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log('selectedRows: ', selectedRows[0]._id);
    //     this.setState({selectedRowKeys: [...selectedRowKeys, selectedRows[0]._id] })
    //     console.log(selectedRowKeys)
    //   },
    // };
    return (
      <Card title={title} >
        <Table
          bordered
          rowKey='_id'  //角色id
          dataSource={roles}  //数据数组
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}  //分页器
          rowSelection={{type:'radio',
          selectedRowKeys:[role._id],
          onSelect:(role)=>{
            // 选择某个radio时的回调
            this.setState({
              role
            })
          }
        }}
          onRow={this.onRow}
        >
        </Table>
        <Modal
          title='添加角色'
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => { this.setState({ isShowAdd: false }) }}
        >
          <AddForm
            setForm={(form) => { this.form = form }}
          />
        </Modal>
        <Modal
          title='设置角色权限'
          visible={isShowAuth}
          // destroyOnClose
          onOk={this.updateRole}
          onCancel={() => { this.setState({ isShowAuth: false }) }}
        >
          <AuthForm ref = {this.myref} role={role}/>
        </Modal>
      </Card>
    )
  }
}
