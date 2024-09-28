import "../css/bookdetail.css"
import {Descriptions, Flex, Form, Image, Input, message, Modal, Skeleton, Space} from 'antd';
import { Divider, Typography ,Card,Row,Col,Button,Statistic } from 'antd';
import React, {useContext, useEffect, useState} from "react";
import {redirect, useParams} from "react-router";
import {book as books} from "../utils/fakeData";
import {addBookToCart, getBookById} from "../service/book";
import {UserContext} from "./UserContext";
import {useForm} from "antd/es/form/Form";
import {createNewOrder} from "../service/order";
import {FormOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const { Title, Paragraph, Text, Link } = Typography;

/**
 * 显示书籍详细信息页面的组件
 * 包含书籍的封面图片
 * ISBN、作者、销量等信息
 * @returns {Element}
 * @constructor
 */
export default function BookDetail(){
    const navi = useNavigate();
    const {id}=useParams();
    const userInfo = useContext(UserContext).user;
    const [form] = useForm();
    const [isOrderModalOpen,setIsOrderModalOpen] = useState(false);

    const handleOrderModalCancel=()=>{
        setIsOrderModalOpen(false);
    }

    const handleOrderModalOk=()=>{
        const addr = form.getFieldValue("address");
        const contact = form.getFieldValue("contact");
        const recipient = form.getFieldValue("recipient");
        if (addr == "" || contact == "" || recipient == ""){
            messageAPI.open({type:"error",content:"请填写完整信息"});
            return;
        }

        handleOrder();
        setIsOrderModalOpen(false);
    }

    const handleOrder=async()=>{
        const orderItems = [{
            book_id:id,
            quantity:1
        }];

        const total_cost = getTotalCost();
        const address = form.getFieldValue("address");
        const contact = form.getFieldValue("contact");
        const recipient = form.getFieldValue("recipient");

        const time = new Date().toLocaleString();

        const orderInfo = {
            user_id:userInfo.id,
            recipient:recipient,
            contact:contact,
            address:address,
            payment:total_cost,
            time:time,
            order_items:orderItems
        }
        // console.log(orderInfo);
        const OrderCreateResponse = await createNewOrder(orderInfo);

        if (OrderCreateResponse.status ==="success"){
            messageAPI.open({type:"success",content:"订单处理中"});
        }
        else {
            messageAPI.open({type:"error",content:OrderCreateResponse.msg});
        }
    }



    const [book,setBook] = useState(null);

    const [messageAPI,contextHolder]=message.useMessage();

    const userContext = useContext(UserContext);

    const getTotalCost= ()=>{
        return (book?book.price:0);
    }


    const getDescriptionItem = ()=>{//箭头函数;
        const description = [//数组
                {
                    label:"作者",//表格中一条栏目的题头
                    children:book?book.author:"",//该栏目的内容
                },
                {
                    label:"ISBN编号",
                    children:book?book.isbn:"",
                },
                {
                    label:"出版社",
                    children:book?book.publisher:"",
                },
                {
                    label:"出版日期",
                    children:book?(new Date(book.publish_date)).toLocaleDateString():"",
                },
                {
                    label:"价格",
                    children:book?( "￥"+ book.price/100):"",
                },
                {
                    label:"销量",
                    children:book?book.sale:"",
                },
                {
                    label:"库存",
                    children:book?book.stock:"",
                },

            ];
            return description;//返回构造出来的格式化了的描述信息
    }

    const getBookDetail = async ()=>{
        let data = await getBookById(id);
        console.log(data)

        if (data === null){
            navi("/books")
        }
        else
            setBook(data);
    }

    const handleCartBtnClick= async()=>{
        const status = await addBookToCart(userContext.user.cart_id,book.id);

        if (status === true){
            messageAPI.open({type:"success",content:"加入购物车成功"});
        }
        else {
            messageAPI.open({type:"error",content:"加入购物车失败"});
        }
    }

    const handleBuyBtnClick=async()=>{
        setIsOrderModalOpen(true);
    }

    useEffect(()=>{
        getBookDetail();
    },[])

    return (
        book?<div>
            {contextHolder}
            <Flex justify={"center"}>
                <span className={"book-detail-title"}>{book?book.title:""}</span>
            </Flex>

            <Divider/>

            <Flex justify={"space-evenly"}>
                 <div>
                     <Image
                         src={book?book.cover:""}
                         width={"350px"}
                         height={"500px"}/>
                 </div>

                <Descriptions
                    title={"基本信息"}
                    bordered
                    items={getDescriptionItem()}//获取数据源
                    column = {1}
                    style={{width:"40%"}}
                />

            </Flex>

            <Divider/>

            <Flex justify={"center"}>
                <Descriptions
                    contentStyle={{
                        border:"1px solid #0958d9"
                    }}

                    items={[{label:"简介",children:book?book.description:<Skeleton />}]}
                    column={1}  //限制只显示一列
                    bordered
                    style={{width:"80%"}}
                    contentStyle={{
                        whiteSpace:"pre-line",
                        fontSize:"20px",
                    }} //pre-line能让文本里面的换行符正常换行
                    labelStyle={{
                        textAlign:"center",
                    }}//文本居中
                    layout={"vertical"}

                />
            </Flex>

            <Row className={"book-button-row"} justify={"center"} gutter={20}>
                <Col span={4}>
                    <Button
                        type={"primary"}
                        className={"book-price-card-button"}
                        onClick={handleCartBtnClick}
                    >
                        加入购物车
                    </Button>
                </Col>
                <Col span={4}>
                    <Button
                        className={"book-price-card-button"}
                        onClick={handleBuyBtnClick}
                    >
                        立即购买
                    </Button>
                </Col>
            </Row>

            {isOrderModalOpen?(<Modal
                visible={isOrderModalOpen}
                onOk={handleOrderModalOk}
                onCancel={handleOrderModalCancel}
                okText={"下单"}
                cancelText={"取消"}
            >
                <h2>
                    <FormOutlined/>
                    订单
                </h2>
                <Divider/>
                <Flex
                    justify={"center"}
                >
                    <Form
                        name={"order"}
                        form={form}
                        initialValues={
                            {recipient: "", contact: "aa", address: ""}
                        }
                    >
                        <Form.Item
                            name={"address"}
                            label={"地址"}
                            rules={[{
                                required: true,
                                message: "请输入地址"
                            }, {
                                type: "string",
                                message: "请输入正确的地址",
                            }
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name={"contact"}
                            label={"联系电话"}
                            rules={[{
                                required: true,
                                message: "请输入联系电话"
                            }
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name={"recipient"}
                            label={"收件人"}
                            rules={[{
                                required: true,
                                message: "请输入收件人姓名"
                            }, {
                                type: "string",
                                message: "请输入正确的姓名",
                            }
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item>
                            订单总价:{"￥" + getTotalCost()/100}
                        </Form.Item>
                    </Form>
                </Flex>
            </Modal>):(null)}
        </div>:<></>
    )

}