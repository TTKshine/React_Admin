import React, { Component } from 'react'
import { Card, Table, Button, Space, message, Modal } from 'antd'
import { PlusOutlined,ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../components/left-nav/link-button'
import { reqCategorys,reqAddCategory,reqUpdateCategory } from '../../api/index'
import AddForm from './add_form'
import UpdateForm from './update-form';
// 商品分类
export default class Category extends Component {
  state = {
    loading: false, //是否正在获取数据中
    categorys: [],//一级分类列表
    subCategorys:[],  //二级分类列表
    parentId:'0',  //当前需要显示的分类列表的父分类Id
    parentName:'',  //当前需要显示的分类列表的父分类名称
    showStatus: 0, //标识添加/更新的确认框是否显示，0：都不显示，1：显示添加 ，2：显示更新
  }
  // 初始化Table列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',  //指定数据对应的名字
      },
      {
        title: '操作',  //返回需要显示的界面标签
        width: 300,
        render: (category) => 
            <span>
              <Button type='link' onClick ={()=>{this.showUpdate(category)}}>修改分类</Button>
              {/* 如何向事件回调函数传递参数，先定义一个匿名函数，在函数中调用处理的函数，并传入数据 */}
              {this.state.parentId === '0' ?  <Button type='link' onClick={()=>{this.showSubCategorys(category)}}>查看子分类</Button>:null}
             
            </span>
      }
    ];
  }

  // 异步获取一级/二级分类列表显示
  // parentId 如果没有指定根据状态中的oarentId，如果指定了根据指定的请求
  getCategorys = async (parentId) => {
    // 在发送请求前，显示loading 
    this.setState({ loading: true })
    parentId = parentId || this.state.parentId
    // 发异步请求，获取数据
    const result = await reqCategorys(parentId)  //返回Promise对象

    // 请求完成后，隐藏loading
    this.setState({ loading: false })
    if (result.status === 0) {   //请求成功
      // 取出分类数组(可能是一级的，也可能是二级的)
      const categorys = result.data;
      if(parentId ==='0'){
        this.setState(categorys)
      }else{
        this.setState({subCategorys:categorys})
      }
      // 更新状态
    } else {
      message.error('获取分类列表失败')
    }
  }

  // 显示指定一级分给对象的二级子列表

  showSubCategorys = (category)=>{
    // 更新状态,setState是异步更新状态
    // setState()不能立即获取最新的状态
    this.setState({
      parentId:category._id,
      parentName:category.name,
    },()=>{  //在状态更新且render后执行

     // 获取二级分类列表显示
     this.getCategorys()
    })
  }
  // 显示一级分类列表
  showCategorys = ()=>{
  // 更新为显示一级列表的状态
    this.setState({
      parentId:'0',
      parentName:'',
      subCategorys:[]})
  }

  // 响应点击取消，隐藏确定框
  handleCancle=()=>{
    this.setState({showStatus:0})
  }

    // 显示添加：显示添加的确认框
   showAdd =()=>{
        this.setState({showStatus:1})
    }
  // 添加分类
  addCategory = async()=>{
   this.form.validateFields()
   .then(async (values)=>{
      // 隐藏确认框
      this.setState({showStatus:0})
      // 收集数据并提交添加分类的请求
      const {parentId,categoryName} = values
      const result = await reqAddCategory(categoryName,parentId)
      if(result.status===0){
            // 重新获取分类列表显示，添加的分类就是当前分类列表下的分类
            if(parentId === this.state.parentId){
              this.getCategorys()
            }else if(parentId==='0'){  //说明在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示一列表
                this.getCategorys('0')
            }
          
      }
   })
   .catch((err)=>{
    message.info('请输入分类名称')
   })

   
  }
// 显示修改/更新的确认框
  showUpdate = (category) =>{
    // 保存分类对象,方便在render中使用
    this.catagory = category
   // 更新状态
    this.setState({showStatus:2})

  }
  // 更新分来
  updateCategory = ()=>{
    // 先要进行表单验证
    this.form.validateFields()
    .then(async (values)=>{
      // 1.隐藏对话框
      this.setState({showStatus:0})
      // 2 发请求更新
      const categoryId = this.catagory._id
      const {categoryName} = values
      const result = await reqUpdateCategory({categoryId,categoryName})
      if(result.status===0){
          // 3.重新显示列表
          this.getCategorys()
      }
    })
    .catch((err)=>{
      message.info('请输入分类名称')
    })
    
  }

  //  为第一次render()准备数据
  componentWillMount() {
    this.initColumns()
  }
  // 发异步ajax请求，执行异步任务，获取分类列表
  componentDidMount() {
    // 获取一级分类列表显示
    this.getCategorys()
  }
  render() {
    // 读取状态数据
    const { categorys, subCategorys,parentId,parentName,loading,showStatus } = this.state
    // 读取指定的分类
    const category = this.category || {}  //如果还没有，则指定一个空对象,为了确保在初次render时能够正常显示
    const title = parentId === '0'? '一级分类列表':(
      <span>
          <LinkButton onClick={this.showCategorys}>'一级分类列表'</LinkButton>
          <ArrowRightOutlined  style={{marginRight:5}}/>
          <span>{parentName}</span>
      </span>
    )
    // Card的右侧
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Space>
          <PlusOutlined />
        </Space>
        添加
      </Button>
    )

    /*
        const dataSource = [
          {
            "parentId": '0',
            "_id": '5ca9d6e9b49ef916541160bd',
            "name": '服装',
            "__v": 0
          },
          {
            "parentId": '0',
            "_id": '5ca9d70cb49ef916541160be',
            "name": '食品',
            "__v": 0
          },
          {
            "parentId": '0',
            "_id": '5ca9d70cb49ef916541160be',
            "name": '玩具',
            "__v": 0
          },
        ];
    */
    return (
      // Card左侧
      <Card
        title={title}
        extra={extra}
      >
        <Table
          bordered  //设置表格边框
          rowKey='__id'
          loading={loading}
          dataSource={parentId ==='0' ? categorys:subCategorys}
          columns={this.columns}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}  //设置每行跳数和快速固定到某也
        />

        <Modal
          title='添加分类'
          visible={showStatus === 1}  //代表是否显示对话框
          onOk={this.addCategory}
          onCancel={this.handleCancle}
        >
          {/* <p>添加的界面</p> */}
           <AddForm 
           categorys={categorys} 
           parentId={parentId}  
           setForm = {(form)=>{this.form = form} }/> 
        </Modal>
        <Modal
          title='更新分类'
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancle}
        >
             {/* <p>更新的界面</p> */}
           <UpdateForm  
               categoryName={ category.name} 
               setForm = {(form)=>{this.form = form}}
            />  {/*//弹出的修改的对话框*/}
        </Modal>
      </Card>
    )
  }
}
