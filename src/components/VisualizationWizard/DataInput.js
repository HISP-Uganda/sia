import React, {useState, useEffect} from 'react'
import {Row, Col, Button} from 'antd';
import {observer} from 'mobx-react';
import {useStore} from "../../Contexts";
import {GroupEditor} from "../common/GroupEditor";

export const DataInput = observer(() => {
  const store = useStore();
  const [targetKeys, setTargetKeys] = useState([]);
  const [currentButton, setCurrentButton] = useState(1);
  store.currentDashboardItem.setOrgUnit(store.userOrgUnit);
  const handelOnChange = (nextTargetKeys, direction, moveKeys) => {
    const finalIndicators = store.indicators.filter((i) => nextTargetKeys.indexOf(i.id) !== -1);
    setTargetKeys(nextTargetKeys);
    store.currentDashboardItem.setIndicators(finalIndicators);
  };

  useEffect(() => {
    store.fetchDataSetElements();
  }, [store]);

  const display = () => {
    switch (currentButton) {
      case 1:
        return <GroupEditor
          dataSource={store.finalElements}
          targetKeys={store.currentDashboardItem.dataElements}
          onChange={store.currentDashboardItem.handleChange}
        />;
      case 2:
        return <GroupEditor
          dataSource={store.finalIndicators}
          targetKeys={targetKeys}
          onChange={handelOnChange}
        />;
      default:
        return null
    }
  };

  const setDisplay = (current) => () => {
    setCurrentButton(current);
  };
  return (
    <Row gutter={[16, 16]}>
      <Col span={4}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <div className="w-full uppercase">Select Data Type Below to Begin</div>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Button onClick={setDisplay(1)} className="w-full uppercase" size="large">Data Elements</Button>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Button onClick={setDisplay(2)} className="w-full uppercase" size="large">Indicators</Button>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Button onClick={setDisplay(3)} className="w-full uppercase" size="large">Program Indicators</Button>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Button onClick={setDisplay(4)} className="w-full uppercase" size="large">Constants</Button>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Button onClick={setDisplay(5)} className="w-full uppercase" size="large">Custom Data</Button>
          </Col>
        </Row>
      </Col>
      <Col span={20}>
        {display()}
      </Col>
    </Row>
  )
});
