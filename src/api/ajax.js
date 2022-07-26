// 能发送异步ajax请求的函数模块,封装axios库,且函数的返回值是Promise对象

// 优化目标1：统一处理请求异常
// 解决方法：在外层包一个自己创建的promise对象，在请求出错时，不reject()，而是显示错误提示

/*
  优化目标2：异步得到的不是response，而是response.data
  在请求成功resolve时，resolve(response.data)
*/
import axios from 'axios'
import {message} from 'antd'

// 对data和type设置默认值  通用ajax请求
export default function ajax(url,data={},type='GET'){
    let promise;

    // 执行器函数
    return new Promise((resolve,reject)=>{
        // 1.执行异步ajax请求
        if(type==='GET'){
            // 发送GET请求
             promise=axios.get(url,{ //配置对象
                params:data  //指定请求参数
            })
        }else{
            // 发送POST请求
            promise=axios.post(url,data)
        }
        // 2.如果成功了，调用resolve(value)
        promise.then((response=>{
            resolve(response.data);
        // 3.如果失败了，不调用reject(reason)，因为一旦调用，就会进入try...catch中
        })).catch(error=>{
            message.error('请求出错了'+error.message);
        })
     

        
    })
}

// 请求登录接口
/*ajax('/login',{username:'Tom',password:'123'},'POST').then()*/
// 添加用户
//ajax('/manage/user/add',{username:'Tom',password:'123',phone:'13702020865'},'POST').then()