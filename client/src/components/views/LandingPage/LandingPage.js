import React from 'react'
import { FaCode } from "react-icons/fa";
import {Icon} from "antd";

function LandingPage() {
    return (
        <>
            <div className="app">
                <Icon type="check" style={{fontSize: '8rem'}} />
                <span style={{ fontSize: '4rem' }}>check</span><br />
                <span style={{ fontSize: '2rem' }}>네이버 쇼핑 최적화 시스템</span>
            </div>
        </>
    )
}

export default LandingPage
