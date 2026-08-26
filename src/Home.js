import React, {useEffect} from "react";
import {Layout, Select, Tabs} from "antd";
import {MenuOutlined, UserOutlined} from "@ant-design/icons";
import {observer} from "mobx-react";
import {useStore} from "./Contexts";
import {DisplayChart} from "./components/common/DisplayChart";
import {Responsive, WidthProvider} from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

const {Header, Footer, Content} = Layout;
const {Option} = Select;
const {TabPane} = Tabs;

export const Home = observer(() => {
  const store = useStore();

  useEffect(() => {
      store.runAll();
  }, [store]);

  const onOrgUnitChange = () => {
    console.log('This is very silly');
  }

  const selectBox = <Select
    style={{width: 250}}
    size="large"
    dropdownMatchSelectWidth={false}
  >
    {store.dashboards.map(dash => <Option key={dash.id} value={dash.id}>{dash.name}</Option>)}
  </Select>

  return store.fetching ? <div>Fetching</div> : <Layout className="layout" style={{minHeight: '100vh'}}>
    <Header
      style={{
        padding: 0,
        height: 56,
        background: '#022450',
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}>
      <div className="logo" style={{width: 230}}>
        <svg width="48px" height="34px" viewBox="0 0 48 34" version="1.1" xmlns="http://www.w3.org/2000/svg"
             style={{marginLeft: 20}}>
          <title>Icon/z-Clarity</title>
          <desc>Created with Sketch.</desc>
          <g id="Analytics---Visualisations---No-Record" stroke="none" strokeWidth="1" fill="none"
             fillRule="evenodd">
            <g id="Artboard" transform="translate(-13.000000, -14.000000)">
              <rect id="Rectangle" fill="#CFD7E1" x="0" y="1" width="230" height="57"></rect>
              <g id="Icon/z-Clarity" transform="translate(13.000000, 14.000000)">
                <polyline id="Fill-3" fill="#0095D3"
                          points="32.9357506 0.0490681637 47.9728546 8.47711064 47.9486119 25.5930176 32.9357506 33.998104 24.0231284 28.9870703 39.5584235 20.7325717 39.5584235 13.2906008 33.2288672 10.0036955 24.0428103 5.0354107"></polyline>
                <polyline id="Fill-4" fill="#F38B00"
                          points="15.1085287 0.0490681637 0.0714246719 8.47711064 0.0956674016 25.5930176 15.1085287 33.998104 24.0222518 28.9861573 9.80598257 20.7325717 9.80598257 13.2906008 24.0432856 5.03491702"></polyline>
                <polyline id="Fill-5" fill="#004C70"
                          points="24.0231653 28.9872145 15.3320651 23.9409424 24.0283326 19.0892188 33.2681102 24.0755199"></polyline>
                <polyline id="Fill-6" fill="#98441E"
                          points="24.0418738 5.03403452 15.3690022 10.0620274 24.0586583 14.9635213 33.2078602 9.99220912"></polyline>
              </g>
            </g>
          </g>
        </svg>
        <span className="logo-text" style={{marginRight: 20}}>DCD</span>
      </div>
      <MenuOutlined style={{fontSize: 'large', marginLeft: 20}}/>
      <span className="uppercase" style={{fontSize: 'xx-large', marginLeft: 20}}>DHIS2 Campaign Dashboard App</span>
      <UserOutlined style={{fontSize: 'xx-large', marginLeft: 'auto', marginRight: 20}}/>
    </Header>
    <Content>
      <Tabs tabBarExtraContent={selectBox}>
        {store.currentDashboard.dashboardItemsGroups.map(group => <TabPane tab={group.name} key={group.id}>
          <ResponsiveGridLayout className="layout"
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
                <DisplayChart item={dashboardItem} orgUnitChange={onOrgUnitChange}/>
              </div>
            )}
          </ResponsiveGridLayout>
        </TabPane>)}
      </Tabs>
    </Content>
    <Footer style={{textAlign: 'center', height: 48, background: '#022450', color: 'white'}}>HISP Uganda</Footer>
  </Layout>
});
