import LoginForm from "../component/LoginForm";
import BasicLayout from "../component/BasicLayout";
import Search from "antd/es/input/Search";
import {Button, Card, Col, Flex, List, Modal, Pagination, Row, Skeleton} from "antd";
import BookCard from "../component/BookCard";
import p from "../img/尾随者.jpg"
import "../css/homepage.css"
import {book as book} from "../utils/fakeData";
import React, { useEffect, useState} from "react";
import {UserContext} from "../component/UserContext";
import {getRequest} from "../service/common";
import {getBookById, getBookFilteredByTitle, getBooksPageable, searchAuthorByBookName} from "../service/book";
import {BACK_END_URL} from "../utils/backend_url";
import {ArrowLeftOutlined, CheckOutlined, LeftOutlined, RedoOutlined} from "@ant-design/icons";

/**
 * 主页
 * @returns {JSX.Element}
 * @constructor
 */
export default function HomePage(){
    const [pageIndex,setPageIndex] = useState(0);
    const element_num = 10;
    const [books,setBooks] = useState([]);
    const [totalPages,setTotalPages] = useState(1);
    const [totalBooks,setTotalBooks] = useState(0);
    const [isFiltering,setIsFiltering] = useState(false);
    const [searchKeyWord,setSearchKeyWord] = useState("");
    const [isAuthorSearching,setIsAuthorSearching] = useState(false);
    const [authorSearchResult,setAuthorSearchResult] = useState([]);

    const getBooks = async (page_index,num)=>{
        let data =await getBooksPageable(pageIndex,element_num);

        setBooks(data.books);
        setTotalPages(data.total_pages);
        setTotalBooks(data.total_elements);
    }

    const filterBooks = async(keyword,page_index,page_size)=>{
        let data = await getBookFilteredByTitle(keyword,page_index,page_size);

        setBooks(data.books);
        setTotalPages(data.total_pages);
        setTotalBooks(data.total_elements);
    }

    const doStartFilter=(keyword)=>{
        setSearchKeyWord(keyword);
        setIsFiltering(true);
        setPageIndex(0);
    }

    const cancelFilter=()=>{
        setSearchKeyWord("");
        setIsFiltering(false);
        setPageIndex(0);
    }

    const showAuthorSearchModal = ()=>{
        setIsAuthorSearching(true);
    }
    const closeAuthorSearchModal = ()=>{
        setIsAuthorSearching(false);
        setAuthorSearchResult([])
    }

    const searchAuthor = async (value)=>{
        let searchResult = await searchAuthorByBookName(value);

        setAuthorSearchResult(searchResult);
    }

    useEffect(()=>{
        if (isFiltering){
            if (searchKeyWord !== ""){
                filterBooks(searchKeyWord,pageIndex,element_num);
            }
        }
        else {
            getBooks(pageIndex, element_num);
        }
    },[pageIndex,isFiltering,searchKeyWord])


    return(
        <BasicLayout defaultKey={'home'}>
            <Row style={{marginTop:"10px"}}>
                <Col span={18} offset={3}>
                    <Flex gap={2}>
                        {isFiltering?
                            <Button
                                style={{height:"40px",width:"40px"}}
                                icon={<ArrowLeftOutlined/>}
                                onClick={cancelFilter}
                            />
                            :
                            null
                        }
                        <Search
                            placeholder={"书籍名称"}
                            allowClear
                            enterButton={"查找"}
                            size="large"
                            onSearch={(value)=>{
                                if (value !=="")
                                    doStartFilter(value);
                            }}
                        />
                        <Button
                            style={{height:"40px",fontSize:"16px"}}
                            onClick={()=>{
                                showAuthorSearchModal();
                            }}
                        >
                            查询作者
                        </Button>
                    </Flex>
                </Col>
            </Row>

            {/**
                用List来展示书籍卡片
            */}
            <List className="booklist"
                  grid={{column:element_num/2,gutter:12,placeItems:"center"}}
                  dataSource={books}
                  renderItem={(item)=>(
                      <List.Item>
                          <BookCard
                              bookId={item.id}
                              bookImg={item.cover}
                              bookPrice={item.price}
                              bookName={item.title}
                              ISBN={item.isbn}
                              stock={item.stock}
                          ></BookCard>
                      </List.Item>)}
            />
            <Flex justify={"center"}>
                <Pagination
                    totalBoundaryShowSizeChanger={"false"}
                    current={pageIndex + 1}
                    total={totalBooks}
                    pageSize={element_num}
                    onChange={(page)=>{
                        setPageIndex(page - 1);
                    }}
                />
            </Flex>
            <Modal
                open={isAuthorSearching}
                onCancel={()=>{closeAuthorSearchModal()}}
                // onOk={()=>searchAuthor()}
                footer={null}
                // okText={"查询"}
                // cancelText={"取消"}
                width={1000}
                title={"查询作者"}
            >
                <Flex justify={"left"}>
                    <Search
                        placeholder={"作者名称"}
                        allowClear
                        enterButton={"查找"}
                        onSearch={(value)=>{
                            if (value !=="")
                                searchAuthor(value);
                        }}
                        size="large"/>
                </Flex>
                <List
                    //分页
                    pagination={{
                        total:authorSearchResult.length,
                        pageSize:4,
                        hideOnSinglePage:true
                    }}
                    dataSource={authorSearchResult}
                    renderItem={(item)=>(
                        <Flex>
                            <span>
                                [{item.isbn}]《{item.title}》 - {item.author}
                            </span>
                        </Flex>
                    )}/>
            </Modal>
        </BasicLayout>
    );
}
