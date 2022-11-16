import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button, Form, message, Input, Icon } from "antd";
// import Axios from "axios";
import { axiosInstance } from "../../../config";

const { Title } = Typography;

function MemberUpload(props) {
    const user = useSelector(state => state.user);
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Name, setName] = useState("");
    const [Description, setDescription] = useState("");

    const onEmailChange = (e) => {
        setEmail(e.currentTarget.value)
    }
    const onPasswordChange = (e) => {
        setPassword(e.currentTarget.value)
    }
    const onNameChange = (e) => {
        setName(e.currentTarget.value)
    }
    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if(Email !== "" && Password !== "" && Name !== "" && Description !== "") {
            const variables = {
                userId: user.userData._id,
                email: Email,
                password: Password,
                name: Name,
                description: Description,
            }

            axiosInstance.post('/api/member/upload', variables)
                .then(response => {
                    if(response.data.success) {
                        message.success('회원이 등록되었습니다')
                        setTimeout(() => {
                            props.history.push('/member/list')
                        }, 500);
                    } else {
                        alert('회원추가를 실패했습니다.')
                    }
                })
        } else {
            message.warning('정보를 전부 입력해주세요');
        }
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Title level={2}>회원 추가</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <label>아이디</label>
                <Input
                    onChange={onEmailChange}
                    value={Email}
                    />
                <br/>
                <br/>

                <label>비밀번호</label>
                <Input.Password
                    onChange={onPasswordChange}
                    value={Password}
                />
                <br/>
                <br/>

                <label>업체이름</label>
                <Input
                    onChange={onNameChange}
                    value={Name}
                />
                <br/>
                <br/>

                <label>비고</label>
                <Input
                    onChange={onDescriptionChange}
                    value={Description}
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

export default MemberUpload