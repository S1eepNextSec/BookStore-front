import React, {useContext, useEffect, useState} from 'react';
import {Button, Divider, Form, Input, message} from "antd";
import "../css/loginform.css"
import {getRequest} from "../service/common";
import {login} from "../service/login";
// import {UserContext} from "./UserContext";
import {redirect} from "react-router";
import {BACK_END_URL} from "../utils/backend_url";
import {getBookById} from "../service/book";
import {useNavigate} from "react-router-dom";
import {UserContext} from "./UserContext";

export default function LoginForm(){
    const navi = useNavigate();
    const [form] = Form.useForm();
    const [messageAPI,contextHolder]=message.useMessage();
    const userContext = useContext(UserContext);


    const handleLogin = async()=>{

        const account = form.getFieldValue("account");
        const password = form.getFieldValue("password");

        if (account ==="" || password ==="" || account === undefined || password === undefined) {
            messageAPI.error("请输入账户和密码")
            return
        }

        const json = await login(account,password);
        if (json.status === "success"){
            userContext.setUser(json.data)
            messageAPI.open({type: 'success', content: '登录成功', duration: 1})
            setTimeout(()=>{navi("/books")},1000)
        }
        else{
            messageAPI.open({type: 'error', content: json.msg, duration: 2})
        }

    }

    return (
        <div id={"login-form-wrapper"}>
            {contextHolder}
            <div id={"login-form-title"}>
                <span id={"login-form-title-text"}>Book Store</span>
            </div>
            <Divider orientation={"center"} id={"login-form-divider"} >welcome</Divider>
            <Form
                form={form}
                name={"login-form"}
                id={"login-form"}
            >
                <Form.Item
                    name={"account"}
                    label = "账号"
                    className={"login-form-input"}
                    rules={[{
                        required:true
                    }]}>
                    <Input>
                    </Input>
                </Form.Item>

                <Form.Item
                    name={"password"}
                    label = "密码"
                    className={"login-form-input"}
                    rules={[{
                        required:true
                    }]}>
                    <Input type="password">
                    </Input>
                </Form.Item>

                <Form.Item name={"link"} id={"login-form-link"}>
                    <a onClick={()=>{navi("/register")}} id={"form-register-link"}>注册</a>
                    {/*<a id={"form-forget-link"}>忘记密码</a>*/}
                </Form.Item>
                <Form.Item name={"button"}>
                    <Button
                        type={"primary"}
                        id={"form-button"}
                        htmlType={"submit"}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )

}