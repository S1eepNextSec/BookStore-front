import {Button, Card, Flex, Form, Input, message} from "antd";
import {register} from "../service/login";
import useMessage from "antd/es/message/useMessage";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {BackwardOutlined, LeftOutlined} from "@ant-design/icons";

export default function RegisterForm(){
    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 8,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 16,
            },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };
    const [messageAPI,contextHolder] = useMessage();
    const navi = useNavigate()
    const [isLoading,setIsLoading] = useState(false)

    const doLogin = async ()=>{
        setIsLoading(true)
        const account = form.getFieldValue("account");
        const password = form.getFieldValue("password");
        const email = form.getFieldValue("email");
        const user_info = {
            account: account,
            password: password,
            email: email
        }
        const result = await register(user_info)

        if (result.isRegistered === true){
            messageAPI.open({type:"success",content:"注册成功"})
            setTimeout(()=>{
                navi("/login")
            },1000)
        }
        else{
            messageAPI.open({type:"error",content:result.message})
        }
        setIsLoading(false)
    }
    return (
        <Card style={{
            width:"500px",
            height:"400px",
        }}
              title={
            <Flex gap={10} align={"center"}>
                <Button
                    icon={<LeftOutlined/>}
                    onClick={()=>navi("/login")}
                />
                注册
            </Flex>
        }
        >
            {contextHolder}
            <Flex justify={"center"}>
                <Form
                    form = {form}
                    {...formItemLayout}
                    onFinish={doLogin}
                >
                    <Form.Item
                        name={"account"}
                        label={"用户名"}
                        rules={[
                            {
                                required:true,
                                message:"请输入用户名"
                            },
                        ]}>
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入你的密码',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="确认密码"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '请重复你的密码',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("密码不一致"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name={"email"}
                        label={"邮箱"}
                        rules={[
                            {
                                required:true,
                                message:"请输入邮箱"
                            },
                            {
                                type:"email",
                                message:"请输入正确的邮箱格式"
                            }
                        ]}>
                        <Input/>
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button
                            style={{
                                backgroundColor:"black"
                            }}
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                        >
                            注册
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
        </Card>
    );
}