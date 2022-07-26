import React,{createRef, Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'
// 添加分类的form组件
const Item = Form.Item
const Option = Select.Option
export default class AddForm extends Component {
    // constructor(props){
    //     super(props);
    //     this.formRef = createRef()
    // }
    formRef = createRef()  //创建一个ref对象
    static propTypes = {
        setForm:PropTypes.func.isRequired,  //用来传递form对象的函数
        categorys: PropTypes.array.isRequired, //确保输入的一级列表是个数组
        parentId: PropTypes.string.isRequired  //父分类的id
    }
    componentWillMount(){
        this.props.setForm(this.formRef.current)
    }
    
    render() {
        const { categorys, parentId } = this.props
        return (
            <Form ref={this.formRef} initialValues={{parentId}}>
                <Item name='parentId' >
                    <Select>
                        <Option value="0"> 一级分类 </Option>
                        {
                            categorys.map(item => <option value={item._id}>item.name</option>)
                        }
                    </Select>
                </Item>
                <Item name='categoryName'
                    initialValue={''}
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
