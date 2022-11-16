import React, {useEffect, useRef, useState} from 'react';
import {Card, Col, Typography, Row, Table, message, Tooltip, Button, Select, Input, Icon} from "antd";
// import Axios from "axios";
import { axiosInstance } from "../../../config";
import moment from "moment";
import Highlighter from "react-highlight-words";
const { Title } = Typography;
const { Option } = Select;

function SlotExpire(props) {
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
        axiosInstance.get('/api/slot/getExpired')
            .then(response => {
                if(response.data.success) {
                    console.log(response.data);
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
            date: moment(slot.expireDate).format("YYYY-MM-DD"),
            modify: slot._id,
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
            title: '만료일시',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '슬롯정보수정',
            dataIndex: 'modify',
            key: 'modify',
            render: (modify) =>
                <a type="primary" href={`/subslot/modify/${modify}`} >
                    세부정보
                    <Icon type="form" />
                </a>
        },
    ];

    const onExtendClick = (e) => {
        e.preventDefault();
        const extend = window.confirm("슬롯 연장 신청을 하시겠습니까?")
        const variables = {
            _id: e.currentTarget.value,
        }

        if(extend) {
            axiosInstance.post('/api/slot/extend', variables)
                .then(response => {
                    if(response.data.success) {
                        message.success('슬롯 연장신청이 완료되었습니다.')
                        setTimeout(() => {
                            props.history.push('/subslot/using')
                        }, 500);
                    } else {
                        alert('슬롯 연장신청에 실패했습니다.')
                    }
                })
        }
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Title level={2}>만기슬롯</Title>
            </div>
            <div style={{ marginBottom: '1rem' }}>
            </div>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    )
}

export default SlotExpire