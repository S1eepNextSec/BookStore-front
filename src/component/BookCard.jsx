import {Card, Divider, Flex, message, Space} from "antd";
import Meta from "antd/es/card/Meta";
import "../css/bookcard.css"
import {useNavigate} from 'react-router-dom'
import {useContext, useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {createNewOrder} from "../service/order";
import {UserContext} from "./UserContext";

/**
 * BookCard组件
 * 用于主页中展示书籍的概要信息
 * 包括封面 | 名称 | 售价
 * @param bookImg 图片
 * @param bookName 名称
 * @param bookPrice 售价
 * @param bookId 书籍ID
 * @returns {JSX.Element}
 * @constructor
 */
export default function BookCard({bookImg,bookName,bookPrice,bookId,stock,ISBN}){//利用props传递参数进来

    const navi = useNavigate();
    useEffect(()=>{
        console.log(bookImg);
    })

    /**
     * 处理书籍卡片被点击的函数
     */
    const handleBookCardClick = ()=>{
        navi(`/books/${bookId}`);
    }

    /**
     * 利用Ant Design的Card组件
     */
    return(
        <Card
            hoverable={true} //鼠标悬停会有浮起
            className={"bookcard-card"}
            cover={<img className="bookcard-img" alt={""} src={bookImg}/>} //设置封面
            onClick={handleBookCardClick}//设置点击事件
        >
            {/*描述书籍的基本信息 名称以及价格*/}
            <Meta
                title={bookName}
                description={
                    <Flex justify={"center"} vertical={true}>
                        <Flex justify={"center"}>
                            <span style={{color: "#ff7875"}}>￥{bookPrice / 100}</span>
                            <Divider type={"vertical"}/>
                            <span>库存:{stock}</span>
                        </Flex>
                        <span style={{fontSize:"12px"}}>ISBN:{ISBN}</span>
                    </Flex>

                }
            />
        </Card>
    );
}
