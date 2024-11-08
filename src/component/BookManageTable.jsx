import {
    Button,
    Col,
    DatePicker,
    Divider,
    Flex,
    Form,
    Image,
    Input,
    InputNumber,
    Modal,
    Row,
    Space,
    Table,
    Upload
} from "antd";
import React, {useEffect, useState} from "react";
import {createBook, deleteBook, getBookFilteredByTitle, getBooksPageable, updateBook} from "../service/book";
import Paragraph from "antd/es/typography/Paragraph";
import BookEditForm from "./BookEditForm";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import {CloseOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import useMessage from "antd/es/message/useMessage";
import Search from "antd/es/input/Search";

export default function BookManageTable()
{
    const [messageAPI,contextHolder]  = useMessage()
    const [editingBook,setEditingBook] = useState(null);
    const [isEditModalOpen,setIsEditModalOpen] = useState(false);
    const columns = [
        {
            title:"ID",
            dataIndex:"id",
            key:"id",
        },
        {
            title: '书名',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title:"ISBN",
            dataIndex: "isbn",
            key: "isbn",
        },
        {
            title:"作者",
            dataIndex: "author",
            key:"author",
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            render:(item,record)=>{
                return "￥"+item/100;
            }
        },
        {
            title: '库存',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title:"销量",
            dataIndex: "sale",
            key: "sale",
        },
        {
            title:"出版日期",
            dataIndex:"publish_date",
            key:"publish_date",
            render:(item,record)=>{
                return new Date(item).toLocaleDateString();
            }
        },
        {
            title:"出版社",
            dataIndex: "publisher",
            key:"publisher",
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render:(item,record)=>{
                return (
                    <Space>
                        <a onClick={()=>handleEditBook(record.id)}>
                            编辑
                        </a>
                        <Divider type={"vertical"}/>
                        <a style={{color: "red"}} onClick={()=>handleDeleteBook(record.id)}>
                            删除
                        </a>
                    </Space>
                )
            }
        },
    ];
    const pageSize = 10;
    const [pageIndex,setPageIndex] = useState(0);
    const [books,setBooks] = useState([]);
    const [total,setTotal] = useState(0);

    const [imageUrl, setImageUrl] = useState();
    const [imageLoading,setImageLoading] = useState()

    const [isFiltering,setIsFiltering] = useState(false);
    const [filterKeyWord,setFilterKeyWord] = useState("");

    const [isCreatingNewBook,setIsCreatingNewBook] = useState(false);

    const emptyBook={
        title:"",
        isbn:"",
        author:"",
        price:0,
        stock:0,
        publish_date:Date.now(),
        publisher:"",
        cover:"",
        description:"",
    };

    const [creatingBook,setCreatingBook] = useState(emptyBook);

    const handleDeleteBook=async(book_id)=>{
        const isOk = await deleteBook(book_id);
        if (isOk){
            messageAPI.success("删除成功");
            // setBooks(books.map((item)=>{
            //     if (item.id === editingBook.id){
            //         return editingBook;
            //     }
            //     return item;
            // }))
            await getBooks(pageIndex,pageSize);
        }
        else{
            messageAPI.error("修改失败");
        }
    }

    const handleSumbitRevise=async()=>{
        console.log(editingBook);
        // 补充上sale以及isDeleted字段
        let editingBookSale = books.find((item)=>item.id === editingBook.id).sale;
        let editingBookCopy = {...editingBook,sale:editingBookSale,isDeleted:false};
        const isOk = await updateBook(editingBook);

        if (isOk){
            messageAPI.success("修改成功");
            setBooks(books.map((item)=>{
                if (item.id === editingBook.id){
                    return editingBook;
                }
                return item;
            }))
        }
        else{
            messageAPI.error("修改失败");
        }
    }

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const handleUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            setImageLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            console.log(info.file.response)
            if (info.file.response.status ==="success")
                setEditingBook({...editingBook,cover:info.file.response.data.url})

            getBase64(info.file.originFileObj, (url) => {
                setImageLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadChangeForCreating = (info) => {
        if (info.file.status === 'uploading') {
            setImageLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            console.log(info.file.response)
            if (info.file.response.status ==="success")
                setCreatingBook({...creatingBook,cover:info.file.response.data.url})

            getBase64(info.file.originFileObj, (url) => {
                setImageLoading(false);
                setImageUrl(url);
            });
        }
    }

    const closeModal=()=>{
        setIsEditModalOpen(false);
    }
    const handleEditBook=(id)=>{
        setEditingBook(books.find((item)=>item.id===id));

        setIsEditModalOpen(true);
    }

    const handleFilterBooks = (keyword)=>{
        if (keyword === "") return
        setIsFiltering(true)
        setPageIndex(0)
        setFilterKeyWord(keyword)
    }
    const handleCancelFilter = ()=>{
        setIsFiltering(false);
        setPageIndex(0)
        setFilterKeyWord("");
    }

    const handleCreateNewBook = async()=> {
        if(creatingBook.isbn === "" ||
            creatingBook.title === "" ||
            creatingBook.author === "" ||
            creatingBook.publisher === ""){
            messageAPI.error("请填写完整信息");
            return;
        }

        const isOk = await createBook(creatingBook);
        if (isOk) {
            messageAPI.success("创建成功");
            await getBooks(pageIndex, pageSize);
            setIsCreatingNewBook(false);
        } else {
            messageAPI.error("创建失败");
        }
    }

    const getBooks = async(index,size) => {
        let res;
        if (isFiltering){
            res = await getBookFilteredByTitle(filterKeyWord,index,size);
        }
        else
            res = await getBooksPageable(index,size);

        setBooks(res.books);
        setTotal(res.total_elements);
    }

    useEffect(() => {
        getBooks(pageIndex,pageSize);
    }, []);

    useEffect(()=>{
        getBooks(pageIndex,pageSize);
    },[pageIndex,filterKeyWord])

    useEffect(()=>{
        console.log(editingBook)

    },[editingBook])

    return (
        <>
            <Flex justify={"center"} gap={12}>
                <Button type={"primary"} onClick={()=>setIsCreatingNewBook(true)}>添加书籍</Button>
                <Search onSearch={(value)=>handleFilterBooks(value)} style={{width:"600px"}}/>
                {isFiltering?
                    <Button onClick={handleCancelFilter} icon={<CloseOutlined/>}/> :null}
            </Flex>

            <Table
                rowKey={"id"}
                expandable={{
                    // expandedRowKeys:editingRowKeys,
                    // expandRowByClick:true,
                    expandedRowRender:(record)=>{
                        return (
                            <Flex gap={"20px"}>
                                <div>
                                    <Image src={record.cover}
                                           style={{minWidth:"300px",minHeight:"400px",maxHeight:"300px",maxWidth:"400px"}}>
                                    </Image>
                                </div>
                                <Paragraph style={{whiteSpace:"pre-wrap"}}>
                                    {record.description}
                                </Paragraph>
                            </Flex>
                        )
                    }

                }}
                columns={columns}
                dataSource={books}
                pagination={{
                    total:total,
                    pageSize:pageSize,
                    current:pageIndex+1,
                    onChange:(page)=>{
                        setPageIndex(page-1);
                    }
                }}
            />


            <Modal
                open={isEditModalOpen}
                onCancel={closeModal}
                onOk={handleSumbitRevise}
                cancelText={"关闭"}
                okText={"提交"}
                title={"编辑图书"}
            >
                <Flex vertical={true} gap={12}>
                    <Row>
                        <Col span={2} style={{alignContent:"center"}}>
                            书名:
                        </Col>
                        <Col span={12}>
                            <Input
                                value={editingBook ? editingBook.title : null}
                                onChange={(e)=>setEditingBook({...editingBook,title:e.target.value})}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} style={{alignContent:"center"}}>
                            ISBN:
                        </Col>
                        <Col span={12}>
                            <Input
                                value={editingBook ? editingBook.isbn : null}
                                onChange={(e)=>setEditingBook({...editingBook,isbn:e.target.value})}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} style={{alignContent:"center"}}>
                            作者:
                        </Col>
                        <Col span={12}>
                            <Input
                                value={editingBook ? editingBook.author : null}
                                onChange={(e)=>setEditingBook({...editingBook,author:e.target.value})}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} style={{alignContent:"center"}}>
                            价格:
                        </Col>
                        <Col span={12}>
                            <InputNumber
                                value={editingBook?editingBook.price/100:0}
                                min={0}
                                step={"0.01"}
                                onChange={(value)=>{
                                    setEditingBook({...editingBook,price:value*100});
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} style={{alignContent:"center"}}>
                            库存:
                        </Col>
                        <Col span={12}>
                            <InputNumber
                                value={editingBook?editingBook.stock:0}
                                min={0}
                                step={"1"}
                                onChange={(value)=> {
                                    setEditingBook({...editingBook, stock: value})
                                }
                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col span={4} style={{alignContent:"center"}}>
                            出版日期:
                        </Col>
                        <Col span={10}>
                            <DatePicker
                                allowClear={false}
                                value={
                                dayjs(editingBook?editingBook.publish_date:0)}
                                onChange={(value)=>{
                                    let timestamp = Date.parse(new Date(value).toString());

                                    setEditingBook({...editingBook,publish_date:timestamp});
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} style={{alignContent:"center"}}>
                            出版社:
                        </Col>
                        <Col span={10}>
                            <Input
                                value={editingBook ? editingBook.publisher : null}
                                onChange={(e)=>setEditingBook({...editingBook,publisher:e.target.value})}
                            />
                        </Col>
                    </Row>
                </Flex>
                <Flex style={{marginTop:"10px"}}>
                    <Flex justify={"center"} style={{marginTop:"20px"}}>
                    <Upload
                        method={"POST"}
                        withCredentials={true}
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        maxCount={1}
                        action="http://localhost:8080/image/upload"
                        onChange={handleUploadChange}
                    >
                        {editingBook?
                            <img
                                src={editingBook.cover}
                                alt="cover"
                                // style={{width: '100%'}}
                                style={{
                                    width:"80px",
                                    height:"100px",
                                    objectFit:"contain"
                                }}
                            /> :
                            <button style={{border: 0, background: 'none'}} type="button">
                                {imageLoading ? <LoadingOutlined/> : <PlusOutlined/>}
                                <div style={{marginTop: 8}}>Upload</div>
                            </button>}
                    </Upload>
                </Flex>

                    <TextArea
                        rows={5}
                        placeholder="输入书籍简介"
                        value={editingBook?editingBook.description:null}
                        onChange={(e)=>setEditingBook({...editingBook,description:e.target.value})}
                    />
                </Flex>
            </Modal>

            <Modal
                open={isCreatingNewBook}
                onCancel={()=>setIsCreatingNewBook(false)}
                cancelText={"关闭"}
                onOk={handleCreateNewBook}
                okText={"创建"}
                title={"新建图书"}
            >
                <Flex vertical={true} gap={12}>
                    <Row>
                        <Col span={2} style={{alignContent:"center"}}>
                            书名:
                        </Col>
                        <Col span={12}>
                            <Input
                                value={creatingBook ? creatingBook.title : null}
                                onChange={(e)=>setCreatingBook({...creatingBook,title:e.target.value})}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} style={{alignContent:"center"}}>
                            ISBN:
                        </Col>
                        <Col span={12}>
                            <Input
                                value={creatingBook ? creatingBook.isbn : null}
                                onChange={(e)=>setCreatingBook({...creatingBook,isbn:e.target.value})}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} style={{alignContent:"center"}}>
                            作者:
                        </Col>
                        <Col span={12}>
                            <Input
                                value={creatingBook ? creatingBook.author : null}
                                onChange={(e)=>setCreatingBook({...creatingBook,author:e.target.value})}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} style={{alignContent:"center"}}>
                            价格:
                        </Col>
                        <Col span={12}>
                            <InputNumber
                                value={creatingBook?creatingBook.price/100:0}
                                min={0}
                                step={"0.01"}
                                onChange={(value)=>{
                                    setCreatingBook({...creatingBook,price:value*100});
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} style={{alignContent:"center"}}>
                            库存:
                        </Col>
                        <Col span={12}>
                            <InputNumber
                                value={creatingBook?creatingBook.stock:0}
                                min={0}
                                step={"1"}
                                onChange={(value)=> {
                                    setCreatingBook({...creatingBook, stock: value})
                                }
                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col span={4} style={{alignContent:"center"}}>
                            出版日期:
                        </Col>
                        <Col span={10}>
                            <DatePicker
                                allowClear={false}
                                value={
                                    dayjs(creatingBook?creatingBook.publish_date:0)}
                                onChange={(value)=>{
                                    let timestamp = Date.parse(new Date(value).toString());

                                    setCreatingBook({...creatingBook,publish_date:timestamp});
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} style={{alignContent:"center"}}>
                            出版社:
                        </Col>
                        <Col span={10}>
                            <Input
                                value={creatingBook ? creatingBook.publisher : null}
                                onChange={(e)=>setCreatingBook({...creatingBook,publisher:e.target.value})}
                            />
                        </Col>
                    </Row>
                </Flex>
                <Flex style={{marginTop:"10px"}}>
                    <Flex justify={"center"} style={{marginTop:"20px"}}>
                        <Upload
                            method={"POST"}
                            withCredentials={true}
                            name="file"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            maxCount={1}
                            action="http://localhost:8080/image/upload"
                            onChange={handleUploadChangeForCreating}
                        >
                            {creatingBook&&creatingBook.cover!=""?
                                <img
                                    src={creatingBook.cover}
                                    alt="cover"
                                    // style={{width: '100%'}}
                                    style={{
                                        width:"80px",
                                        height:"100px",
                                        objectFit:"contain"
                                    }}
                                /> :
                                <button style={{border: 0, background: 'none'}} type="button">
                                    {imageLoading ? <LoadingOutlined/> : <PlusOutlined/>}
                                    <div style={{marginTop: 8}}>Upload</div>
                                </button>}
                        </Upload>
                    </Flex>

                    <TextArea
                        rows={5}
                        placeholder="输入书籍简介"
                        value={creatingBook?creatingBook.description:null}
                        onChange={(e)=>setCreatingBook({...creatingBook,description:e.target.value})}
                    />
                </Flex>

            </Modal>

            {contextHolder}
</>
)


}