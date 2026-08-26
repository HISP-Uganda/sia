import React from "react";
import {Breadcrumb, Layout} from "antd";
import {Link} from "react-router-dom";

const {Content} = Layout;

export function Settings() {
  return  <Content className="content">
    <Breadcrumb className="breadcrumb" separator=" - ">
      <Breadcrumb.Item><Link to="/configurations">Administrative Panel</Link></Breadcrumb.Item>
      <Breadcrumb.Item>Settings</Breadcrumb.Item>
    </Breadcrumb>
    <div>
      Bill is a cat.
    </div>
  </Content>
}
