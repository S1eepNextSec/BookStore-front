import logo from './logo.svg';
import BasicLayout from "./component/BasicLayout";
import LoginForm from "./component/LoginForm"
import LoginPage from "./pages/LoginPage";

import image from "./img/尾随者.jpg"
import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage"
import BookDetail from "./component/BookDetail";
import {Route, Routes} from "react-router";
import CartPage from "./pages/CartPage";
import PersonalRankPage from "./pages/PersonalRankPage";
import OrderPage from "./pages/OrderPage";
import {CartTable} from "./component/CartTable";
import UserPage from "./pages/UserPage";
import ErrorPage from "./pages/ErrorPage";
import AppRouter from "./router/Router";
import {ConfigProvider} from "antd";
import {WebSocketProvider} from "./component/WebSocketContext";
function App() {
  return (
      <WebSocketProvider>
        <AppRouter/>
      </WebSocketProvider>
  );
}

export default App;
