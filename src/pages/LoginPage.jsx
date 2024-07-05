import LoginForm from "../component/LoginForm";
import BasicLayout from "../component/BasicLayout";
import "../css/loginpage.css"
import {useEffect} from "react";
import RegisterForm from "../component/RegisterForm";

/**
 * 登陆界面
 * @returns {JSX.Element}
 * @constructor
 */
export default function LoginPage(){
    return(
        <BasicLayout>
            <div id={"loginpage-loginform-wrapper"}>
                <LoginForm/>
            </div>
        </BasicLayout>
    );
}