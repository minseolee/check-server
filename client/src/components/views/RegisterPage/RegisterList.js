import React, {useEffect, useRef, useState} from 'react';
import { useSelector } from 'react-redux';
import {Card, Col, Typography, Row, Table, message, Tooltip, Button, Select, Input, Icon} from "antd";
// import Axios from "axios";
import { axiosInstance } from "../../../config";
import moment from "moment";
import Highlighter from "react-highlight-words";
const { Title } = Typography;
const { Option } = Select;

function RegisterList(props) {
    const user = useSelector(state => state.user);
    const [Member, setMember] = useState([]);
    const [Slot, setSlot] = useState(1);
    let dataSource = [];

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </>
            </div>
        ),
        filterIcon: (filtered) => (
            <Icon type="search"
                  style={{
                      color: filtered ? '#1890ff' : undefined,
                  }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    useEffect(() => {
        axiosInstance.get('/api/users/getUser')
            .then(response => {
                if(response.data.success) {
                    setMember(response.data.users);
                } else {
                    message.warn('?????????????????? ??????????????? ??????????????????.');
                }
            })
    }, []);

    Member && Member.map((member, index) => {
        const members = {
            key: index,
            ID: member.email,
            name: member.name,
            position: member.lastname,
            date: moment(member.createdAt).format("YYYY-MM-DD"),
            authority: [member._id, member.role],
        }
        dataSource.unshift(members);
    })

    const columns = [
        {
            title: 'No',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
            ...getColumnSearchProps('ID'),
        },
        {
            title: '??????',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '??????',
            dataIndex: 'position',
            key: 'position',
        },
        // {
        //     title: '???????????????',
        //     dataIndex: 'counting',
        //     key: 'counting',
        //     render: (counting) =>
        //         <Tooltip title="?????? ???????????? ??????">
        //             <Button type="primary" style={{ padding: "0 5px" }}>{counting}</Button>
        //         </Tooltip>
        // },
        {
            title: '????????????',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '??????????????? ????????????/??????',
            dataIndex: 'authority',
            key: 'authority',
            render: (authority) => {
                if(authority[1] === 1) {
                    return (
                        <Tooltip title="??????????????? ????????????">
                            <Button value={authority[0]} style={{background: "green", color: "#ffffff"}} onClick={master}>O</Button>
                        </Tooltip>
                    )
            } else {
                    return (
                        <Tooltip title="??????????????? ????????????">
                            <Button type="danger" value={authority[0]} onClick={master}>X</Button>
                        </Tooltip>
                    )
                }
            }
        },
    ];

    const master = (e) => {
        e.preventDefault();
        const authVariables = {
            userId: e.currentTarget.value,
        }

        axiosInstance.post('/api/users/authority', authVariables)
            .then(response => {
                console.log(response.data);
                if(response.data.success) {
                    message.success('????????? ????????? ?????????????????????')
                    setTimeout(() => {
                        window.location.reload(false)
                    }, 500);
                } else {
                    message.warning('????????? ?????? ????????? ??????????????????')
                }
            })
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Title level={2}>?????? ??????????????? ??????</Title>
            </div>
            <div style={{ marginBottom: '1rem' }}>
            </div>
            <Table dataSource={dataSource} columns={columns} />
        </div>

    )
}

export default RegisterList