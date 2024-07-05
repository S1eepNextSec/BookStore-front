import {
    Avatar,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Flex,
    Image,
    Input,
    Row,
    Space,
    Typography,
    Upload
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import {useContext, useEffect, useState} from "react";
import "../css/profile.css"
import Meta from "antd/es/card/Meta";
import {updateFileList} from "antd/es/upload/utils";
import LoadingIcon from "antd/es/button/LoadingIcon";
import TextArea from "antd/es/input/TextArea";
import {UserInfo} from "../utils/fakeData";
import {UserContext} from "./UserContext";
import {getUserProfile, updateUserProfile} from "../service/user";
import useMessage from "antd/es/message/useMessage";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";


/**
 * 个人信息展示页
 * @returns {JSX.Element}
 * @constructor
 */
export default function Profile(){
    const [name,setName] = useState("");
    const [phone,setPhone] = useState("");
    const [email,setEmail] = useState("");
    const [signature,setSignature] = useState("");
    const [avatar,setAvatar] = useState("");
    const [level,setLevel] = useState(0);
    const [balance,setBalance] = useState(0);
    const [userProfile,setUserProfile] = useState({});

    const [imageUrl, setImageUrl] = useState();
    const [imageLoading,setImageLoading] = useState()

    const [messageAPI,contextHolder] = useMessage();

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
                setAvatar(info.file.response.data.url)

            getBase64(info.file.originFileObj, (url) => {
                setImageLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleGetProfile=async()=>{
        const profile = await getUserProfile();

        setUserProfile(profile);
        setName(profile.name);
        setPhone(profile.phone);
        setEmail(profile.email);
        setSignature(profile.signature);
        setAvatar(profile.avatar);
        setLevel(profile.level);
        setBalance(profile.balance);
    }

    const items = [
        {
            label:"姓名",
            children:
                <Input
                    value={name}
                    onChange ={(e)=>{setName(e.target.value)}}
                />,
            span:1,//占据的列数
        },
        {
            label:"等级",
            children:"Lv."+level,
            span:1,
        },
        {
            label:"余额",
            children:"￥"+balance/100,
            span:1,
        },

        {
            label:"联系电话",
            children:
                <Input
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                />,
            span:1
        },
        {
            label:"邮箱",
            children:
                <Input
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />,
            span:2,
        },

        {
            label:"个性签名",
            children:
                <TextArea
                    rows={5}
                    placeholder="输入个性签名"
                    maxLength={150}
                    value={signature}
                    onChange={(e)=>setSignature(e.target.value)}
                />,
            span:3
        }
    ]

    const handleRollBackClick= ()=>{
        try {
            setName(userProfile.name);
            setPhone(userProfile.phone);
            setEmail(userProfile.email);
            setSignature(userProfile.signature);
            setAvatar(userProfile.avatar);
            setLevel(userProfile.level);
            setBalance(userProfile.balance);

            messageAPI.open({type:"success",content:"还原成功",duration:1});
        }
        catch (e){
            messageAPI.open({type:"error",content:"还原失败",duration:1});
        }
    }

    const handleSaveClick=async()=>{
        const profile = {
            name:name,
            phone:phone,
            email:email,
            signature:signature,
            avatar:avatar,
            level:level,
            balance:balance,
        }
        setUserProfile(profile);

        const isUpdateSuccess = await updateUserProfile(profile);

        if (isUpdateSuccess){
            messageAPI.open({type:"success",content:"保存成功",duration:1});
        }
        else {
            messageAPI.open({type:"error",content:"保存失败",duration:1});
        }
    }

    useEffect(()=> {
        handleGetProfile()
    },[])

    useEffect(()=>{
        console.log(avatar)
    },[avatar])

    return (
        <Card>
            {contextHolder}
            <Flex
                justify={"space-evenly"}
                align={"center"}
                style={{height:"600px"}}
            >
                <Flex vertical justify={"center"}>
                    <img
                        src={avatar}
                        width={300}
                        height={300}
                        style={{objectFit:"cover"}}
                    />

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
                            {imageUrl ?
                                <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> :
                                <button style={{border: 0, background: 'none'}} type="button">
                                    {imageLoading ? <LoadingOutlined/> : <PlusOutlined/>}
                                    <div style={{marginTop: 8}}>Upload</div>
                                </button>}
                        </Upload>
                    </Flex>
                </Flex>

                <Descriptions
                    title={"个人信息"}
                    items={items}
                    bordered
                    layout={"vertical"}
                    column={3}
                    style={{width:"70%"}}
                />
            </Flex>
            <Divider/>
            <Row justify={"center"}>
                <Col span={4}>
                    <Button onClick = {handleSaveClick} type={"primary"}>
                        保存
                    </Button>
                </Col>
                <Col span={4}>
                    <Button onClick ={handleRollBackClick}>
                        还原
                    </Button>
                </Col>
            </Row>
        </Card>
    );
}