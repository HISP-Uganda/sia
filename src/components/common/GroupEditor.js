import {observer} from "mobx-react";
import {Transfer} from "antd";
import React from "react";

export const GroupEditor = observer(({dataSource, targetKeys, onChange}) => {
  return <Transfer
    className="mb-4"
    operationStyle={{
      width: '10%',
      height: '100%',
      margin: 0,
      padding: 10,
      marginLeft: 'auto',
      marginRight: 'auto',
      background: 'yellow',
      flexDirection: 'column',
      alignContent: 'center',
      alignItems: 'center'
    }}
    listStyle={{
      width: '45%',
      height: 350
    }}
    showSearch
    dataSource={dataSource}
    titles={['Source', 'Target']}
    targetKeys={targetKeys}
    onChange={onChange}
    render={(item) => item.title}
  />
});
