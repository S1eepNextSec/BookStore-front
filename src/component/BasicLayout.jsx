import React, {useContext, useEffect, useState} from 'react';
import {Button, Dropdown, Flex, Layout, Menu} from 'antd';
import {Content, Footer, Header} from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import '../css/layout.css'
import MenuItem from "antd/es/menu/MenuItem";
import Icon from "antd/es/icon";
import {
    RocketOutlined,
    CommentOutlined,
    CoffeeOutlined,
    BookOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    SolutionOutlined,
    BarChartOutlined,
    LogoutOutlined, DollarOutlined, TeamOutlined, ProfileOutlined, MoneyCollectOutlined
} from '@ant-design/icons';
import {Link, useLocation, useNavigate} from "react-router-dom";
import UserProvider, {UserContext} from "./UserContext";
import {redirect} from "react-router";
import {authenticate} from "../service/common";
import {getUserInfo} from "../service/user";
import {logout} from "../service/login";

/**
 * BasicLayout
 * 所有页面的布局框架
 * 带有导航栏
 * @param children 内容部分要展示的组件
 * @param defaultKey 标识所在页面的默认键
 * @returns {Element}
 * @constructor
 */
export default function BasicLayout({children,defaultKey}){
    const location = useLocation();
    const navi = useNavigate()
    const isLoginPage = location.pathname === "/login" || location.pathname ==="/register"
    const [auth,setAuth] = useState(false);
    const [user,setUser] = useState(null);
    const [isAdmin,setIsAdmin] = useState(false);

    /**
     * 导航栏中条目的对象数组
     * label:展示的内容
     * key:唯一标识这个条目的键
     * icon:图标（直接用antDesign提供的图标）
     */
    const itemsNavi=[
        {
            label:<Link to={"/books"}>主页</Link>,//利用React Router的Link,点击后通过路由跳转到配置好的页面
            key:'home',
            icon:<BookOutlined />
        },
        {
            label:<Link to={"/cart"}>购物车</Link>,
            key:'cart',
            icon:<ShoppingCartOutlined />
        },
        {
            label:<Link to={"/order"}>订单</Link>,
            key:'order',
            icon:<SolutionOutlined />
        },
        {
            label:<Link to={"/rank"}>排行</Link>,
            key:'rank',
            icon:<BarChartOutlined />
        },
        isAdmin?{
            label:<Link to={"/manage/user"}>用户管理</Link>,
            key:"user-manage",
            icon:<TeamOutlined/>
        }:null,
        isAdmin?{
            label:<Link to={"/manage/book"}>书籍管理</Link>,
            key:"book-manage",
            icon:<ProfileOutlined/>
        }:null,
        isAdmin?{
            label:<Link to={"/manage/order"}>订单管理</Link>,
            key:"order-manage",
            icon:<ProfileOutlined/>
        }:null,
        isAdmin?{
            label:<Link to={"/manage/rank"}>消费排行</Link>,
            key:"rank-manage",
            icon:<MoneyCollectOutlined/>
        }:null,
    ];

    /**
     * 下拉菜单栏
     * 构造一个数组作为drop down组建的源
     * @type {[{icon: React.JSX.Element, label: React.JSX.Element, key: string},{type: string},{icon: React.JSX.Element, label: React.JSX.Element, key: string},{type: string},{icon: React.JSX.Element, label: string, danger: string, key: string}]}
     */
    const dropList = [
        {
            key:"name",
            label:<Flex>用户:{user?user.username:""}</Flex>,
            icon:<UserOutlined/>
        },
        {
            type:"divider"
        },
        {
            key:"balance",
            label:<Flex>余额:{(user?user.balance:0)/100}元</Flex>,
            icon:<DollarOutlined/>
        },
        {
            type:"divider"
        },
        {
            key:"logout",
            label:"登出",
            icon:<LogoutOutlined/>,
            onClick:()=>{
                logout();

                navi("/login")
            },
            danger:"true"
        },
    ];



    const checkLogin= async ()=>{
        const userInfo = await getUserInfo();
        if (userInfo == null) {
            navi("/login")
        }
        else {
            const isAdminAuthInNeed = location.pathname.startsWith("/manage");
            if (isAdminAuthInNeed && !userInfo.isAdmin) {
                navi("/books")
            }
            setAuth(true)
            setUser(userInfo);
            setIsAdmin(userInfo.isAdmin)
            console.log(userInfo)
        }
    }

    useEffect(() => {
        if (!isLoginPage)
            checkLogin();

        console.log(user)
    }, []);

    return (
        <UserContext.Provider value={{user,setUser}}>
            <Layout id={"layout-wrapper"}>
                <Header id={"layout-header"}>
                    <Flex>
                        <div id={"layout-header-logo"}>
                            Book Store
                        </div>
                        {<Menu
                            theme={"light"}
                            defaultSelectedKeys={defaultKey}//设置选中的条目
                            items={itemsNavi}
                            mode={"horizontal"}
                            id={"layout-header-menu"}
                        />}
                    </Flex>
                    <div id={"layout-header-rightBlock"}>
                        {auth?(<Dropdown
                                menu={{items:dropList}}
                                placement={"topRight"}
                                arrow
                            >
                                <Link to={"/user"}>
                                    <Button id={"layout-header-button"} shape={"circle"} icon={<UserOutlined/>}/>
                                </Link>
                            </Dropdown>):
                            (<> </>)
                        }
                    </div>
                </Header>

                <Content id={"layout-content-wrapper"}>
                    {((auth && !isLoginPage) || isLoginPage)&&children}
                </Content>

                <Footer id={"layout-footer"}>
                    @S1eepNextSec
                </Footer>
            </Layout>
        </UserContext.Provider>
    );
}