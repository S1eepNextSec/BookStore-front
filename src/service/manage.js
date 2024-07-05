import {BACK_END_URL} from "../utils/backend_url";
import {getRequest, putRequest} from "./common";

export const getAllUserInfoInAdminMode = async(page_index,page_size)=>{
    try{
        const json = await getRequest(BACK_END_URL.GET_ALL_USER_INFO_IN_ADMIN_MODE,{
            page_index:page_index,
            page_size:page_size
        });
        if (json.status === "success"){
            return json.data;
        }
        else{
            throw new Error("Failed to get all user info in admin mode");
        }
    }
    catch(e){
        return {
            total_elements:0,
            total_pages:0,
            users:[]
        };
    }
}

export const banUser = async(user_id)=>{
    try{
        const json = await getRequest(BACK_END_URL.BAN_USER,{
            user_id:user_id
        });
        if (json.status === "success"){
            return true;
        }
        else{
            throw new Error(json.msg);
        }
    }
    catch(e){
        return false;
    }
}
export const releaseUser = async(user_id)=>{
    try{
        const json = await getRequest(BACK_END_URL.RELEASE_USER,{
            user_id:user_id
        });
        if (json.status === "success"){
            return true;
        }
        else{
            throw new Error(json.msg);
        }
    }
    catch(e){
        return false;
    }
}

export const getOrderInfoInAdminMode = async(page_index,page_size)=>{
    try{
        const json = await getRequest(BACK_END_URL.GET_ORDER_INFO_IN_ADMIN_MODE,{
            page_index:page_index,
            page_size:page_size
        });
        if (json.status === "success"){
            return json.data;
        }
        else{
            throw new Error("Failed to get order info in admin mode");
        }
    }
    catch(e){
        return {
            total_elements:0,
            total_pages:0,
            orders:[]
        };
    }
}

export const getOrderInfoInAdminModeByTime = async(start,end,page_index,page_size)=>{
    try{
        const json = await getRequest(BACK_END_URL.GET_ORDER_INFO_IN_ADMIN_MODE_BY_TIME,{
            start:start,
            end:end,
            page_index:page_index,
            page_size:page_size
        });
        if (json.status === "success"){
            return json.data;
        }
        else{
            throw new Error("Failed to get order info in admin mode");
        }
    }
    catch(e){
        return {
            total_elements:0,
            total_pages:0,
            orders:[]
        };
    }
}

export const getOrderInfoInAdminModeByTitle= async(title,page_index,page_size)=>{
    try{
        const json = await getRequest(BACK_END_URL.GET_ORDER_INFO_IN_ADMIN_MODE_BY_TITLE,{
            title:title,
            page_index:page_index,
            page_size:page_size
        });
        if (json.status === "success"){
            return json.data;
        }
        else{
            throw new Error("Failed to get order info in admin mode");
        }
    }
    catch(e){
        return {
            total_elements:0,
            total_pages:0,
            orders:[]
        };
    }

}