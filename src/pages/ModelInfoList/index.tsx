import ModelInfoItem from "./components/ModelInfoItem";
import { useState, useEffect } from "react";
import { Space, Input, Button, message } from "antd";
import { ChangeEvent } from "react";
import { getModelInfo } from "@/api/modelInfo";
import { PlusOutlined } from "@ant-design/icons";
import ModelInfoModal from "@/components/ModelInfoModal";

function ModelInfoList() {
  const [modelInfoList, setModelInfoList] = useState<IModelInfoList>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getModelInfo()
      .then((res) => {
        setModelInfoList(res.data);
      })
      .catch(() => {
        message.error("加载模型列表失败");
      });
  }, []);

  const searchModelInfo = (event: ChangeEvent) => {
    // TODO：延时搜索
    const element = event.target as HTMLInputElement;
    let param = null;
    if (element.value) {
      param = { keyword: element.value };
    }
    getModelInfo(param)
      .then((res) => {
        setModelInfoList(res.data);
      })
      .catch(() => {
        message.error("加载模型列表失败");
      });

    console.log("searchModelInfo:", element.value);
  };

  // TODO:标签选择组件
  return (
    <div>
      <Space className="mt-10">
        <Input placeholder="名称/描述" onChange={searchModelInfo} />
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
        />
      </Space>
      <br></br>
      <Space wrap className="mt-10">
        {modelInfoList.map((i) => {
          return <ModelInfoItem key={i.name} data={i} />;
        })}
      </Space>

      {visible && (
        <ModelInfoModal
          type={"create"}
          data={null}
          onClose={() => setVisible(false)}
        />
      )}
    </div>
  );
}

export default ModelInfoList;
