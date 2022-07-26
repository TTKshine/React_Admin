import React, { Component,createRef } from 'react'
import propTypes from 'prop-types'
import { Form, Input } from 'antd'
// 更新分类的form组件
const Item = Form.Item
export default class UpdateForm extends Component {
    formRef = createRef()  //创建一个ref对象
    static propTypes = {   //prototypes主要是对props中的数据类型进行检测和限制
        categoryName: propTypes.string.isRequired,
        setForm: propTypes.func.isRequired
    }
    componentDidMount() {
        // 将value通过setForm传递给父组件
       this.props.setForm(this.formRef.current);
    }
    render() {
        const { categoryName } = this.props
        return (
            <Form ref={this.formRef}>
                <Item name='categoryName'
                    initialValue={categoryName}
                    rules={[
                        {
                          required: true,
                          message: '分类名称必须输入',
                        },
                      ]}
                  >
                    <Input placeholder='请输入分类名称'></Input>
                </Item>
            </Form>
        )
    }
}
