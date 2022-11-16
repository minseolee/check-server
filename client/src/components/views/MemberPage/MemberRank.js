import React, {useEffect, useRef, useState} from 'react';
import { useSelector } from 'react-redux';
import {  Table, Input, Typography, message, Tooltip, Button, Select, Icon, Space } from "antd";
import Highlighter from 'react-highlight-words';
// import Axios from "axios";
import { axiosInstance } from "../../../config";
import moment from "moment";
const { Title } = Typography;
const { Option } = Select;

function MemberRank(props) {
    const user = useSelector(state => state.user);
    const [Member, setMember] = useState([]);
    const [Slot, setSlot] = useState(1);

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

    let dataSource = [];

    useEffect(() => {

        const memberVariables = {
            userId: localStorage.getItem('userId'),
        };

        axiosInstance.post('/api/member/getMembers', memberVariables)
            .then(response => {
                if(response.data.success) {
                    setMember(response.data.members);
                } else {
                    message.warn('회원목록을 가져오는데 실패했습니다.');
                }
            })

    }, []);

    Member.map((member, index) => {
        const members = {
            key: index,
            ID: member.email + "/" + member.password,
            name: member.name,
            adding: [ member._id, member.email, member.name ],
            counting: 0, // 추후 변경
            date: moment(member.createdAt).format("YYYY-MM-DD"),
            testing: "",
            delete: member._id,
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
            title: 'ID/PW',
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
            title: '슬롯추가',
            dataIndex: 'adding',
            key: 'adding',
            render: (adding) =>
                <>
                    <Select defaultValue="1" style={{ width: 75 }} onChange={onSlotChange}>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                    </Select>
                    <Button type="primary" value={adding} onClick={onSubmitSlot} style={{ padding: "0 5px"}}>슬롯추가</Button>
                </>
        },
        {
            title: '슬롯카운트',
            dataIndex: 'counting',
            key: 'counting',
            render: (counting) =>
                <Tooltip title="현재 구동중인 슬롯">
                    <Button type="primary" style={{ padding: "0 5px" }}>{counting}</Button>
                </Tooltip>
        },
        {
            title: '가입일시',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '테스트 슬롯',
            dataIndex: 'testing',
            key: 'testing',
        },
        {
            title: '삭제',
            dataIndex: 'delete',
            key: 'delete',
            render: (del) => <Button type="danger" onClick={delBtn} value={del}>X</Button>
        },
    ];

    const delBtn = (e) => {
        e.preventDefault();

        const variables = {
            _id: e.currentTarget.value,
        }

        axiosInstance.post('/api/member/delete', variables)
            .then(response => {
                if(response.data.success) {
                    props.history.push('/member/list')
                    message.success('회원이 삭제되었습니다')
                } else {
                    message.warning('회원 삭제에 실패했습니다')
                }
            })
    }

    const onSlotChange = (value) => {
        setSlot(value);
    };

    const onSubmitSlot = (e) => {
        e.preventDefault();
        const memberValue = e.currentTarget.value.split(",");

        const variables = {
            userId: user.userData._id,
            memberId: memberValue[0],
            email: memberValue[1],
            name: memberValue[2],
            count: Slot,
            confirm: false,
        }

        axiosInstance.post('/api/subslot/upload', variables)
            .then(response => {
                if(response.data.success) {
                    message.success(`${Slot}개의 슬롯이 신청되었습니다`);
                } else {
                    message.warning('이미 신청된 슬롯이 존재하거나, 슬롯 생성에 실패했습니다')
                }
            })
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Title level={2}>회원 관리</Title>
            </div>
            <div style={{ marginBottom: '1rem' }}>
            </div>
            <Table dataSource={dataSource} columns={columns} />
        </div>

    )
}

export default MemberRank