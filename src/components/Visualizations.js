import React, {useEffect, useState} from "react";
import {Layout, Breadcrumb, Steps, Table, Modal, Button, Card} from "antd";
import {Link} from "react-router-dom";
import {observer} from "mobx-react";
import {useStore, useWindowDimensions} from "../Contexts";
import {BasicDetails} from "./VisualizationWizard/BasicDetails";
import {DataInput} from "./VisualizationWizard/DataInput";
import {Visualization} from "./VisualizationWizard/Visualization";
import {DownloadOutlined, SettingOutlined, EllipsisOutlined} from "@ant-design/icons";

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

export const Visualizations = observer(() => {
  const store = useStore();
  const [activeStep, setActiveStep] = React.useState(0);

  const {height} = useWindowDimensions();

  useEffect(() => {
    store.fetchVisualizations()
  }, [store]);

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true)
  };

  const handleOk = async () => {
    await store.saveVisualization();
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
    onClick={showModal}>New Visualization</Button>;

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
      title: ({sortOrder, sortColumn, filters}) => <div>Visualization Name</div>,
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: ({sortOrder, sortColumn, filters}) => <div>ID</div>,
      dataIndex: 'id',
      key: 'id',
      sorter: true
    },
    {
      title: ({sortOrder, sortColumn, filters}) => <div>Item Type</div>,
      dataIndex: 'itemType',
      key: 'itemType',
      sorter: true
    },
    {
      title: 'Actions',
      render: () => <EllipsisOutlined className="text-4xl" style={{color: '#3083AB', fontWeight: 'bolder'}}/>
    }
  ];

  return <Content className="content">
    <Breadcrumb className="breadcrumb" separator=" - ">
      <Breadcrumb.Item><Link to="/configurations">Administrative Panel</Link></Breadcrumb.Item>
      <Breadcrumb.Item>Visualizations</Breadcrumb.Item>
    </Breadcrumb>
    {store.dashboardItems.length > 0 ?
      <div>
        <div className="text-right mb-4">{btn}</div>
        <Card title="Visualizations" extra={<div style={{color: '#3083AB'}}>
          <Button style={{color: '#3083AB'}}  type="link" icon={<DownloadOutlined  className="text-2xl"/>} size="large">Download</Button>
          <Button style={{color: '#3083AB'}} type="link" icon={<SettingOutlined className="text-2xl"/>}  size="large">Columns</Button>
        </div>}>
          <Table rowSelection={rowSelection} rowKey="id" dataSource={store.dashboardItems} columns={columns}/>
        </Card>
      </div> : <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '70%'
      }}>
        <div className="mb-8 text-lg">No Visualization found. Get started by clicking below</div>
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
