import React from 'react';
import { Tabs } from 'antd'
import 'antd/dist/antd.min.css'
import './App.css';

// API mock
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser')
  worker.start()
}

const { TabPane } = Tabs

function App() {
  return (
    <Tabs defaultActiveKey="model-info" type="card">
      <TabPane tab="模型信息" key="model-info">
      model-info
      </TabPane>
      <TabPane tab="文件列表" key="file-list">
      file-list
      </TabPane>
    </Tabs>
  );
}

export default App;
