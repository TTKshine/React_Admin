import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
const Item = Form.Item
export default class AuthForm extends Component {
    constructor(props) {
        super(props)
        // 根据传入角色的menus显示权限
        const {menus} = this.props.role
        this.state = {
            checkedKeys:menus,
        }  
    }
    static propTypes = {
        role: PropTypes.object
    }
    // 为父组件提供获取Menus的方法
    getMenus = () =>{
         return this.state.checkedKeys
    }
    // 选中某个节点时的回调
    onCheck = (checkedKeys, info) => {
        //console.log('onCheck', checkedKeys);
        this.setState({checkedKeys})
      };

    //   根据新传入的role来更新checkKeys状态，当组件接收到新的属性时自动调用,在render之前
    UNSAFE_componentWillReceiveProps(nextProps){
       const menus = nextProps.role.menus
       this.setState({checkedKeys:menus})
    }
    render() {
        console.log('auth-form render')
        const { role } = this.props
        const {checkedKeys} = this.state
        const formItemLayout = {
            labelCol: { span: 4 },//左侧lavel的宽度
            wrapperCol: { span: 15 }  //右侧包裹的宽度
        }
        return (
            <div >
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled></Input>
                </Item>
                <Tree
                    checkable
                    treeData={menuList}
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck = {this.onCheck}
                />
            </div>
        )
    }
}
