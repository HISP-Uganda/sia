import React, {useState} from "react";
import {Layout, Menu} from "antd";
import {
  SettingOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  MenuOutlined,
  UserOutlined
} from '@ant-design/icons';
import {Link, Route, useRouteMatch, Switch} from "react-router-dom";
import {Visualizations} from "./components/Visualizations";
import {Dashboards} from "./components/Dashboards";
import {Settings} from "./components/Settings";

const {Header, Footer, Sider} = Layout;

export function Configurations() {
  const [collapsed, setCollapsed] = useState(false);
  let {path, url} = useRouteMatch();
  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };
  return <Layout style={{minHeight: '100vh'}}>
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} width={230} className="sider" collapsedWidth={88}
           style={{background: '#022450', opacity: '80%'}}>
      <div className="logo">
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
        {!collapsed ? <span className="logo-text">DCD</span> : null}
      </div>
      <Menu theme="dark" mode="inline"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#022450',
              opacity: '80%',
              marginTop: 32
            }}>
        <Menu.Item key="1">
          <Link to={`${url}/visualizations`} style={{display: 'flex', alignItems: 'center'}}>
            <BarChartOutlined style={{fontSize: 'xx-large'}}/>
            <span className="label">Visualizations</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to={`${url}/dashboards`} style={{display: 'flex', alignItems: 'center'}}>
            <AppstoreOutlined style={{fontSize: 'xx-large'}}/>
            <span className="label">Dashboards</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to={`${url}/settings`} style={{display: 'flex', alignItems: 'center'}}>
            <SettingOutlined style={{fontSize: 'xx-large'}}/>
            <span className="label">Settings</span>
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout className="site-layout">
      <Header className="site-layout-background"
              style={{
                padding: 0,
                height: 56,
                background: '#022450',
                display: 'flex',
                alignItems: 'center',
                color: 'white'
              }}>
        <MenuOutlined style={{fontSize: 'large', marginLeft: 20}}/>
        <span className="uppercase" style={{fontSize: 'xx-large', marginLeft: 20}}>DHIS2 Campaign Dashboard App</span>
        <UserOutlined style={{fontSize: 'xx-large', marginLeft: 'auto', marginRight: 20}}/>
      </Header>
      <Switch>
        <Route exact path={path}>
          {/*<Redirect path={`${path}/visualizations`}/>*/}
          <Visualizations/>
        </Route>
        <Route path={`${path}/visualizations`}>
          <Visualizations/>
        </Route>
        <Route path={`${path}/dashboards`}>
          <Dashboards/>
        </Route>
        <Route path={`${path}/settings`}>
          <Settings/>
        </Route>
      </Switch>
      <Footer style={{textAlign: 'center', height: 48}}>HISP Uganda</Footer>
    </Layout>
  </Layout>
}
