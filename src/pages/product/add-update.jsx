import React, { Component } from 'react'

import { Card, Form, Input, InputNumber, Cascader, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/left-nav/link-button'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'
import PictureWall from './picture-wall'
import RichTextEditor from './rich-text-editor'
// product的子路由组件，用于产品的添加和工薪
const { Item } = Form
const { TextArea } = Input
export default class ProductAddUpdate extends Component {

  state = {
    options: []
  }
  //创建ref对象
  constructor(props) {
    super(props)
    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  // 获得一级/二级分类列表，并显示
  // async 函数的返回值是一个新的promise对象，promise的结果和值由async的结果决定
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      //  如果是一级分类列表
      if (parentId === '0') {
        this.initOptions(categorys)
      } else {
        // 二级列表
        return categorys  //返回二级列表 ==》当前async 返回的promise就会成功，且value为categorys
      }

    }
  }
  initOptions = async (categorys) => {
    // 根据vategorys生成options数组
    const options = categorys.map(item => ({
      value: item._id,   //要收集的数据
      label: item.name,  //在页面中显示的内容
      isLeaf: false  //不是叶子
    }))
    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this
    const { pCategoryId, categoryId } = product
    if (isUpdate && pCategoryId !== '0') {
      // 说明是二级商品分类的更新，对应的二级分类列表应该显示出来
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(item => ({
        value: item._id,   //要收集的数据
        label: item.name,  //在页面
        isLeaf: true
      }))
      // 找到当前商品对应的一级options
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联到对应的一级option上
      targetOption.children = childOptions
    }
    // 更新options状态
    this.setState({ options })
  }
  onFinish = async(values) => {
    const imgs = this.pw.current.getImgs()
    const detail = this.editor.current.getDetail()
    // 收集数据,并封装成product对象
    const { name, desc, price, categoryIds } = values
    let pcategoryId, categoryId
    if (categoryIds.length === 1) {
      pcategoryId = '0'
      categoryId = categoryIds[0]
    } else {
      pcategoryId = categoryIds[0]
      categoryId = categoryIds[1]
    }
    const product={name,desc,price,imgs,detail,pcategoryId,categoryId}
    // 如果是更新，需要添加_id
    if(this.isUpdate){  //是更新
        product._id = this.product._id
    }
    // 调用接口请求函数去添加、更新
    const result = await reqAddOrUpdateProduct(product)
    console.log(result)
    // 根据结果显示
    if(result.status===0){
      message.success(`${this.isUpdate? '更新':'添加'}商品成功！`)
      this.props.history.goBack()
    }else{
      message.error(`${this.isUpdate? '更新':'添加'}商品失败！`)
    }
    // console.log(imgs)
    // console.log(detail)
    // console.log(values)
  }
  // 用于加载下一级列表
  loadData = async (selectedOptions) => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0];
    // 显示loading
    targetOption.loading = true; // load options lazily

    // 根据选中的分类，请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    // 隐藏loading
    targetOption.loading = false;
    // 二级分类有数据
    if (subCategorys && subCategorys.length > 0) {
      // 生成二级列表的options
      const childOptions = subCategorys.map(item => ({
        value: item._id,   //要收集的数据
        label: item.name,  //在页面
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else {  //当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }
    // 更新options状态
    this.setState({ options: [...this.state.options] });
    // 模拟请求异步二级数据。并更新
    // setTimeout(() => {
    //   targetOption.loading = false;
    //   targetOption.children = [
    //     {
    //       label: `${targetOption.label} Dynamic 1`,
    //       value: 'dynamic1',
    //       isLeaf:true
    //     },
    //     {
    //       label: `${targetOption.label} Dynamic 2`,
    //       value: 'dynamic2',
    //       isLeaf:true
    //     },
    //   ];
    //   // 更新options对象

    // }, 1000);
  };
  componentWillMount() {
    // 取出携带的product
    const product = this.props.state //如果是添加，没值，修改的话有值
    // 强制转换成布尔类型，保存一个是否是更新的标识
    this.isUpdate = !!product
    // 保存商品，如果没有，保存是空对象
    this.product = product || {}

  }
  componentDidMount() {
    this.getCategorys('0')
  }
  render() {
    const { isUpdate, product } = this
    const { pCategoryId, categoryId, imgs, detail } = product
    // 用来接收级联分类ID的数组
    const categoryIds = []
    if (isUpdate) {
      // 商品是一个一级分类的商品
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    const title = (
      <span>
        <LinkButton onClick={() => { this.props.history.goBack() }}>
          <ArrowLeftOutlined style={{ fontSize: 20, marginRight: 10 }} />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )
    // 指定Item布局的配置对象
    const layout = {
      labelCol: {  //左侧label的宽度
        span: 2,
      },
      wrapperCol: {  //指定右侧包裹输入框的宽度
        span: 8,
      },
    };
    // 加载级联的下一级数据
    return (
      <Card title={title}>
        <Form {...layout} onFinish={this.onFinish}>
          <Item label="商品名称" name='name' initialValue={product.name}
            rules={[
              {
                required: true,
                message: '必须输入商品名称',
              },
            ]}
          >
            <Input placeholder='请输入商品名称' />
          </Item>
          <Item label="商品描述" name='desc' initialValue={product.desc}
            rules={[
              {
                required: true,
                message: '必须输入商品描述',
              },
            ]}>
            <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />
          </Item>
          <Item label="商品价格" name='price' initialValue={product.price}
            rules={[
              {
                required: true,
                message: '必须输入商品价格',
              },
            ]}>
            <InputNumber min={1} style={{ width: '100%', }} placeholder='请输入商品价格' addonAfter="元" />
          </Item>
          <Item label="商品分类" name='categoryIds'
            rules={[
              {
                required: true,
                message: '必须指定商品分类',
              }
            ]}>
            <Cascader
              options={this.state.options}  //指定需要显示的列表数据
              loadData={this.loadData}   //当选择某个列表项，用来加载下一级数据
              placeholder='请指定商品分类'
            />
          </Item>
          <Item label="商品图片">
            <PictureWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item label="商品详情"
            labelCol={{ span: 2 }} //左侧label的宽度,
            wrapperCol={{ span: 20 }}//指定右侧包裹输入框的宽度
          >
            < RichTextEditor ref={this.editor} detail={detail} />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" >
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
