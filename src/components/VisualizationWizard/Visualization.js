import React, {useState} from 'react'
import {Row, Col, Select, Drawer, Switch} from 'antd';
import {SettingOutlined} from '@ant-design/icons'
import {useWindowDimensions, useStore} from '../../Contexts';
import {observer} from 'mobx-react';
import {DisplayChart} from "../common/DisplayChart";

const {Option} = Select;
export const Visualization = observer(() => {
  const [visible, setVisible] = useState(false);
  const {height} = useWindowDimensions();
  const store = useStore();
  const showDrawer = () => {
    setVisible(!visible);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        Selected data
      </Col>
      <Col span={18} className="px-10 bg-blue-200">
        <Row gutter={[8, 8]} className="p-0">
          <Col span={12}>
            <Select className="w-1/3" size="large" onChange={store.currentDashboardItem.changeItemType}>
              <Option value="column">Column Graph</Option>
              <Option value="bar">Bar Graph</Option>
              <Option value="table">Table</Option>
              <Option value="pie">Pie Chart</Option>
              <Option value="heat">Heat Map</Option>
              <Option value="geo">Geo Map</Option>
              <Option value="gauge">Gauge</Option>
              <Option value="line">Line Graph</Option>
              <Option value="area">Area Chart</Option>
              <Option value="doughnut">Doughnut</Option>
              <Option value="metric">Metric</Option>
              <Option value="scatter">Scatter</Option>
            </Select>
          </Col>
          <Col span={12} className="text-right">
            <SettingOutlined className="text-4xl" onClick={showDrawer}/>
          </Col>
        </Row>
        <div className="overflow-hidden relative bg-white" style={{height: height - 350}}>
          <DisplayChart configurations={store.currentDashboardItem}/>
          <Drawer
            title="Basic Drawer"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            maskClosable={false}
            getContainer={false}
            style={{position: 'absolute', marginTop: 10}}
            maskStyle={{background: 'none'}}
          >
            <Row gutter={[16, 16]}>
              <Col>
                Parent Level Data
              </Col>
              <Col>
                <Switch/>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col>
                Sublevel Data
              </Col>
              <Col>
                <Switch onChange={store.currentDashboardItem.enableSublevelAnalysis}
                        checked={store.currentDashboardItem.disaggregatedBySublevel}/>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col>
                Specific level data
              </Col>
              <Col>
                <Switch onChange={store.currentDashboardItem.enableSpecificLevelAnalysis}
                        checked={store.currentDashboardItem.disaggregatedBySpecificLevel}/>
                {store.currentDashboardItem.disaggregatedBySpecificLevel ?
                  <Select className="w-full" value={store.currentDashboardItem.orgUnitDisaggregationLevel}
                          onChange={store.currentDashboardItem.changeSpecificLevelAnalysis}>
                    {store.organisationLevels.map((level) => <Option key={level.id}
                                                                     value={`level${level.level}`}>{level.name}</Option>)}
                  </Select> : null}
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col>
                Disaggregated by date
              </Col>
              <Col>
                <Switch onChange={store.currentDashboardItem.enableDateAnalysis}
                        checked={store.currentDashboardItem.disaggregatedByDate}/>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col>
                Cumulative data
              </Col>
              <Col>
                <Switch/>
              </Col>
            </Row>

            {['column', 'bar'].indexOf(store.currentDashboardItem.itemType) !== -1 ? <Row gutter={[16, 16]}>
              <Col>
                Stacked
              </Col>
              <Col>
                <Switch onChange={store.currentDashboardItem.changeStacked}
                        checked={store.currentDashboardItem.stacked}/>
              </Col>
            </Row> : null}
          </Drawer>
        </div>
      </Col>
    </Row>
  )
})
