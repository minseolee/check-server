import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
// import Axios from "axios";
import { axiosInstance } from "../../../config";
import { Form, Icon, Input, Button, Checkbox, Typography, message } from 'antd';
import { useDispatch } from "react-redux";

const { Title } = Typography;

function MemberLoginPage(props) {
    const dispatch = useDispatch();
    const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

    const [formErrorMessage, setFormErrorMessage] = useState('')
    const [rememberMe, setRememberMe] = useState(rememberMeChecked)

    const handleRememberMe = () => {
        setRememberMe(!rememberMe)
    };
    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .required('아이디를 입력해주세요'),
                password: Yup.string()
                    .min(6, '비밀번호는 6자리 이상입니다')
                    .required('비밀번호를 입력해주세요'),
            })}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    let dataToSubmit = {
                        email: values.email,
                        password: values.password
                    };
                    axiosInstance.post('/api/member/login', dataToSubmit)
                        .then(response => {
                            if(response.data.success) {
                                if(response.data.member !== null) {
                                    localStorage.setItem("email", response.data.member.email)
                                    localStorage.setItem("password", response.data.member.password)
                                    message.success('완료');
                                    setTimeout(() => {
                                        props.history.push('/slot')
                                    }, 500);
                                } else {
                                    message.warning('아이디나 비밀번호를 확인해주시기바랍니다');
                                    setTimeout(() => {
                                        setTimeout(() => {
                                            window.location.reload(false)
                                        }, 500);
                                    }, 500);
                                }
                            } else {
                                message.warn('멤버정보를 가져오는데 실패했습니다.');
                            }
                        })


                }, 500);
            }}
        >
            {props => {
                const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
                } = props;
                return (
                    <div className="app">

                        <Title level={2}>로그인</Title>
                        <form onSubmit={handleSubmit} style={{ width: '350px' }}>

                            <Form.Item required>
                                <Input
                                    id="email"
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="아이디를 입력해주세요"
                                    type="text"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.email && touched.email ? 'text-input error' : 'text-input'
                                    }
                                />
                                {errors.email && touched.email && (
                                    <div className="input-feedback">{errors.email}</div>
                                )}
                            </Form.Item>

                            <Form.Item required>
                                <Input
                                    id="password"
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="비밀번호를 입력해주세요"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.password && touched.password ? 'text-input error' : 'text-input'
                                    }
                                />
                                {errors.password && touched.password && (
                                    <div className="input-feedback">{errors.password}</div>
                                )}
                            </Form.Item>

                            {formErrorMessage && (
                                <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
                            )}

                            <Form.Item>
                                <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} >Remember me</Checkbox>
                                {/*<a className="login-form-forgot" href="/reset_user" style={{ float: 'right' }}>*/}
                                {/*  forgot password*/}
                                {/*  </a>*/}
                                <div>
                                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                                        Log in
                                    </Button>
                                </div>
                            </Form.Item>
                        </form>
                    </div>
                );
            }}
        </Formik>
    );
};

export default withRouter(MemberLoginPage);


