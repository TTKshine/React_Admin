import React, { createRef, Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
// 添加分类的form组件
const Item = Form.Item
export default class AddForm extends Component {
    constructor(props) {
        super(props);
        this.formRef = createRef()  //创建一个ref对象
    }
    static propTypes = {
        setForm: PropTypes.func.isRequired,  //用来传递form对象的函数
        categorys: PropTypes.array.isRequired, //确保输入的一级列表是个数组
        parentId: PropTypes.string.isRequired  //父分类的id
    }
    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }

    render() {
        const formItemLayout = {
            labelCol:{span:4}, //左侧Label的宽度
            wrapperCol:{span:15}  //右侧包裹的宽度
        }
        return (
            <Form ref={this.formRef} initialValues=''>
                <Item name='roleName'
                    label='角色名称'
                    {...formItemLayout}
                    initialValue={''}
                    rules={[
                        {
                            required: true,
                            message: '角色名称必须输入',
                        },
                    ]}
                >
                    <Input placeholder='请输入角色名称'></Input>
                </Item>
            </Form>
        )
    }
}
