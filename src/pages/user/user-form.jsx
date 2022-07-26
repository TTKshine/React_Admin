import React, { createRef, Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'
// 添加/修改用户的form组件
const Item = Form.Item
const Option = Select.Option
export default class UserForm extends Component {
    constructor(props) {
        super(props);
        this.formRef = createRef()  //创建一个ref对象
    }
    static propTypes = {
        setForm: PropTypes.func.isRequired,  //用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired
    }
    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }

    render() {
        const { roles,user } = this.props
        const formItemLayout = {
            labelCol: { span: 4 }, //左侧Label的宽度
            wrapperCol: { span: 15 }  //右侧包裹的宽度
        }
        return (
            <Form ref={this.formRef} initialValues=''  {...formItemLayout}>
                <Item name='username'
                    label='用户名'
                    initialValue={user.username}
                >
                    <Input placeholder='请输入用户名'></Input>
                </Item>
                {
                    user._id ? null : (
                        <Item name='password'
                            label='密码'
                            initialValue={user.password}
                        >
                            <Input type="password" placeholder='请输入密码'></Input>
                        </Item>
                    )
                }
                <Item name='phone'
                    label='手机号'
                    initialValue={user.phone}
                >
                    <Input placeholder='请输入手机号'></Input>
                </Item>
                <Item name='email'
                    label='邮箱'
                    initialValue={user.email}
                >
                    <Input placeholder='请输入邮箱'></Input>
                </Item>
                <Item name='role_id'
                    label='角色'
                    initialValue={user.role_id}
                >
                    <Select placeholder="请选择对应角色" >
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}
