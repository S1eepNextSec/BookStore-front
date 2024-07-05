import {Navigate, redirect, Route, Routes} from "react-router";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import PersonalRankPage from "../pages/PersonalRankPage";
import OrderPage from "../pages/OrderPage";
import BookPage from "../pages/BookPage";
import UserPage from "../pages/UserPage";
import {authenticate} from "../service/common";
import {useNavigate} from "react-router-dom";
import {Component, useEffect, useState} from "react";
import BookDetail from "../component/BookDetail";
import {UserContext} from "../component/UserContext";
import ErrorPage from "../pages/ErrorPage";
import RegisterPage from "../pages/RegisterPage";
import BookManagePage from "../pages/BookManagePage";
import UserManagePage from "../pages/UserManagePage";
import OrderManagePage from "../pages/OrderManagePage";
import ConsumeRankPage from "../pages/ConsumeRankPage";

/**
 * 利用React Router来配置路由
 * @returns {JSX.Element}
 * @constructor
 */
export default function AppRouter(){
    //index->默认
    //path->路径
    //element->展示的页面
    return (
        <Routes>
            <Route index element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/books" element={<HomePage/>}/>
            <Route path="/order" element={<OrderPage/>}/>
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/rank" element={<PersonalRankPage/>}/>
                <Route path="/books/:id" element={<BookPage/>}/>
            <Route path="/user" element={<UserPage/>}/>
            <Route path="/*" element={<ErrorPage/>}/>
            <Route path="/manage/book" element={<BookManagePage/>}/>
            <Route path="/manage/user" element={<UserManagePage/>}/>
            <Route path="/manage/order" element={<OrderManagePage/>}/>
            <Route path="/manage/rank" element={<ConsumeRankPage/>}/>
        </Routes>
    );
}