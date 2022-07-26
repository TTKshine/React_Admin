import React, { Component } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message} from 'antd';
import {withRouter,Redirect} from 'react-router-dom'
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import Storage from '../../utils/storageUtils'




// 登录的路由组件
/*
实现的功能：
(1)登录静态组件
(2)前台表单验证
(3)收集表单输入数据
*/
class Login extends Component {

    //获取输入的用户名和密码，即收集表单数据,实现点击登录时的统一校验
     onFinish = async (values) => {
        const { username, password } = values;
        // console.log('输入的用户名为'+username,'输入的密码为'+ password);
        // console.log('提交登录的ajax请求',values);
        // 请求登录 
        /*
        reqLogin(username,password).then(response=>{
            console.log('成功了',response.data)
        }).catch(error =>{
            console.log('失败了',error)
        })*/
        // 利用async和await优化
        /*
        try{
            const response = await reqLogin(username,password);
            console.log('请求成功',response.data)
        }catch(error){
           console.log('请求出错啦',error)
        }*/
        // 统一处理错误请求
        const result = await reqLogin(username,password);
        //{status:0,user}  {status：1,msg}
        if(result.status===0){ //登陆成功
            // 提示登陆成功
            message.success('登录成功')
            // 跳转到管理界面(不需要再回退回到登录界面)，保存User
            const user = result.data
            memoryUtils.user = user  //保存在内存中
          //  console.log(memoryUtils.user)
            Storage.saveUser(user)  //保存到local中
          //  this.props.history.replaceState('/')
            this.props.history.replace('/')
            
        }else{  //登陆失败
            // 提示错误信息
            message.error(result.msg)
        }
       // console.log('请求成功',result)
    };


    render() {
        // 判断用户是否登录，如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to = '/'/>
        }
        return (
            <div className='login'>
                <header className='login-header'>
                    {/* 标签里面不支持引用相对路径 */}
                    <img src={logo} alt="logo/" />
                    <h1>React项目:后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onFinish={this.onFinish} className='login-form'>
                        <Form.Item
                            name="username"
                            // 配置对象：属性名是特定的一些名称
                            // 写校验规则:声明式验证(直接使用别人定义好的验证规则进行验证)
                            rules={[
                                // 必须输入，如果没有输入则提示
                                { required: true, whitespace: true, message: '请输入您的用户名' },
                                { min: 4, message: '用户名至少4位' },
                                { max: 12, message: '用户名不超过12位' },
                                // +表示字符在对象中连续出现一次或者多次
                                { pattern: /^[a-zA-z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成！' }
                            ]}
                           // initialValue='admin'  //设置显示的初始值
                        >
                            <Input
                                // prefix是	带有前缀图标的 input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="用户名"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!value) {
                                            return Promise.reject(new Error('密码必须输入'))
                                        } else if (value.length < 4) {
                                            return Promise.reject(new Error('密码长度不能小于4位'))
                                        } else if (value.length > 12) {
                                            return Promise.reject(new Error('密码长度不能大于12位'))
                                        } else if (!(/^[a-zA-z0-9_]+$/.test(value))) {
                                            return Promise.reject(new Error('密码必须由数字、字母或下划线组成'))
                                        } else {
                                            return Promise.resolve('验证通过');
                                        }
                                    }
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className='login-form-button'>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }

}
export default withRouter(Login)

/*
    async和await
    1.作用：
        简化Promise对象的使用：不再使用then()来指定失败/成功的回调函数
        以同步编码方(没有回调函数了)式实现异步流程
    2.哪里写await
        在返回promise的表达式左侧写await：不想要Promise，想要promise异步执行的成功的value的数据
    3.哪里写async?
        await所在函数(最近的)定义的左侧写async

*/