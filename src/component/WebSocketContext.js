// WebSocketContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {message} from "antd";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const socketUrl = "ws://localhost:8080/ws";
    const socketRef = useRef(null); // 使用 useRef 来保持对 WebSocket 实例的引用
    const [isConnected, setIsConnected] = useState(false); // 管理连接状态
    const [messageAPI,contextHolder]=message.useMessage();

    const connect = (id) => {
        // 如果 socketRef.current 存在，说明连接已建立，直接返回
        if (socketRef.current) {
            console.log("WebSocket 已连接，跳过重连");
            return;
        }

        // 创建新的 WebSocket 连接
        const newSocket = new WebSocket(socketUrl + "/" + id);

        newSocket.onopen = () => {
            console.log("WebSocket 连接成功");
            setIsConnected(true);
        };

        newSocket.onclose = () => {
            console.log("WebSocket 连接关闭");
            setIsConnected(false);
            socketRef.current = null; // 清空引用，以便后续重新建立连接
        };

        newSocket.onerror = (error) => {
            console.log("WebSocket 连接错误", error);
        };

        newSocket.onmessage = (event) => {
            //将data转换为json格式对象
            let data = JSON.parse(event.data);
            if (data.status == "success") {
                messageAPI.success(data.message);
            } else {
                messageAPI.error(data.message);
            }
        };

        socketRef.current = newSocket; // 保存 WebSocket 实例
    };

    const disconnect = ()=>{
        if (socketRef.current) {
            socketRef.current.close();
            console.log("WebSocket连接已关闭");
        }
    }
    // 在组件卸载时关闭连接
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                console.log("WebSocket连接已关闭");
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket: socketRef.current, connect, isConnected,disconnect }}>
            {contextHolder}
            {children}
        </WebSocketContext.Provider>
    );
};