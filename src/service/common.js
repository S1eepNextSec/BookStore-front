import {BACK_END_URL} from "../utils/backend_url";
import Unauthorized from "antd/es/result/unauthorized";
import cookie from "react-cookies"
export async function getRequest(url, data)
{
    // let token = null
    // token = cookie.load("token")

    // let token = localStorage.getItem("token");
    // console.log("token:"+token)
    let option = {
        method:"GET",
        headers:{
            'Content-Type':'application/json',
            // ...(token && {'Authorization':`${token}`}),
            'Access-Control-Allow-Origin':'*'
        },
        mode:"cors",
        credentials:"include",
    }
    if (data !=null)
        url = url + "?"+new URLSearchParams(data).toString();

    const response = await fetch(url,option);

    return response.json();
}

export async function deleteRequest(url, data)
{
    // let token = null
    // token = cookie.load("token")

    // let token = localStorage.getItem("token");
    // console.log("token:"+token)
    let option = {
        method:"DELETE",
        headers:{
            'Content-Type':'application/json',
            // ...(token && {'Authorization':`${token}`}),
            // 'Access-Control-Allow-Origin':'*'
        },
        mode:"cors",
        credentials:"include",
    }

    url = url + "?"+new URLSearchParams(data).toString();
    const response = await fetch(url,option);

    return response.json();
}

export async function putRequest(url, data)
{
    // let token = null
    // token = cookie.load("token")
    // token = localStorage.getItem("token");

    let option={
        method:"PUT",
        headers:{
            'Content-Type':'application/json',
            // ...(token && {'Authorization':`${token}`}),
            // 'Access-Control-Allow-Origin':'*'
        },
        body:JSON.stringify(data),
        mode:"cors",
        credentials: "include",
    }
    console.log(option);
    const response = await fetch(url, option);

    return response.json();
}

export async function postRequest(url, data)
{
    // let token = null
    // token = cookie.load("token")
    // token = localStorage.getItem("token");

    let option={
        method:"POST",
        headers:{
            'Content-Type':'application/json',
            // ...(token && {'Authorization':`${token}`}),
            // 'Access-Control-Allow-Origin':'*'
        },
        body:JSON.stringify(data),
        mode:"cors",
        credentials: "include",
    }

    const response = await fetch(url, option);

    return response.json();
}

export async function authenticate()
{
    // let token = localStorage.getItem("token");
    // let token = cookie.load("token")

    let option = {
        method:"GET",
        headers:{
            'Content-Type':'application/json',
            // ...(token && {'Authorization':`${token}`}),
            // 'Access-Control-Allow-Origin':'*'
        },
        mode:"cors",
        credentials:"include",
    }

    const response = await fetch(BACK_END_URL.AUTHENTICATE,option);

    if (response.status==401){
        return false;
    }

    return true;
}
