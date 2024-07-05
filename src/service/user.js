import {getRequest, putRequest} from "./common";
import {BACK_END_URL} from "../utils/backend_url";
export async function getUserInfo(){
    try {
        const json = await getRequest(BACK_END_URL.GET_USER_INFO);
        console.log(json)
        return json.data;
    }
    catch (e) {
        return null;
    }
}

export async function getUserProfile(){
    try{
        const json = await getRequest(BACK_END_URL.GET_USER_PROFILE);
        console.log(json)
        return json.data;
    }
    catch (e) {
        return null;
    }
}

export async function updateUserProfile(profile){
    try{
        const json = await putRequest(BACK_END_URL.UPDATE_USER_PROFILE, profile);

        if (json.status === "success")
            return true;
        else
            return false;
    }
    catch (e) {
        return false;
    }
}