import React, {useEffect, useRef, useState} from 'react';
import {Card, Col, Typography, Row, Table, message, Tooltip, Button, Select, Input, Icon} from "antd";
// import Axios from "axios";
import { axiosInstance } from "../../../config";
import moment from "moment";
import Highlighter from "react-highlight-words";
const { Title } = Typography;
const { Option } = Select;

function AllSubSlot(props) {
    const [SubSlot, setSubSlot] = useState("");
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
        axiosInstance.get('/api/subslot/getAllSlots')
            .then(response => {
                if(response.data.success) {
                    setSubSlot(response.data.subslots);
                } else {
                    message.warn('??????????????? ??????????????? ??????????????????.');
                }
            })

    }, []);

    SubSlot && SubSlot.map((subslot, index) => {
        const subslots = {
            key: index,
            ID: subslot.email,
            name: subslot.name,
            counting: subslot.count,
            date: moment(subslot.createdAt).format("YYYY-MM-DD"),
            adding: [subslot.userId, subslot.memberId, subslot.email, subslot.name, subslot.count],
        }
        dataSource.unshift(subslots);
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
        },
        {
            title: '????????????',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: '???????????? ????????????',
            dataIndex: 'counting',
            key: 'counting',
            render: (counting) =>
                <Tooltip title="?????? ????????? ??????">
                    <Button style={{ padding: "0 5px", background: "green", color: "#fff" }}>{counting}</Button>
                </Tooltip>
        },
        {
            title: '????????????',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '??????????????????',
            dataIndex: 'adding',
            key: 'adding',
            render: (add) => {
                if(add === true) {
                    return (
                        <Button type="primary">O</Button>
                    )
                } else {
                    return (
                        <Button type="primary" onClick={addSlot} value={add}>??????</Button>
                    )
                }
            }
        },
    ];

    const addSlot = (e) => {
        e.preventDefault();
        const check = window.confirm('?????? ????????? ?????????????????????????');

        if(check) {
            const memberValue = e.currentTarget.value.split(",");
            const subslotvalue = {
                userId: memberValue[0],
                memberId: memberValue[1],
                email: memberValue[2],
                name: memberValue[3],
                count: memberValue[4],
            }
            const slotvalue = {
                userId: memberValue[0],
                memberId: memberValue[1],
                email: memberValue[2],
                name: memberValue[3],
            }
            console.log(slotvalue);

            axiosInstance.post('/api/subslot/accept', subslotvalue)
                .then(response => {
                    if(response.data.success) {
                        for(let i = 0; i < memberValue[4]; i++) {
                            axiosInstance.post('/api/slot/upload', slotvalue)
                                .then(response => {
                                    if(response.data.success) {
                                        message.success('????????? ?????????????????????')
                                    } else {
                                        message.warning('?????? ????????? ??????????????????')
                                        console.log(response.data);
                                    }
                                })
                        }
                    } else {
                        message.warning('?????? ????????? ??????????????????')
                    }
                })

            setTimeout(() => {
                window.location.reload(false)
            }, 500);
        }
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Title level={2}>???????????? ????????????</Title>
            </div>
            <div style={{ marginBottom: '1rem' }}>
            </div>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    )
}

export default AllSubSlot