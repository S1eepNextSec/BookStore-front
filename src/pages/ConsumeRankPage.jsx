import BasicLayout from "../component/BasicLayout";
import dayjs from "dayjs";
import {Button, Card, Col, DatePicker, Flex, Row, Statistic, Tabs} from "antd";
import ColumnPlot from "../component/ColumnPlot";
import {BookOutlined, MoneyCollectOutlined, OrderedListOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {getTopBookStatistic, getTopUserStatistic, getUserOrderStatistic} from "../service/statistic";
import Title from "antd/es/skeleton/Title";
const { RangePicker } = DatePicker;
export default function ConsumeRankPage() {
    const tabs=[
        {
            key:'1',
            label:"书籍热销榜",
            children:<>
                <Statistic title="热销书籍排行榜" value="Top 10" prefix={<OrderedListOutlined />} />
                <BookRankPlot/>
            </>
        },
        {
            key:'2',
            label:"用户消费榜",
            children:<>
                <Statistic title="用户消费排行榜" value="Top 10" prefix={<OrderedListOutlined />} />
                <UserRankPlot/>
            </>
        }
    ]

    const [searchMode, setSearchMode] = React.useState('1');
    const [bookNameVec, setBookNameVec] = React.useState([]);
    const [bookQuantityVec, setBookQuantityVec] = React.useState([]);

    const [userNameVec, setUserNameVec] = React.useState([]);
    const [userPaymentVec, setUserPaymentVec] = React.useState([]);

    const currentTimestamp = new Date().toLocaleString();
    const oneWeekAgoTimestamp = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleString();
    const [timeRangeForBook, setTimeRangeForBook] = React.useState([oneWeekAgoTimestamp, currentTimestamp]);
    const [timeRangeForUser, setTimeRangeForUser] = React.useState([oneWeekAgoTimestamp, currentTimestamp]);

    const getTopBooks = async () => {
        let data = null;
        if(searchMode == '1'){
            data = await getTopBookStatistic(timeRangeForBook[0], timeRangeForBook[1],10);
            setBookNameVec(data.top_books.map((item) => item.first));
            setBookQuantityVec(data.top_books.map((item) => item.second));
        }
        else{
            data = await getTopUserStatistic(timeRangeForUser[0], timeRangeForUser[1],10);
            setUserNameVec(data.top_users.map((item) => item.first));
            setUserPaymentVec(data.top_users.map((item) => item.second));
        }
    }

    useEffect(() => {
        console.log(searchMode)
    },[searchMode])

    return (
        <BasicLayout>
            <Card>
                <Tabs
                    items={tabs}
                    onChange={(key)=>{setSearchMode(key);}}/>
            </Card>
        </BasicLayout>
    );
}

function BookRankPlot(){
    const [bookNameVec, setBookNameVec] = React.useState([]);
    const [bookQuantityVec, setBookQuantityVec] = React.useState([]);

    const currentTimestamp = new Date().toLocaleString();
    const oneWeekAgoTimestamp = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleString();
    const [timeRangeForBook, setTimeRangeForBook] = React.useState([oneWeekAgoTimestamp, currentTimestamp]);

    const getTopBooks = async () => {
        const data = await getTopBookStatistic(timeRangeForBook[0], timeRangeForBook[1],10);
        setBookNameVec(data.top_books.map((item) => item.first));
        setBookQuantityVec(data.top_books.map((item) => item.second));
    }

    return(
        <>
            <Flex justify={"center"} style={{marginBottom:"10px"}}>
                <RangePicker
                    defaultValue={[dayjs(oneWeekAgoTimestamp), dayjs(currentTimestamp)]}
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={(value, dateString) => {
                        setTimeRangeForBook(dateString);
                    }}
                />

                <Button onClick={()=>{
                    getTopBooks()
                }}>查询</Button>
            </Flex>

            <ColumnPlot
                LabelVec={bookNameVec}
                ValueVec={bookQuantityVec}
                hint={"销售数量"}
                unit={"本"}
            />

        </>
    )
}

function UserRankPlot(){
    const [userNameVec, setUserNameVec] = React.useState([]);
    const [userPaymentVec, setUserPaymentVec] = React.useState([]);

    const currentTimestamp = new Date().toLocaleString();
    const oneWeekAgoTimestamp = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleString();

    const [timeRangeForUser, setTimeRangeForUser] = React.useState([oneWeekAgoTimestamp, currentTimestamp]);

    const getTopUsers = async () => {
        let data = null;
        data = await getTopUserStatistic(timeRangeForUser[0], timeRangeForUser[1],10);
        setUserNameVec(data.top_users.map((item) => item.first));
        setUserPaymentVec(data.top_users.map((item) => item.second/100));
    }

    return(
        <>
            <Flex justify={"center"} style={{marginBottom:"10px"}}>
                <RangePicker
                    defaultValue={[dayjs(oneWeekAgoTimestamp), dayjs(currentTimestamp)]}
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={(value, dateString) => {
                        setTimeRangeForUser(dateString);
                    }}/>

                <Button onClick={()=>{
                    getTopUsers()
                }}>查询</Button>
            </Flex>

            <ColumnPlot
                LabelVec={userNameVec}
                ValueVec={userPaymentVec}
                hint={"消费金额"}
                unit={"元"}
            />

        </>
    )
}