import {BACK_END_URL} from "../utils/backend_url";
import {getRequest, postRequest} from "./common";
import cookie from "react-cookies";
import {useNavigate} from "react-router-dom";

export async function login(account,password){
    try {
        const loginJson = await postRequest(BACK_END_URL.LOGIN, {account: account, password: password});

        return loginJson;
    }catch(e){
        return{
            status: "fail",
            msg: "登录失败",
            data:null
        }
    }
}

export async function logout(){
    // getRequest(BACK_END_URL.LOG_OUT);
    try{
        const logoutJson = await getRequest(BACK_END_URL.LOG_OUT);

        return logoutJson.data;
    } catch(e){
        return {
            duration:"0小时0分钟0秒",
        }
    }
}

export async function register(user_info){
    try {
        const registerJson = await postRequest(BACK_END_URL.REGISTER, user_info);

        if (registerJson.status === "success") {
            return {
                isRegistered: true,
                message: "注册成功"
            }
        } else {
            return {
                isRegistered: false,
                message: registerJson.msg
            }
        }
    }
    catch(e){
        return {
            isRegistered: false,
            message: "注册失败"
        }
    }
}