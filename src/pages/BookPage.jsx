import BasicLayout from "../component/BasicLayout"
import BookDetail from "../component/BookDetail"
import {Button, Card} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router";
import ErrorPage from "./ErrorPage";

/**
 * 书籍详细信息页面
 * @returns {JSX.Element}
 * @constructor
 */
export default function BookPage(){
    const navi =useNavigate();
    const handleReturnBtnClick= ()=>{
        navi(-1);
    }

    const {id} = useParams();
    const ID = parseInt(id);


    if (isNaN(ID)) {
        return (
            <BasicLayout defaultKey={'home'}>
                <Card>
                    <ErrorPage/>
                </Card>
            </BasicLayout>
        )
    }
    else {
        return (
            <BasicLayout defaultKey={'home'}>
                <Card>
                    <Button
                        icon={<ArrowLeftOutlined/>}
                        onClick={handleReturnBtnClick}
                    >
                        返回
                    </Button>
                    <BookDetail/>
                </Card>
            </BasicLayout>
        )
    }
}