import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Modal, message } from 'antd'
import { reqDeleteImg } from '../../api';
import { BASE_IMG_URL } from '../../utils/constants';
// 用于图片上传的组件
// const fileList = [
//     {
//         uid: '-1',  //每个file都有一个唯一的id，建议设置成负数，防止和内部的id冲突
//         name: 'image.png',  //图片文件名
//         status: 'done', //图片状态：done上传已完成 onloading 正在上传中，remove 已删除
//         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',  //图片地址
//     },
//     {
//         uid: '-2',
//         name: 'image.png',
//         status: 'done',
//         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     },
//     {
//         uid: '-3',
//         name: 'image.png',
//         status: 'done',
//         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     },
//     {
//         uid: '-4',
//         name: 'image.png',
//         status: 'done',
//         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     },
//     {
//         uid: '-xxx',
//         percent: 50,
//         name: 'image.png',
//         status: 'uploading',
//         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     },
//     {
//         uid: '-5',
//         name: 'image.png',
//         status: 'error',
//     },
// ]
export default class PictureWall extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }
    state = {
        previewVisible: false,  //标识是否显示大图预览
        previewImage: '',    //大图的URL
        previewTitle: '',
        fileList: [] //图片列表
    }

    constructor(props) {
        super(props)
        let fileList = []
        // 如果传入了imgs属性
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img,index) =>({
                uid: -index,  //每个file都有一个唯一的id，建议设置成负数，防止和内部的id冲突
                name: 'img'  ,//图片文件名
                status: 'done', //图片状态：done上传已完成 onloading 正在上传中，remove 已删除
                url: BASE_IMG_URL+img,  //图片地址
            }))
        }
        // 初始化状态
        this.state = {
            previewVisible: false,  //标识是否显示大图预览
            previewImage: '',    //大图的URL
            previewTitle: '',
            fileList  //所有已上传图片的数组
        }
    }
    //    获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }
    getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
        });

    // 显示指定file对应的大图
    handlePreview = async (file) => {
        console.log(' handlePreview', file)
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        // console.log(file.preview)
        // console.log(file.url || file.preview)
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        })
    };
    // 隐藏Modal
    handleCancel = () => this.setState({ previewVisible: false });

    // fileList是所有已上传图片文件的数组
    //  file当前操作的图片文件 (上传/删除)
    handleChange = async ({ file, fileList }) => {
        // 一旦上传成功，将当前上传的file信息进行修正（name和Url)
        if (file.status === 'done') {
            const result = file.response   //{status:0 data:{name:  url：}}
            if (result.status === 0) {
                message.success('上传图片成功')
                const { name, url } = result.data
                // 在antd中file和fileList[fileList.length-1]指向同一个，因此改了一个之后，fileList[fileList.length-1]也会修改
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') {  //删除图片
            const result = await reqDeleteImg(file.name)
            console.log(result)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }
        console.log(fileList)
        // 在操作过程中，更新filelist状态
        this.setState({ fileList });
    }


    render() {
        const { previewVisible, previewTitle, previewImage, fileList } = this.state
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div
                    style={{
                        marginTop: 8,
                    }}
                >
                    Upload
                </div>
            </div>
        );
        return (
            <>
                <Upload
                    //只接受图片格式的文件
                    accept='image/*'
                    // 上传地址
                    action="/manage/img/upload"
                    // 卡片样式
                    listType="picture-card"
                    // 请求参数名
                    name='image'
                    // 所有已上传图片文件对象的数组
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>

                {/* 预览时候的对话框 */}
                <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={this.handleCancel}>
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal>
            </>
        )
    }
}

