import BasicLayout from "../component/BasicLayout";
import {CartTable} from "../component/CartTable";
import {Button, Card, Divider, Flex} from "antd";
import Search from "antd/es/input/Search";

/**
 * 购物车页面
 * @returns {JSX.Element}
 * @constructor
 */
export default function CartPage(){
    return (
       <BasicLayout defaultKey={'cart'}>
           <Card>
               <CartTable/>
           </Card>
       </BasicLayout>
    );
}