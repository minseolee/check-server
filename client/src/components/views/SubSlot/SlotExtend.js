import React, {useEffect, useRef, useState} from 'react';
import {Card, Col, Typography, Row, Table, message, Tooltip, Button, Select, Input, Icon} from "antd";
// import Axios from "axios";
import { axiosInstance } from "../../../config";
import moment from "moment";
import Highlighter from "react-highlight-words";
const { Title } = Typography;
const { Option } = Select;

function SlotExtend(props) {
    const [Slot, setSlot] = useState("");
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

        const memberVariables = {
            userId: localStorage.getItem('userId'),
        };

        axiosInstance.post('/api/slot/getExtend', memberVariables)
            .then(response => {
                if(response.data.success) {
                    setSlot(response.data.slots);
                } else {
                    message.warn('??????????????? ??????????????? ??????????????????.');
                }
            })

    }, []);


    Slot && Slot.map((slot, index) => {
        const slots = {
            key: index,
            ID: slot.email,
            name: slot.name,
            keyword: slot.keyword,
            oneMID: slot.oneMID,
            multiMID: slot.multiMID,
            date: moment(slot.expireDate).format("YYYY-MM-DD"),
            extend: slot._id,
        }
        dataSource.unshift(slots);
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
            title: '?????????????????????',
            dataIndex: 'keyword',
            key: 'keyword',
        },
        {
            title: '??????MID',
            dataIndex: 'oneMID',
            key: 'oneMID',
        },
        {
            title: '??????MID',
            dataIndex: 'multiMID',
            key: 'multiMID',
        },
        {
            title: '????????????',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '??????????????????',
            dataIndex: 'extend',
            key: 'extend',
            render: (extend) =>
                <Button value={extend} onClick={onExtendClick} style={{color: "red", fontWeight: "bold"}}>
                    <Icon type="close" />
                </Button>
        },
    ];

    const onExtendClick = (e) => {
        e.preventDefault();
        const extend = window.confirm("?????? ?????? ????????? ?????????????????????????")
        const variables = {
            _id: e.currentTarget.value,
        }

        if(extend) {
            axiosInstance.post('/api/slot/expired', variables)
                .then(response => {
                    if(response.data.success) {
                        message.success('?????? ???????????? ????????? ?????????????????????.')
                        setTimeout(() => {
                            window.location.reload(false)
                        }, 500);
                    } else {
                        alert('?????? ??????????????? ????????? ??????????????????.')
                    }
                })
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

export default SlotExtend