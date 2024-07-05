import BasicLayout from "../component/BasicLayout";
import OrderManageTable from "../component/OrderManageTable";

export default function OrderManagePage(){
    return (
        <>
            <BasicLayout>
                <OrderManageTable/>
            </BasicLayout>
        </>
    )
}