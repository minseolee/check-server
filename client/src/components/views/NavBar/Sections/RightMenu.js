/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {Menu, Select} from 'antd';
// import axios from 'axios';
import { axiosInstance } from "../../../config";
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import * as PropTypes from "prop-types";
import SubMenu from "antd/es/menu/SubMenu";

function Option(props) {
    return null;
}

Option.propTypes = {
    value: PropTypes.string,
    children: PropTypes.node
};

function RightMenu(props) {
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
                <Menu.Item key="guide">
                    <a href="/login">관리자로그인</a>
                </Menu.Item>
                <Menu.Item key="mail">
                    <a href="/memberlogin">로그인</a>
                </Menu.Item>
            </Menu>
        )
    } else {
        if(user.userData && !user.userData.isAdmin) {
            return (
                <Menu mode={props.mode}>
                    <Menu.Item key="logout">
                        <a onClick={logoutHandler}>로그아웃</a>
                    </Menu.Item>
                </Menu>
            )
        } else {
            return (
                <Menu mode={props.mode}>
                    <SubMenu title={<span>관리자계정</span>}>
                        <Menu.Item key="member:1"><a href="/register">관리자계정 생성</a></Menu.Item>
                        <Menu.Item key="member:2"><a href="/register/list">관리자계정 관리</a></Menu.Item>
                    </SubMenu>
                    <SubMenu title={<span>슬롯총괄관리</span>}>
                        <Menu.Item key="slot">
                            <a href="/allsubslot">신규슬롯 신청승인</a>
                        </Menu.Item>
                        <Menu.Item key="slot">
                            <a href="/allslot">슬롯현황 전체보기</a>
                        </Menu.Item>
                        <Menu.Item key="slot">
                            <a href="/slotexpire">만기슬롯</a>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="logout">
                        <a onClick={logoutHandler}>로그아웃</a>
                    </Menu.Item>
                </Menu>
            )
        }
    }
}

export default withRouter(RightMenu);

