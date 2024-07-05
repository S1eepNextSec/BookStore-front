import BasicLayout from "../component/BasicLayout";
import OrderTable from "../component/OrderTable";
import {useEffect, useState} from "react";

/**
 * 订单界面
 * @returns {JSX.Element}
 * @constructor
 */
export default function OrderPage(){
    return (
        <BasicLayout defaultKey={'order'}>
            <OrderTable/>
        </BasicLayout>
    )
}