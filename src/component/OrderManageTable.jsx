import {Button, DatePicker, Divider, Flex, Image, Input, List, Radio, Space, Table, Tag} from "antd";
import Search from "antd/es/input/Search";
import Column from "antd/es/table/Column";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";
import {filterOrderByBookTitle, filterOrderByTime, searchOrder} from "../service/order";
import {CloseOutlined} from "@ant-design/icons";
import {getOrderInfoInAdminModeByTime, getOrderInfoInAdminModeByTitle,getOrderInfoInAdminMode} from "../service/manage";

const {RangePicker } = DatePicker;
export default function OrderManageTable()
{
    const currentTimestamp = new Date().toLocaleString();
    const oneWeekAgoTimestamp = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleString();
    const pageSize = 10;

    const [filterRadioValue,setFilterRadioValue] = useState(1);
    const [pageIndex,setPageIndex] = useState(1);
    const [data,setData] = useState([]);
    const [total,setTotal] = useState(0);
    const [timeRange,setTimeRange] = useState([0,0]);
    const [keyword,setKeyword] = useState("");

    const [searchMode,setSearchMode] = useState("normal");
    const [searchTimeRange,setSearchTimeRange] = useState(["",""]);
    const [searchKeyword,setSearchKeyword] = useState("");

    const getOrders = async() => {
        let res = null;
        if (searchMode == "normal"){
            res = await getOrderInfoInAdminMode(pageIndex,pageSize);
        }
        else if (searchMode == "time"){
            res = await getOrderInfoInAdminModeByTime(searchTimeRange[0]+":00",searchTimeRange[1]+":00",pageIndex,pageSize);
        }
        else if (searchMode == "title"){
            res = await getOrderInfoInAdminModeByTitle(searchKeyword,pageIndex,pageSize);
        }
        setData(res.orders);
        setTotal(res.total_elements);
    }

    const handleSearchBtnClick= async() => {
        if (filterRadioValue == 1 && timeRange[0] != "" && timeRange[1] != ""){
            setSearchTimeRange(timeRange);
            setSearchMode("time")
            setPageIndex(0)
        }
        else if (filterRadioValue == 2 && keyword != ""){
            setSearchKeyword(keyword);
            setSearchMode("title")
            setPageIndex(0)
        }
    }

    const handleCancelFilter=async()=>{
        setSearchMode("normal");
        setPageIndex(0);
    }

    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        getOrders();
    },[searchMode,searchKeyword,searchTimeRange,pageIndex])

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
                            }}
                            style={{height:"30px",width:"400px"}}
                        />:
                        <Input
                            onChange={(e)=>{
                                setKeyword(e.target.value)
                            }}
                            style={{height:"30px",width:"400px"}}
                        />
                    }
                    <Button onClick={()=>{handleSearchBtnClick()}}>查询</Button>
                    {searchMode !=="normal"?<Button onClick={handleCancelFilter}
                        icon={<CloseOutlined/>}/>:null
                    }
                    <Tag color={"blue"}>
                        {searchMode==="time"?"按时间过滤":searchMode==="title"?"按书名过滤":"显示所有"}
                    </Tag>
                </Space>

            </Flex>

            <Table
                expandable={{//设置展开的信息
                    expandedRowRender:(record)=> {
                        return getOrderDetail(record.order_items)
                    }
                }}

                dataSource={data}

                rowKey={"id"}

                pagination={{
                    total:total,
                    pageSize:pageSize,
                    current:pageIndex+1,
                    onChange:(page)=>{
                        setPageIndex(page-1);
                    },
                    showSizeChanger:false,
                    position:["bottomRight"]
                }}
            >
                <Column
                    title={"订单号"}
                    dataIndex={"id"}
                />

                <Column
                    title={"下单用户"}
                    dataIndex={"account"}
                />

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
    )
}

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