import {getRequest} from "./common";
import {BACK_END_URL} from "../utils/backend_url";

export const getUserOrderStatistic = async (start,end) => {
    try{
        const response = await getRequest(BACK_END_URL.GET_USER_STATISTIC,{
            start:start,
            end:end
        });
        if (response.status === "success"){
            return response.data;
        }
        else {
            throw new Error(response.msg);
        }
    }catch (e){
        const data = {
            book_rank:[],
            total_book_count:0,
            total_order:0,
            total_payment:0
        }
        return data;
    }
}

export const getTopBookStatistic = async(start,end,num)=>{
    try{
        const response = await getRequest(BACK_END_URL.GET_TOP_BOOK_STATISTIC,{
            start:start,
            end:end,
            num:num
        });
        if (response.status === "success"){
            return response.data;
        }
        else {
            throw new Error(response.msg);
        }
    }catch (e){
        const data = {
            top_books:[],
        }
        return data;
    }

}

export const getTopUserStatistic = async(start,end,num)=>{
    try{
        const response = await getRequest(BACK_END_URL.GET_TOP_USER_STATISTIC,{
            start:start,
            end:end,
            num:num
        });
        if (response.status === "success"){
            return response.data;
        }
        else {
            throw new Error(response.msg);
        }
    }catch (e){
        const data = {
            top_users:[],
        }
        return data;
    }
}