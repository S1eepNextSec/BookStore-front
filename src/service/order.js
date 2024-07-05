import {getRequest, postRequest} from "./common";
import {BACK_END_URL} from "../utils/backend_url";

export async function createNewOrder(orderInfo){
    try {
        console.log(orderInfo)
        const response = await postRequest(BACK_END_URL.POST_CREATE_ORDER, orderInfo);
        console.log(response);

        return response;

        // if (response.status === "success")
        //     return true;
        // else
        //     return false;
    }
    catch(e){
        return {
            status: "failed",
            msg: "创建订单失败",
            data: null
        }

        // return false;
    }
}

export async function searchOrder(user_id,page_index,page_size){
    try {
        const response_data = await getRequest(BACK_END_URL.ORDER_SEARCH,
            {user_id:user_id,
                page:page_index,
                size:page_size}
        );

        console.log(response_data);

        return response_data.data;
    }
    catch (e) {
        const order = {
            orders:[],
            total_elements:0
        }
        return order;
    }
}

export async function filterOrderByTime(start,end,page_index,page_size){
    try{
        console.log(start);
        console.log(end)
        const response_data = await getRequest(BACK_END_URL.GET_ORDER_FILTER_BY_TIME,
            {
                start_date:start,
                end_date:end,
                page:page_index,
                size:page_size
            });

        console.log(response_data);
        if (response_data.status==="success")
            return response_data.data;
        else throw new Error("get order failed");
    }
    catch(e){
        const order={
            orders:[],
            total_elements: 0
        }
        return order;
    }
}

export async function filterOrderByBookTitle(keyword,page_index,page_size){
    try{
        const response_data = await getRequest(BACK_END_URL.GET_ORDER_FILTER_BY_TITLE,
            {
                title:keyword,
                page:page_index,
                size:page_size
            });

        if (response_data.status==="success")
            return response_data.data;
        else throw new Error("get order failed");
    }
    catch(e){
        const order={
            orders:[],
            total_elements: 0
        }
        return order;
    }
}