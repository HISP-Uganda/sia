import React from 'react'
import {Input, Form} from 'antd'
import {observer} from 'mobx-react';
import {useStore} from "../../Contexts";

const {TextArea} = Input;

export const BasicDetails = observer(() => {
  const store = useStore();
  return (
    <Form layout="vertical">
      <Form.Item label="Visualization Name">
        <Input size="large" placeholder="Visualization name" value={store.currentDashboard.name}
               onChange={store.currentDashboard.changeName}/>
      </Form.Item>
      <Form.Item label="Visualization Description">
        <TextArea rows={4} value={store.currentDashboard.description}
                  onChange={store.currentDashboard.changeDescription}/>
      </Form.Item>
    </Form>
  )
});
