import {Flex, Pagination, Table} from "antd";
import React, {useEffect, useState} from "react";
import {banUser, getAllUserInfoInAdminMode, releaseUser} from "../service/manage";
import {
    CheckOutlined,
    CloseCircleFilled,
    CloseOutlined,
    DiscordOutlined,
    SlackSquareOutlined,
    UserOutlined
} from "@ant-design/icons";
import useMessage from "antd/es/message/useMessage";

export default function UserManageTable(){
    const columns=[
        {
            title:"昵称",
            dataIndex:"name",
            key:"name",
        },
        {
            title:"账户",
            dataIndex:"account",
            key:"account",
        },
        {
            title:"邮箱",
            dataIndex:"email",
            key:"email",
        },
        {
            title:"账户状态",
            dataIndex:"status",
            key:"status",
            render:(item,record)=>(
                item === true?
                    <span style={{color:"green"}}>
                        <CheckOutlined/>
                        正常
                    </span>:
                    <span style={{color:"red"}}>
                        <CloseOutlined/>
                        封禁
                    </span>
            )
        },
        {
            title:"权限",
            dataIndex:"isAdmin",
            key:"admin",
            render:(item,record)=>(
                item ===true?
                    <span style={{color:"blue"}}>
                        <UserOutlined/>
                        管理员
                    </span>:
                    "普通用户"
            )
        },
        {
            title:"操作",
            dataIndex:"action",
            key:"action",
            render:(item,record)=>(
                (record!==null && record.isAdmin ===false)?(
                    record.status === true?(
                        <a onClick={()=>{
                            handleBanUser(record.id)
                        }}>
                            封禁
                        </a>
                    ):
                        (<a onClick={()=>{
                            handleReleaseUser(record.id)
                        }}>
                            解禁
                        </a>))
                    :null
            )
        }
    ]

    const [pageIndex,setPageIndex] = useState(0);
    const pageSize = 10;
    const [totalElements,setTotalElements] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const [users,setUsers] = useState([]);

    const [messageAPI,contextHolder] = useMessage();

    const getUserInfo = async(index,size)=>{
        const data = await getAllUserInfoInAdminMode(index,size);
        // console.log(data)
        setTotalElements(data.total_elements);
        setTotalPages(data.total_pages);
        setUsers(data.users);
    }

    const handleBanUser= async(user_id)=>{
        const isSuccess = await banUser(user_id);

        if (isSuccess){
            messageAPI.open({type:"success",content:"封禁成功"});
            const new_users = users.map((item)=>{
                if (item.id === user_id){
                    item.status = false;
                }
                return item;
            })
            console.log(new_users)
            setUsers(new_users);
        }
        else{
            messageAPI.open({type:"error",content:"封禁失败"});
        }
    }

    const handleReleaseUser = async(user_id)=>{
        const isSuccess = await releaseUser(user_id);

        if (isSuccess){
            messageAPI.open({type:"success",content:"解禁成功"});

            const new_users = users.map((item)=>{
                if (item.id === user_id){
                    item.status = true;
                }
                return item;
            })
            setUsers(new_users);
        }
        else{
            messageAPI.open({type:"error",content:"解禁失败"});
        }
    }

    useEffect(() => {
        getUserInfo(0,pageSize);
    }, []);

    useEffect(()=>{
        getUserInfo(pageIndex,pageSize);
    },[pageIndex])

    return (
        <>
            {contextHolder}
            <Table
                columns={columns}
                dataSource={users}
                pagination={false}
            />

            <Flex justify={"center"}>
                <Pagination
                    style={{
                        marginTop:"20px",
                    }}
                    current={pageIndex+1}
                    pageSize={pageSize}
                    total={totalElements}
                    onChange={(page)=>{
                        setPageIndex(page-1)
                    }}

                />
            </Flex>
        </>


    )
}