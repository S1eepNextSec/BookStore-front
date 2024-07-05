import BasicLayout from "../component/BasicLayout";
import RegisterForm from "../component/RegisterForm";

export default function RegisterPage(){
    return (
        <>
            <BasicLayout>
                <div id={"loginpage-loginform-wrapper"}>
                    <RegisterForm/>
                </div>
            </BasicLayout>
        </>
)
}