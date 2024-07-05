import BasicLayout from "../component/BasicLayout";
import Profile from "../component/Profile";

/**
 * 用户信息界面
 * @returns {JSX.Element}
 * @constructor
 */
export default function UserPage(){
    return (
        <BasicLayout defaultKey={'user'}>
            <Profile/>
        </BasicLayout>
    );
}
