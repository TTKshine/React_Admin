import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { reqProducts, reqSearchProducts,reqUpdateStatus } from '../../api';
import { PAGE_SIZE } from '../../utils/constants'
const { Option } = Select;
// product的默认子路由

export default class ProductHome extends Component {
  state = {
    loading: false, //是否正在加载中
    total: 0,//商品的总数量
    products: [], //商品的数组
    searchName: '',//搜索的关键字
    searchType: 'productName',//根据哪个字段搜索
  }
  // 用来初始化table的列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price   //当前指定了对应 的属性，传入的是对应的属性值
      },
      {
        width: 100,
        title: '状态',
       // dataIndex: 'status',
        render: (product) => {
          const {status,_id} = product
          const newStatus = status ===1 ? 2:1
          return (
            <span>
              <Button type='primary' onClick={()=>this.updateStatus(_id,newStatus)}>
                {status ===1 ? '下架':'上架'}
              </Button>
              <span>{status ===1 ? '在售':'已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              {/* 将需要查看的商品信息通过push 的第二个参数传递到路由组件 */}
              <Button type='link' onChange={()=>this.props.history.push('/product/detail',{product})}>
                详情
              </Button>
              <Button type='link' onClick={()=>{this.props.history.push('/product/addupdate',product)}}>
                修改
              </Button>
            </span>
          )
        }
      },
    ];
  }

  // 获取指定页码的商品列表显示
  getProducts = async (pageNum) => {
    this.pageNum = pageNum  //保存商品所在页码,为了让其他方法看到
    this.setState({ loading: true })  //显示loading
    const {searchName,searchType} = this.state
    // 如果搜索关键字有值，说明要进行搜索分页
    let result
    if(searchName){
        result = await reqSearchProducts({pageNum,PAGE_SIZE,searchName,searchType})
    }else{
        result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({ loading: false })   //隐藏loading

    // 取出分页数据。更新状态，显示分页列表
    if (result.status === 0) {
      const { total, list } = result.status
      this.setState({
        total,
        products: list
      })
    }
  }

  // 更新指定商品的状态
   updateStatus = async(productId,Status)=>{
     const result = await reqUpdateStatus(productId,Status)
     if(result.status===0){
        message.succedd('更新商品成功')
        // 更新列表显示,需要确定是哪一页的商品状态发生了改变
        this.getProducts(this.pageNum)
     }
   }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1)
  }
  render() {
    // 取出状态数据
    const { products, total, loading, searchName, searchType } = this.state
    const columns = this.columns
    // 左上角
    const title = (
      <span>
        <Select
          defaultValue={searchType}
          style={{ width: 150 }}
          onChange={value => this.setState({ searchType: value })}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='ProductDesc'>按描述搜索</Option>
        </Select>
        <Input placeholder='关键字'
          style={{ width: 150, margin: '0 15px' }}
          value={searchName}
          onChange={event => this.setState({ searchName: event.target.value })}
        />
        <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
      </span>
    )
    // 右上角
    const extra = (
      <Button type='primary' onClick={()=>{this.props.history.push('/product/addupdate')}}>
        <Space style={{ marginRight: '5px' }}>
          <PlusOutlined />
        </Space>
        添加商品
      </Button>
    )
    return (
      <Card
        title={title}
        extra={extra}>
        <Table
          loading={loading}
          bordered
          rowkey='_id'
          dataSource={products}
          columns={columns}
          pagination={{
            current:this.pageNum,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.getProducts
          }}
        />;
        {/* rowKey	表格行 key 的取值，可以是字符串或一个函数 */}
      </Card>
    )
  }
}
