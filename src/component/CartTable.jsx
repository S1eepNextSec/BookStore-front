import {Button, Card, Col, Divider, Flex, Form, Image, Input, InputNumber, message, Modal, Row, Table} from "antd";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import Column from "antd/es/table/Column";
import {useContext, useEffect, useState} from "react";
import {keyboard} from "@testing-library/user-event/dist/keyboard";
import {Cart as test_cart} from "../utils/fakeData";
import Paragraph from "antd/es/typography/Paragraph";
import Search from "antd/es/input/Search";
import {Link} from "react-router-dom";
import {createNewOrder} from "../service/order";
import {
    debounceUpdateQuantity,
    deleteCartItems, deleteCartItemsBatch,
    getCartId,
    getCartItems,
    updateCartItemQuantity
} from "../service/cart";
import Title from "antd/es/skeleton/Title";
import {EditOutlined, FormOutlined, OrderedListOutlined} from "@ant-design/icons";
import {debounce} from "../utils/debounce";
import {UserContext} from "./UserContext";
import async from "async";
import {getBookById, getBookByIds} from "../service/book";


/**
 * 购物车中的展开信息
 * 描述书的详细内容
 * @param src 图片源
 * @param des 描述信息
 * @returns {JSX.Element}
 * @constructor
 */
function CartBookDetail({src,des}){
    return (
        <Flex gap={"20px"}>
            <div>
                <Image src={src}
                     style={{minWidth:"300px",minHeight:"400px",maxHeight:"300px",maxWidth:"400px"}}>
                </Image>
            </div>
            <Paragraph style={{whiteSpace:"pre-wrap"}}>
                {des}
            </Paragraph>
        </Flex>
    );
}

/**
 * 购物车页面中的商品描述表
 * @returns {JSX.Element}
 * @constructor
 */
