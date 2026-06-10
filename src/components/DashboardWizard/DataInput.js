import React, {useState} from 'react'
import {Button, Card, Form, Input, Modal, Table} from 'antd';
import {observer} from 'mobx-react';
import {useStore} from "../../Contexts";
import {DownloadOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import {GroupEditor} from "../common/GroupEditor";

const {TextArea} = Input

export const DataInput = observer(() => {
  const store = useStore();
  const [visible, setVisible] = useState(false);
  const [targetKeys, setTargetKeys] = useState([]);

  const handelOnChange = (nextTargetKeys) => {
    const finalDashboardItems = store.dashboardItems.filter((i) => nextTargetKeys.indexOf(i.id) !== -1);
    setTargetKeys(nextTargetKeys);
    store.currentDashboard.currentDashboardItemsGroup.setCurrentDashboardItems(finalDashboardItems);
  };

  const showModal = () => {
    setVisible(true)
  };

  const handleOk1 = () => {
    store.currentDashboard.addDashboardItemGroup();
    setTargetKeys([]);
    setVisible(false);
  };

  const handleOk2 = () => {
    store.currentDashboard.addDashboardItemGroup();
    store.currentDashboard.reset();
    setTargetKeys([]);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const btn = <Button
    className="uppercase"
    style={{
      background: '#022450',
      color: 'white',
      fontSize: 'large',
      fontWeight: 'bolder',
      height: 50,
      borderRadius: '0.5rem',
      width: 270
    }}
    onClick={showModal}>New Visualization Group</Button>;

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const columns = [
    {
      title: ({sortOrder, sortColumn, filters}) => <div>Dashboard Group Name</div>,
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Actions',
      render: () => <EllipsisOutlined className="text-4xl" style={{color: '#3083AB', fontWeight: 'bolder'}}/>
    }
  ];
  return (
    <div>
      {store.currentDashboard.dashboardItemsGroups.length > 0 ?
        <div>
          <div className="text-right mb-4">{btn}</div>
          <Card title="Dashboard Item Groups" extra={<div style={{color: '#3083AB'}}>
            <Button style={{color: '#3083AB'}} type="link" icon={<DownloadOutlined className="text-2xl"/>}
                    size="large">Download</Button>
            <Button style={{color: '#3083AB'}} type="link" icon={<SettingOutlined className="text-2xl"/>}
                    size="large">Columns</Button>
          </div>}>
            <Table rowSelection={rowSelection} rowKey="id" dataSource={store.currentDashboard.dashboardItemsGroups}
                   columns={columns}/>
          </Card>
        </div> : <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
          height: '50%'
        }}>
          <div className="mb-8 text-lg">No Visualization Group found. Get started by clicking below</div>
          {btn}
        </div>}
      <Modal
        visible={visible}
        onOk={handleOk1}
        onCancel={handleCancel}
        maskClosable={false}
        width="80%"
        footer={<div className="w-full flex">
          <div><Button className="uppercase" type="danger" size="large" onClick={handleCancel}>Cancel</Button></div>
          <div className="ml-auto"><Button className="uppercase" type="primary" size="large" onClick={handleOk2}>Save
            and New</Button></div>
          <div className="ml-2"><Button className="uppercase" type="primary" size="large" onClick={handleOk1}>Save and
            Exit</Button></div>
        </div>}
      >
        <div className="mt-10">
          <Form layout="vertical">
            <Form.Item label="Visualization Name">
              <Input size="large" placeholder="Visualization group name"
                     value={store.currentDashboard.currentDashboardItemsGroup.name}
                     onChange={store.currentDashboard.currentDashboardItemsGroup.changeName}/>
            </Form.Item>
            <Form.Item label="Visualization Description">
              <TextArea rows={4} value={store.currentDashboard.currentDashboardItemsGroup.description}
                        onChange={store.currentDashboard.currentDashboardItemsGroup.changeDescription}/>
            </Form.Item>
          </Form>
          <GroupEditor
            dataSource={store.finalVisualizations}
            targetKeys={targetKeys}
            onChange={handelOnChange}
          />
        </div>
      </Modal>
    </div>
  )
});
