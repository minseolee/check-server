import React from 'react';
import { Menu } from 'antd';
// import axios from "axios";
import { axiosInstance } from "../../../config";
import {USER_SERVER} from "../../../Config";
import { withRouter } from 'react-router-dom';
import {useSelector} from "react-redux";
import * as PropTypes from "prop-types";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
    const user = useSelector(state => state.user)

    const logoutHandler = () => {
        axiosInstance.get(`${USER_SERVER}/logout`).then(response => {
            if (response.status === 200) {
                props.history.push("/login");
            } else {
                alert('Log Out Failed')
            }
        });
    };
    if (user.userData && !user.userData.isAuth) {
        return (
            <Menu mode={props.mode}>
                <SubMenu title={<span>대시보드</span>}>
                    <Menu.Item key="setting:1"><a href="/slot">내 슬롯목록</a></Menu.Item>
                    <Menu.Item key="setting:2"><a href="/member/rank">순위변동확인</a></Menu.Item>
                </SubMenu>
            </Menu>
        )
    } else {
        return (
            <Menu mode={props.mode}>

                <SubMenu title={<span>회원관리</span>}>
                    <Menu.Item key="member:1"><a href="/member/upload">회원등록</a></Menu.Item>
                    <Menu.Item key="member:2"><a href="/member/list">회원리스트</a></Menu.Item>
                </SubMenu>

                <SubMenu title={<span>요청관리</span>}>
                    <Menu.Item key="subslot:1"><a href="/subslot">신규슬롯 신청목록</a></Menu.Item>
                    <Menu.Item key="subslot:2"><a href="/subslot/extend">슬롯연장 신청목록</a></Menu.Item>
                    <Menu.Item key="subslot:3"><a href="/subslot/using">승인 슬롯현황</a></Menu.Item>
                    <Menu.Item key="subslot:4"><a href="/testslot">테스트슬롯</a></Menu.Item>
                </SubMenu>


                <SubMenu title={<span>대시보드</span>}>
                    <Menu.Item key="setting:1"><a href="/slot">내 슬롯목록</a></Menu.Item>
                    <Menu.Item key="setting:2"><a href="/member/rank">순위변동확인</a></Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
}

export default withRouter(LeftMenu)