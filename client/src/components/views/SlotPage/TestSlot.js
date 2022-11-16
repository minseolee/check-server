import React, {useEffect, useRef, useState} from 'react';
import {Card, Col, Typography, Row, Table, message, Tooltip, Button, Select, Input, Icon} from "antd";
// import Axios from "axios";
import { axiosInstance } from "../../../config";
import moment from "moment";
import Highlighter from "react-highlight-words";
const { Title } = Typography;
const { Option } = Select;

function TestSlot(props) {
    const [Slot, setSlot] = useState("");
    let dataSource = [{
        extend: [localStorage.getItem('userId'), false],
    }
    ];

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

        axiosInstance.post('/api/testslot/getSlots', memberVariables)
            .then(response => {
                if(response.data.success) {
                    setSlot(response.data.slots);
                } else {
                    message.warn('신규슬롯을 가져오는데 실패했습니다.');
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
            modify: slot._id,
            extend: [slot._id, true],
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
            title: '업체이름',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: '상품검색키워드',
            dataIndex: 'keyword',
            key: 'keyword',
        },
        {
            title: '단품MID',
            dataIndex: 'oneMID',
            key: 'oneMID',
        },
        {
            title: '묶음MID',
            dataIndex: 'multiMID',
            key: 'multiMID',
        },
        {
            title: '만료일시',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '테스트슬롯 추가/삭제',
            dataIndex: 'extend',
            key: 'extend',
            render: (extend) =>
            {
                if(extend[1]) {
                    return (
                        <Tooltip title="테스트슬롯 삭제">
                            <Button value={extend[0]} onClick={onTestDelete}>
                                <Icon type="close" style={{color: "red", fontWeight: "bold"}} />
                            </Button>
                        </Tooltip>
                    )
                } else {
                    return (
                        <Button href="/TestSlotUpload" style={{color: "green", fontWeight: "bold"}}>
                            <Icon type="plus" />
                        </Button>
                    )
                }
            }
        },
    ];

    const onTestDelete = (e) => {
        e.preventDefault();
        const extend = window.confirm("테스트 슬롯을 삭제하시겠습니까?")
        const variables = {
            _id: e.currentTarget.value,
        }

        if(extend) {
            axiosInstance.post('/api/testslot/remove', variables)
                .then(response => {
                    if(response.data.success) {
                        message.success('슬롯이 삭제되었습니다.')
                        setTimeout(() => {
                            window.location.reload(false)
                        }, 500);
                    } else {
                        alert('슬롯 삭제에 실패했습니다.')
                    }
                })
        }
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Title level={2}>테스트 슬롯현황</Title>
            </div>
            <div style={{ marginBottom: '1rem' }}>
            </div>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    )
}

export default TestSlot