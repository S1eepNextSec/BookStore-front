import {Avatar, Divider, Flex, Image, Input, List, Radio, Space, Statistic, Table} from "antd";
import Column from "antd/es/table/Column";
import {OrderList} from "../utils/fakeData";
import {Link} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";

import { DatePicker} from 'antd';
import {UserContext} from "./UserContext";
import {filterOrderByBookTitle, filterOrderByTime, searchOrder} from "../service/order";
import Search from "antd/es/input/Search";

const {RangePicker } = DatePicker;
/**
 * 订单页面的订单表
 * @returns {Element}
 * @constructor
 */
export default function OrderTable(){
    const user_id = useContext(UserContext).user.id;
    const pageSize = 10;
    const [pageIndex,setPageIndex] = useState(0);
    const [totalElement,setTotalElement] = useState(0);

    const [orderList,setOrderList] = useState([]);
    const [filterRadioValue,setFilterRadioValue] = useState(1);
    const [dataState,setDataState] = useState("normal");
    const [timeRange,setTimeRange] = useState(["",""]);
    const [keyword,setKeyword] = useState("");

    const getOrders = async(index,size)=>{
        let order;
        if (dataState ==="normal")
            order = await searchOrder(user_id,index,size)
        if (dataState ==="time" && timeRange[0] !== "" && timeRange[1] !== "")
            order =await filterOrderByTime(timeRange[0]+":00",timeRange[1]+":00",index,size);
        if (dataState ==="title" && keyword !== "")
            order = await filterOrderByBookTitle(keyword,index,size);

        if (dataState ==="time" && timeRange[0]==="" && timeRange[1]==="" ||
            dataState ==="title" && keyword ===""){
            setPageIndex(0)
            setDataState("normal")
            return
        }

        setOrderList(order.orders);
        setTotalElement(order.total_elements);
    }


    useEffect(() => {
        getOrders(pageIndex,pageSize);
    }, []);

    useEffect(()=>{
        getOrders(pageIndex,pageSize);
    },[pageIndex,timeRange,keyword,dataState]);


    return (
        <>
            <Flex
                style={{
                    width:"100%",
                    marginTop:"10px",
                    marginBottom:"10px"
                }}
                justify={"center"}
            >
                <Radio.Group
                    defaultValue={filterRadioValue}
                    onChange={(e)=>{setFilterRadioValue(e.target.value)}}>
                    <Space direction="horizontal">
                        <Radio value={1}>按时间</Radio>
                        <Radio value={2}>按书名</Radio>
                    </Space>
                </Radio.Group>
                <Space>
                {filterRadioValue == 1?<RangePicker
                        showTime={{
                            format: 'HH:mm',
                        }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={(value, dateString) => {
                            setTimeRange(dateString);
                            setDataState("time");
                            setPageIndex(0);
                        }}
                        style={{height:"30px",width:"400px"}}
                    />:
                    <Search
                        onSearch={(value)=>{
                            setKeyword(value);
                            setDataState("title");
                            setPageIndex(0);
                        }}
                        style={{height:"30px",width:"400px"}}
                    />
                }
                </Space>

            </Flex>

            <Table
                expandable={{//设置展开的信息
                    expandedRowRender:(record)=> {
                        return getOrderDetail(record.order_items)
                    }
                }}

                dataSource={orderList}

                rowKey={"id"}

                pagination={{
                    total:totalElement,
                    pageSize:pageSize,
                    current:pageIndex+1,
                    onChange:(page)=>{
                        setPageIndex(()=>page-1);
                    },
                    position:["bottomRight"],
                    showSizeChanger:false
                }}
            >
                <Column
                    title={"收货人"}
                    dataIndex={"recipient"}/>

                <Column
                    title={"联系方式"}
                    dataIndex={"contact"}/>

                <Column
                    title={"收货地址"}
                    dataIndex={"address"}/>

                <Column
                    title={"金额"}
                    dataIndex={"total_amount"}
                    render={(money)=>{
                        return (<>
                            {money?("￥"+money/100):null}
                        </>)
                    }}

                />

                <Column
                    title={"下单时间"}
                    dataIndex={"order_time"}
                    render = {(timestamp)=>{
                        return (<>
                            {new Date(timestamp).toLocaleString()}
                        </>)
                    }}
                />

            </Table>

        </>
    );
}

/**
 * 订单的展开信息
 * @param booklist
 * @returns {Element}
 */
const getOrderDetail = (booklist)=>{
    return (
        <>
            <List
                dataSource={booklist}
                renderItem={(item)=>{
                    return (
                        <List.Item>
                            <Image src={item.cover} width={120}/>

                            <Divider type={"vertical"}/>

                            <List.Item.Meta
                                title={<h2>{item.title}</h2>}
                                description={"数量:"+item.quantity}
                            />

                        </List.Item>
                    )
                }}
            >


            </List>
        </>
    )

}