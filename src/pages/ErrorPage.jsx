import {Button, Result} from "antd";
import {SmileOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

export default function ErrorPage(){
    const navi = useNavigate();
    return (
        <Result
            icon={<SmileOutlined/>}
            title={"您进入到了奇怪的地方"}
            extra={<Button onClick={()=>{navi("/books")}}>回到主页</Button>}
        />

    );
}