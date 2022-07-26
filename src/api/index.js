// 要求：能根据接口文档定义接口请求
//包含应用中所有接口请求函数的模块
// 每个函数的返回值都是promise

// 基本要求，能根据接口文档定义接口请求函数
import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'
const BASE = ''

//登录接口
/*
export function reqLogin(username,password){
    return ajax('/login',{username,password},'POST')
}
*/
// 登录接口
export const reqLogin = (username,password)=>ajax(BASE+'/login',{username,password},'POST')
// 添加用户
export const reqAddUser = (user)=> ajax(BASE+'/manage/user/add',user,'POST')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId)=> ajax (BASE+'/manage/category/list',{parentId},'GET')
// 添加分类
export const reqAddCategory = (categoryName,parentId)=> ajax (BASE+'/manage/category/add',{categoryName,parentId},'POST')
// 更新分类
export const reqUpdateCategory = ({categoryId,categoryName})=> ajax (BASE+'/manage/category/update',{categoryId,categoryName},'POST')

// 获取商品分页列表
export const reqProducts = (pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize})

// 搜索商品分页列表
// searchType：搜索的类型 按照商品名搜索(productName)/按照商品描述搜索(productDesc)
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=>ajax(BASE+'/manage/product/search',{pageNum,pageSize,[searchType]:searchName})

// 获取一个分类
export const reqCategory = (categoryId) => ajax (BASE+'/manage/category/info',{categoryId})


// 更新商品的状态，进行上架/下架操作
 export const reqUpdateStatus = (productId,status1)=> ajax(BASE+'/manage/product/updateStatus',{productId,status1},'POST')
//  删除指定上传的图片
export const reqDeleteImg = (name) =>ajax(BASE+'/manage/img/delete',{name},'POST')
// 添加/修改商品
export const reqAddOrUpdateProduct = (product) =>ajax(BASE+'/manage/product/'+ (product._id ? 'update':'add'),{product},'POST')
// 修改商品
//export const reqUpdateProduct = (product) =>ajax(BASE+'/manage/product/update',{product},'POST')

// 获取所有角色的列表
export const reqRoles = () => ajax(BASE+'/manage/role/list') 
// 添加角色
export const reqAddRole = (roleName)=> ajax(BASE+'/manage/role/add',{roleName},'POST')

// 更新角色
export const reqUpdateRole =(role) =>ajax(BASE+'/manage/role/update',role,'POST')

// 获取所有用户的列表
export const reqUsers = () => ajax(BASE+'/manage/user/list')

// 请求删除指定用户
export const reqDeleteUser = (userId) =>ajax(BASE+'/manage/user/delete',{userId},'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/'+(user._id ? 'update':'add'),user,'POST')

// 

 // jsonp请求的接口请求函数,获取天气信息
export const reqWeather = (city)=>{
    return new Promise((resolve,reject)=>{
        const url=`https://restapi.amap.com/v3/weather/weatherInfo?key=4b68ec0c2273735bad8ef838dcf2c688&city=${city}&extensions=base&output=JSON`
        jsonp(url,{},(err,data)=>{
            if(!err&&data.status==='1'){
                // 如果成功
                const {city,weather} = data.lives[0]
                resolve({city,weather})
            }else{
                message.err('获取天气信息失败')
            }
        })
    })
}
//reqWeather(110000)