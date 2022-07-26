/*
    进行local数据存储管理的模块
    使用localStorage存在兼容性问题
    因此引入store库
    作用：(1)兼容低版本浏览器
    (2)更加简洁
*/
import store from 'store'
const USER_KEY = 'user_key'
const Storage = {
    // 保存user
    saveUser(user){
       // localStorage.setItem(USER_KEY,JSON.stringify(user))
       store.set(USER_KEY,user)
    },

    // 读取user
    getUser(){
        //return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY)|| {}
    },

    // 删除user
    removeUser(){
        //localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}

export default Storage