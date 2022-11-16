import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button, Form, message, Input, Icon } from "antd";
// import Axios from "axios";
import { axiosInstance } from "../../../config";
import moment from "moment";

const { Title } = Typography;

function TestSlotUpload(props) {
    const [Name, setName] = useState("");
    const [Keyword, setKeyword] = useState("");
    const [oneMID, setOneMID] = useState("");
    const [multiMID, setMultiMID] = useState("");
    const [ExDate, setExDate] = useState(Date.now() + 5*24*60*60*1000);

    const onNameChange = (e) => {
        setName(e.currentTarget.value)
    }

    const onKeywordChange = (e) => {
        setKeyword(e.currentTarget.value)
    }
    const onOneMIDChange = (e) => {
        setOneMID(e.currentTarget.value)
    }
    const onMultiMIDChange = (e) => {
        setMultiMID(e.currentTarget.value)
    }

    useEffect(() => {
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            memberId: localStorage.getItem('userId'),
            name: Name,
            keyword: Keyword,
            oneMID: oneMID,
            multiMID: multiMID,
        }

        axiosInstance.post('/api/testslot/upload', variables)
            .then(response => {
                if(response.data.success) {
                    message.success('테스트슬롯이 생성되었습니다.')
                    setTimeout(() => {
                            props.history.push('/testslot')
                    }, 500);
                } else {
                    alert('테스트슬롯 생성에 실패했습니다.')
                    setTimeout(() => {
                        props.history.push('/testslot')
                    }, 500);
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Title level={2}>테스트 슬롯생성</Title>
            </div>

            <Form onSubmit={onsubmit}>
                <label>업체이름</label>
                <Input
                    onChange={onNameChange}
                    value={Name}
                />
                <br/>
                <br/>

                <label>만료일시</label>
                <Input
                    value={moment(ExDate).format("YYYY-MM-DD")}
                    disabled
                />
                <br/>
                <br/>

                <label>상품검색 키워드</label>
                <Input
                    onChange={onKeywordChange}
                    value={Keyword}
                />
                <br/>
                <br/>


                <label>단품MID</label>
                <Input
                    onChange={onOneMIDChange}
                    value={oneMID}
                />
                <br/>
                <br/>


                <label>묶음MID<span style={{ fontSize: "12px" }}>(단품상품일 경우 공백)</span></label>
                <Input
                    onChange={onMultiMIDChange}
                    value={multiMID}
                />
                <br/>
                <br/>


                <Button type="primary" size="large" onClick={onSubmit}>
                    저장
                </Button>

            </Form>
        </div>
    )
}

export default TestSlotUpload