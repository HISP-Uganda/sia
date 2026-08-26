import React, {useState} from 'react'
import {useStore} from '../../Contexts';
import {observer} from 'mobx-react';
import {Select, Tabs} from 'antd';
import {Responsive, WidthProvider} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {DisplayChart} from "../common/DisplayChart";

const ResponsiveGridLayout = WidthProvider(Responsive);


const {TabPane} = Tabs;
const {Option} = Select;

export const Visualization = observer(() => {
  const store = useStore();
  const [tabPosition, setTabPosition] = useState('top');
  const [activeKey, setActiveKey] = useState(store.currentDashboardItemGroup);
  const changeTabPosition = tabPosition => {
    setTabPosition(tabPosition);
  };

  const onLayoutChange = (layout) => {
    const group = store.currentDashboard.dashboardItemsGroups.find(group => group.id === activeKey);
    group.dashboardItems.forEach(item => {
      const itemLayout = layout.find(l => l.i === item.id);
      if (itemLayout) {
        const {w, h, x, y} = itemLayout;
        item.changeSize(w, h, x, y);
      }
    });
  };

  const onChange = (activeKey) => {
    setActiveKey(activeKey);
  }
  return (
    <div className="flex flex-col">
      <div className="w-full text-right mb-4">
        <Select
          size="large"
          className="w-2/12"
          value={tabPosition}
          onChange={changeTabPosition}
          dropdownMatchSelectWidth={false}
        >
          <Option value="top">top</Option>
          <Option value="bottom">bottom</Option>
          <Option value="left">left</Option>
          <Option value="right">right</Option>
        </Select>
      </div>

      <Tabs tabPosition={tabPosition} activeKey={activeKey} onChange={onChange}>
        {store.currentDashboard.dashboardItemsGroups.map(group => <TabPane tab={group.name} key={group.id}>
          <ResponsiveGridLayout className="layout"
                                onLayoutChange={onLayoutChange}
                                breakpoints={{xxl: 3400, lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                                cols={{xxl: 12, lg: 12, md: 6, sm: 2, xs: 1, xxs: 1}}
                                rowHeight={56}
          >
            {group.dashboardItems.map((dashboardItem) =>
              <div className="bg-white" data-grid={{
                w: dashboardItem.w,
                h: dashboardItem.h,
                x: dashboardItem.x,
                y: dashboardItem.y,
                i: dashboardItem.id,
                static: dashboardItem.static
              }} key={dashboardItem.id}>
                <DisplayChart itemType={dashboardItem.itemType} configurations={dashboardItem.configurations}/>
              </div>
            )}
          </ResponsiveGridLayout>
        </TabPane>)}
      </Tabs>
    </div>
  )
})
