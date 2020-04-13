import React, {useEffect, useState} from "react";
import {Breadcrumb, Button, Card, Layout, Modal, Steps, Table} from "antd";
import {Link} from "react-router-dom";
import {DownloadOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import {observer} from "mobx-react";
import {useStore, useWindowDimensions} from "../Contexts";
import {BasicDetails} from "./DashboardWizard/BasicDetails";
import {DataInput} from "./DashboardWizard/DataInput";
import {Visualization} from "./DashboardWizard/Visualization";

const steps = [
  {
    title: 'BASIC DETAILS',
    content: <BasicDetails/>,
  },
  {
    title: 'DATA INPUTS',
    content: <DataInput/>,
  },
  {
    title: 'VISUALIZE',
    content: <Visualization/>,
  }
];
const {Step} = Steps;
const {Content} = Layout;

export const Dashboards = observer(() => {
  const store = useStore();

  const [activeStep, setActiveStep] = React.useState(0);

  const {height} = useWindowDimensions();

  useEffect(() => {
    store.fetchDashboards()
  }, [store]);

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true)
  };

  const handleOk = async () => {
    await store.saveDashboard();
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const columns = [
    {
      title: ({sortOrder, sortColumn, filters}) => <div>Dashboard Name</div>,
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Actions',
      render: () => <EllipsisOutlined className="text-4xl" style={{color: '#3083AB', fontWeight: 'bolder'}}/>
    }
  ];

  const btn = <Button
    className="uppercase"
    style={{
      background: '#022450',
      color: 'white',
      fontSize: 'large',
      fontWeight: 'bolder',
      height: 50,
      borderRadius: '0.5rem',
      width: 230
    }}
    onClick={showModal}>New Dashboard</Button>;

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

  return <Content className="content">
    <Breadcrumb className="breadcrumb" separator=" - ">
      <Breadcrumb.Item><Link to="/configurations">Administrative Panel</Link></Breadcrumb.Item>
      <Breadcrumb.Item>Dashboards</Breadcrumb.Item>
    </Breadcrumb>
    {store.dashboards.length > 0 ?
      <div>
        <div className="text-right mb-4">{btn}</div>
        <Card title="Dashboards" extra={<div style={{color: '#3083AB'}}>
          <Button style={{color: '#3083AB'}} type="link" icon={<DownloadOutlined className="text-2xl"/>}
                  size="large">Download</Button>
          <Button style={{color: '#3083AB'}} type="link" icon={<SettingOutlined className="text-2xl"/>}
                  size="large">Columns</Button>
        </div>}>
          <Table rowSelection={rowSelection} rowKey="id" dataSource={store.dashboards} columns={columns}/>
        </Card>
      </div> : <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '70%'
      }}>
        <div className="mb-8 text-lg">No Dashboard found. Get started by clicking below</div>
        {btn}
      </div>}
    <Modal
      style={{top: 10}}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="p-0 m-0"
      maskClosable={false}
      width="96%"
      bodyStyle={{height: height - 40}}
      footer={null}
    >
      <div className="mt-6">
        <Steps current={activeStep} labelPlacement="vertical">
          {steps.map((item) => {
            return <Step key={item.title} title={item.title}/>
          })}
        </Steps>
        <div className="mt-10">{steps[activeStep].content}</div>
      </div>
      <div className="flex bottom-0 absolute my-5 w-full">
        <div className="w-1/2 text-left">
          {activeStep > 0 && (
            <Button size="large" onClick={() => handleBack()}>
              PREVIOUS
            </Button>
          )}
        </div>
        <div className="w-1/2 text-right pr-12">
          {activeStep < steps.length - 1 && (
            <Button size="large" type="primary" onClick={() => handleNext()}>
              NEXT
            </Button>
          )}
          {activeStep === steps.length - 1 && (
            <Button size="large" type="primary" onClick={handleOk}>
              SAVE
            </Button>
          )}
        </div>
      </div>
    </Modal>
  </Content>
});
