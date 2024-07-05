import BasicLayout from "../component/BasicLayout";
import ColumnPlot from "../component/ColumnPlot";
import {Button, Card, Col, DatePicker, Flex, Radio, Row, Space, Statistic, Table} from 'antd';
import React, {useEffect, useState} from "react";
import {getUserOrderStatistic} from "../service/statistic";
import dayjs from "dayjs";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    BookOutlined,
    MoneyCollectOutlined,
    OrderedListOutlined
} from "@ant-design/icons";
const { RangePicker } = DatePicker;
/**
 * 排行界面
 * @returns {JSX.Element}
 * @constructor
 */
export default function PersonalRankPage(){
    const currentTimestamp = new Date().toLocaleString();
    const oneWeekAgoTimestamp = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleString();

    const [timeRange,setTimeRange] = useState([oneWeekAgoTimestamp,currentTimestamp]);

    const [paymentData,setPaymentData] = useState(0);
    const [orderNumData,setOrderNumData] = useState(0);
    const [bookNumData,setBookNumData] = useState(0);
    const [bookNameVec,setBookNameVec] = useState([]);
    const [bookQuantityVec,setBookQuantityVec] = useState([]);
    const [showType,setShowType] = useState("column");

    const getStatistics = async() => {
        const data = await getUserOrderStatistic(timeRange[0],timeRange[1]);
        setPaymentData(data.total_payment);
        setOrderNumData(data.total_order);
        setBookNumData(data.total_book_count);
        setBookNameVec(data.book_rank.map((item)=>item.first));
        setBookQuantityVec(data.book_rank.map((item)=>item.second));
    }

    useEffect(() => {
        getStatistics();
    }, []);

    useEffect(() => {
        console.log(bookNameVec);
        console.log(bookQuantityVec);
    }, [bookNameVec,bookQuantityVec]);

    return (
        <BasicLayout defaultKey={'rank'}>
            <Card>
                <Flex>
                    <Radio.Group onChange={(e)=>{
                        setShowType(e.target.value);
                    }}
                        value={showType}>
                        <Radio value={"column"}>图</Radio>
                        <Radio value={"list"}>表</Radio>
                    </Radio.Group>

                    <RangePicker
                        defaultValue={[dayjs(oneWeekAgoTimestamp), dayjs(currentTimestamp)]}
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        onChange={(value, dateString) => {
                            setTimeRange(dateString);
                        }}
                        style={{
                            marginBottom: "12px"
                        }}
                    />
                    <Button onClick={()=>{
                        getStatistics();
                    }}>查询</Button>
                </Flex>

                {showType==="column"?<ColumnPlot LabelVec={bookNameVec} ValueVec={bookQuantityVec} unit={"本"} hint={"购买数量"}/>:
                <Table
                    dataSource={bookNameVec.map((item,index)=>({
                        key:index,
                        bookName:"《"+item+"》",
                        quantity:bookQuantityVec[index]
                    }))}
                    columns={[
                        {
                            title:
                                <Flex justify={"center"}>书名</Flex>,
                            dataIndex:"bookName",
                            key:"bookName",
                            render:(text)=><Flex justify={"center"}>{text}</Flex>
                        },
                        {
                            title:
                            <Flex justify={"center"}>
                                购买数量
                            </Flex>,

                            dataIndex:"quantity",
                            key:"quantity",
                            render:(text)=><Flex justify={"center"}>{text}</Flex>
                        }
                    ]}
                >

                </Table>}


                <Row gutter={16} style={{marginTop:"24px"}}>
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="总书籍数"
                                value={bookNumData}
                                valueStyle={{
                                    color: '#3f8600',
                                }}
                                prefix={<BookOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="总消费额(元)"
                                value={paymentData/100}
                                valueStyle={{
                                    color: '#3f8600',
                                }}
                                prefix={<MoneyCollectOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="总订单数"
                                value={orderNumData}
                                valueStyle={{
                                    color: '#3f8600',
                                }}
                                prefix={<OrderedListOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </BasicLayout>
    )
}