export function CartTable(){
    const userInfo = useContext(UserContext).user;

    //记录被选中的条目
    const [selectedCartItems,setSelectedCartItems] = useState([]);
    const [Items,setItems] = useState([]);
    const [messageAPI,contextHolder]=message.useMessage();
    const [cartId,setCartId] = useState(null);

    const pageSize = 5;
    const [pageIndex,setPageIndex] = useState(0);

    const [isOrderModalOpen,setIsOrderModalOpen] = useState(0);
    const [form] = Form.useForm();
    const [pendingQuantities,setPendingQuantities] = useState([]);

    const [num,setNum] = useState(0)
    /**
     * 遍历购物车中选中的所有项目
     * 计算出总的价格
     * @returns {number} 总的价格
     */
    const getTotalCost = ()=>{
        let totalCost = 0;
        //遍历选中的所有item
        //计算出总价格
        selectedCartItems.map((item,index)=>{
            totalCost += item.price * item.quantity;
        })
        return totalCost;
    }

    const handleGetCartItems = async ()=>{
        const cartInfo = await getCartItems(userInfo.cart_id);
        // setItems(cartInfo.cartItems);
        // setCartId(cartInfo.cart_id);

        // 再发送一次请求获取书籍的封面 & 描述信息
        const bookIdList = cartInfo.cartItems.map((item)=>item.book_id);

        const bookContents = await getBookByIds(bookIdList);

        // 将book的cover & description信息填充到cartItems中
        let newItems = cartInfo.cartItems.map((item)=>{
            const bookContent = bookContents.find((book)=>book.id===item.book_id);

            return {
                ...item,
                cover:bookContent.cover,
                description:bookContent.description
            }
        })

        console.log(newItems)
        setItems(newItems);
        setCartId(cartInfo.cart_id);
    }

    useEffect(()=>{
        handleGetCartItems();
    },[])

    useEffect(()=>{
    },[pageIndex])

    const handleOrderBtnClick = async()=>{
        if (selectedCartItems.length === 0){
            messageAPI.open({type:"error",content:"请选择要购买的商品"});
        }
        else {
            setIsOrderModalOpen(true);
        }
    }

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


    /**
     * 改变购物车中某一项的数量
     * @param value 新的数量
     * @param id 要被改变的项的id
     */
    const changeQuantity=(value,id)=>{
        //找到被改变数量的item的索引
        const index = Items.findIndex((item)=>item.cartItem_id===id);

        let temp = [...Items];//展开这项Item的属性

        temp[index].quantity = value;//修改数量
        setItems(temp);//设置state
        console.log("防抖");
        let exist = pendingQuantities.find((item)=>item.cartItem_id===id);

        if (exist){
            exist.quantity = value;
        }
        else {
            pendingQuantities.push({cartItem_id: id, quantity: value});
        }

        const handleArray = Array.from(pendingQuantities);

        console.log("handleArray",handleArray);
        debounceUpdateQuantity(handleArray,pendingQuantities,setPendingQuantities);
    }


    /**
     * 从总的购物列表和选中的购物列表中删去某一项
     * @param id 要被删除的项目的id
     */
    const handleDeleteBtnClick = async(id)=>{
        let new_items = Items.filter((item)=>item.cartItem_id!==id);//过滤掉数组中要被删除的项
        let new_selected_items = selectedCartItems.filter((item)=>item.cartItem_id!==id);//过滤已经被选中的数组
        const isDeleteSuccess = await deleteCartItems(id);
        setItems(new_items);
        setSelectedCartItems(new_selected_items);
    }

    const handleOrder=async()=>{
        const orderItems = selectedCartItems.map((item)=>{
            return {
                book_id:item.book_id,
                quantity:item.quantity
            }});

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
        const OrderCreateResponse = await createNewOrder(orderInfo);

        if (OrderCreateResponse.status === "success"){
            messageAPI.open({type:"success",content:"订单处理中"});
            const cartItemIdList = selectedCartItems.map((item)=>item.cartItem_id);

            const isDeleteSuccess = await deleteCartItemsBatch(cartItemIdList);
            if (isDeleteSuccess){
                console.log("删除成功")
                setSelectedCartItems([])
                handleGetCartItems()
            }
            else {
                console.log("删除失败")
            }

        }
        else {
            messageAPI.open({type:"error",content:OrderCreateResponse.msg});
        }
    }

    return (
       <>
           {contextHolder}
           <Modal
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
                       {recipient:"",contact:"aa",address:""}
                       }
                   >
                       <Form.Item
                           name={"address"}
                           label={"地址"}
                           rules={[{
                               required:true,
                               message:"请输入地址"
                           },{
                               type:"string",
                               message:"请输入正确的地址",
                           }
                           ]}
                       >
                           <Input/>
                       </Form.Item>

                       <Form.Item
                           name={"contact"}
                           label={"联系电话"}
                           rules={[{
                               required:true,
                               message:"请输入联系电话"
                           }
                           ]}
                       >
                           <Input/>
                       </Form.Item>

                       <Form.Item
                           name={"recipient"}
                           label={"收件人"}
                           rules={[{
                               required:true,
                               message:"请输入收件人姓名"
                           },{
                               type:"string",
                               message:"请输入正确的姓名",
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

           </Modal>
           {/*<Row*/}
           {/*    justify={"center"}*/}
           {/*    style={{marginBottom:"20px"}}*/}
           {/*>*/}
           {/*    <Col span={16}>*/}
           {/*        <Search/>*/}
           {/*    </Col>*/}
           {/*</Row>*/}

           <Table
               rowSelection={{//设置一个rowSelection对象
                   type:"checkbox",
                   onChange:(selectedRowKeys, selectedRows)=> {//勾选情况变化的时候触发
                       setSelectedCartItems(selectedRows);
                   }
               }}
               expandable={{//设置展开信息
                   expandedRowRender:(record)=> {//record为表中的当前条目 定义如何渲染当前项目的展开
                       return (//返回详细信息
                           <CartBookDetail src={record.cover} des={record.description}/>
                       )
                   }
               }}
               dataSource={Items}   //数据源
               rowKey={"cartItem_id"}        //表格中的条目依靠id为唯一标识键
               pagination={{
                     total:Items.length,
                     pageSize:pageSize,
                     onChange:(page,pageSize)=>{
                          setPageIndex(page-1);
                     }
               }}
           >
               <ColumnGroup //设置表的抬头/每一列的信息
                   title={"书籍"}
                   align={"center"}>
                   <Column
                       title={"书名"}
                       align={"center"}
                       dataIndex={"title"}//这一列的数据对应于数据源中的标识是name
                       render={(text,record)=>{
                           return (//点击书籍名称可以跳转到详情界面
                               <Link to={"/books/"+record.book_id}>
                                   {text}
                               </Link>
                           )
                       }}
                   />

                   <Column
                       title={"作者"}
                       align={"center"}
                       dataIndex={"author"}
                   />

               </ColumnGroup>

               <Column
                   title={"数量"}
                   align={"center"}
                   dataIndex={"quantity"}
                   render={(num,record)=>{//指明如何渲染每一数据条目这一列下的信息
                       return  (<InputNumber min={1}
                                             max={114514}
                                             value={record.quantity}
                                             keyboard={true}
                                             onChange={(value)=>changeQuantity(value,record.cartItem_id)}/>
                       );//数字输入框 允许用户来修改
                   }}
               />

               <Column
                   title={"价格"}
                   align={"center"}
                   dataIndex={"price"}
                   render={(text)=>{return (<>￥{text/100}</>)}}
               />

               <Column
                   title={"操作"}
                   align={"center"}
                   render={(record)=>{
                       return (
                           <a
                               onClick={()=>{handleDeleteBtnClick(record.cartItem_id)
                           }
                           }>
                               删除
                           </a>
                       );
                   }}
               />

           </Table>
           <Divider type={"horizontal"}/>
           <Flex justify={"right"} align={"center"} style={{marginBottom:"20px"}}>
               <span style={{fontSize:"20px"}}>总价:</span>
               <span style={{fontSize:"30px",color:"darkblue"}}>￥{getTotalCost()/100}</span>
           </Flex>
           <Flex justify={"right"}>
               <Button type={"default"} onClick={handleOrderBtnClick}>
                   下单
               </Button>
           </Flex>
       </>
    );
}