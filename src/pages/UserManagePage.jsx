import BasicLayout from "../component/BasicLayout";
import UserManageTable from "../component/UserManageTable";

export default function UserManagePage(){
    return (
        <>
            <BasicLayout defaultKey={"user-manage"}>
                <UserManageTable/>
            </BasicLayout>
        </>
    )
}