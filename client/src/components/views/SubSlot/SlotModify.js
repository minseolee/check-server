import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button, Form, message, Input, Icon } from "antd";
// import Axios from "axios";
import { axiosInstance } from "../../../config";
import moment from "moment";

const { Title } = Typography;

function SlotModify(props) {
    const slotId = props.match.params.slotId;
    const variable = { slotId: slotId };
    const [Slot, setSlot] = useState("");
    const [Keyword, setKeyword] = useState("");
    const [RankKeyword, setRankKeyword] = useState("");
    const [oneMID, setOneMID] = useState("");
    const [multiMID, setMultiMID] = useState("");

    const onKeywordChange = (e) => {
        setKeyword(e.currentTarget.value)
    }
    const onRankKeywordChange = (e) => {
        setRankKeyword(e.currentTarget.value)
    }
    const onOneMIDChange = (e) => {
        setOneMID(e.currentTarget.value)
    }
    const onMultiMIDChange = (e) => {
        setMultiMID(e.currentTarget.value)
    }

    useEffect(() => {
        axiosInstance.post('/api/slot/getDetail', variable)
            .then(response => {
                if(response.data.success) {
                    setSlot(response.data.slot);

                    setKeyword(response.data.slot.keyword);
                    setRankKeyword(response.data.slot.rankKeyword);
                    setOneMID(response.data.slot.oneMID);
                    setMultiMID(response.data.slot.multiMID);
                } else {
                    message.warn('신규슬롯을 가져오는데 실패했습니다.');
                }
            })
    }, []);



    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            _id: slotId,
            rankKeyword: RankKeyword,
            keyword: Keyword,
            oneMID: oneMID,
            multiMID: multiMID,
        }

        axiosInstance.post('/api/slot/update', variables)
            .then(response => {
                if(response.data.success) {
                    message.success('슬롯이 세부내용이 변경되었습니다.')
                    setTimeout(() => {
                        if(localStorage.getItem("email") !== null) {
                            props.history.push('/slot')
                        } else {
                            props.history.push('/subslot/using')
                        }
                    }, 500);
                } else {
                    alert('슬롯 내용변경에 실패했습니다.')
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Title level={2}>슬롯 세부정보</Title>
            </div>

            <Form onSubmit={onsubmit}>
                <label>아이디</label>
                <Input
                    value={Slot.email}
                    disabled
                />
                <br/>
                <br/>

                <label>업체이름</label>
                <Input
                    value={Slot.name}
                    disabled
                />
                <br/>
                <br/>

                <label>만료일시</label>
                <Input
                    value={moment(Slot.expireDate).format("YYYY-MM-DD")}
                    disabled
                />
                <br/>
                <br/>

                <label>순위검색 키워드</label>
                <Input
                    onChange={onRankKeywordChange}
                    value={RankKeyword}
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

export default SlotModify