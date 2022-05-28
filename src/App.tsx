import { useState, useEffect } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import ModelInfoList from "@/pages/ModelInfoList";
import FileList from "@/pages/FileList";
import { Layout, Menu } from "antd";
import { MenuClickEventHandler, MenuInfo } from "rc-menu/lib/interface";

const { Header, Content } = Layout;
// API mock
if (process.env.REACT_APP_MOCK === "true") {
  const { worker } = require("./mocks/browser");
  worker.start();
}

const pages = [
  { label: "模型信息", key: "ModelInfoList" },
  { label: "文件列表", key: "FileList" },
];

const renderPage = (name: string) => {
  console.log("renderPage", name);
  let result = <ModelInfoList />;
  switch (name) {
    case "ModelInfoList":
      result = <ModelInfoList />;
      break;
    case "FileList":
      result = <FileList />;
      break;
    default:
      break;
  }
  return result;
};

function App() {
  const [pageName, setPageName] = useState("ModelInfoList");

  useEffect(() => {}, []);

  const clickMenu: MenuClickEventHandler = (info: MenuInfo) => {
    setPageName(info.key);
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={pages}
          onClick={clickMenu}
        />
      </Header>
      <Content style={{ padding: "0 50px" }}>{renderPage(pageName)}</Content>
    </Layout>
  );
}

export default App;
