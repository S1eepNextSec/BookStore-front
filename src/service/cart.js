import {deleteRequest, getRequest, postRequest, putRequest} from "./common";
import {BACK_END_URL} from "../utils/backend_url";
import {debounce} from "../utils/debounce";

export async function getCartItems(cart_id){
    try {
        const json = await getRequest(BACK_END_URL.GET_USER_CART_ALL,
            {
                cart_id:cart_id,
            }
        );

        if (json.status=="success"){
            console.log(json)
            return json.data;
        }
        else {
            throw Error("get cart items failed");
        }
    }
    catch (e){
        const cart_data = {
            cart_items:[],
            cart_id:0,
        }
        return cart_data;
    }
}

export async function deleteCartItems(cartItem_id){
    try{
        const json = await deleteRequest(BACK_END_URL.DELETE_CART_ITEM,{cartItem_id:cartItem_id});

        if(json.status =="success"){
            return true;
        }
        else throw Error("delete cart item failed");
    }
    catch(e){
        return false;
    }

}

export const debounceUpdateQuantity = debounce(
    async (handleArray,pendingArray,setPendingArray)=>{
        console.log("触发")
        try {
            const data = {
                itemQuantityPair:handleArray
            };
            console.log("发送请求");
            const response = await putRequest(BACK_END_URL.PUT_UPDATE_CART, data);
            console.log(response)
            if (response.status === "success") {
                setPendingArray(pendingArray.filter(item => !handleArray.includes(item)));
            }
        }catch (e) {
            console.log("异常")
        }
    },
    1000
)

export async function deleteCartItemsBatch(cartItemList){
    try{
        const json = await deleteRequest(BACK_END_URL.DELETE_CART_ITEM_BATCH,{cartItem_id_list:cartItemList});

        if(json.status =="success"){
            return true;
        }
        else throw Error("delete cart item failed");
    }
    catch(e){
        return false;
    }
}