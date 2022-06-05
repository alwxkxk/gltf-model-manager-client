import { Document } from "@gltf-transform/core";
import { Modal, Table } from "antd";
import { inspect } from "@gltf-transform/functions";

const textureColumns = [
  {
    title: "name",
    dataIndex: "name",
  },
  {
    title: "mimeType",
    dataIndex: "mimeType",
  },
  {
    title: "instances",
    dataIndex: "instances",
  },
  {
    title: "slots",
    dataIndex: "slots",
  },
  {
    title: "resolution",
    dataIndex: "resolution",
  },
  {
    title: "size",
    dataIndex: "size",
  },
  {
    title: "gpuSize",
    dataIndex: "gpuSize",
  },
];

const materialsColumns = [
  {
    title: "name",
    dataIndex: "name",
  },
  {
    title: "instances",
    dataIndex: "instances",
  },
  {
    title: "doubleSided",
    dataIndex: "doubleSided",
  },
  {
    title: "alphaMode",
    dataIndex: "alphaMode",
  },
  {
    title: "textures",
    dataIndex: "textures",
  },
];

const meshesColumns = [
  {
    title: "name",
    dataIndex: "name",
  },
  {
    title: "instances",
    dataIndex: "instances",
  },
  {
    title: "attributes",
    dataIndex: "attributes",
  },
  {
    title: "indices",
    dataIndex: "indices",
  },
  {
    title: "mode",
    dataIndex: "mode",
  },
  {
    title: "primitives",
    dataIndex: "primitives",
  },
  {
    title: "glPrimitives",
    dataIndex: "glPrimitives",
  },
  {
    title: "size",
    dataIndex: "size",
  },
  {
    title: "vertices",
    dataIndex: "vertices",
  },
];

export function transformFileSize(val: number) {
  let flag = "KB";
  let result = val / 1024;

  if (result > 1024) {
    result = result / 1024;
    flag = "MB";
  }
  return `${result.toFixed(2)}${flag}`;
}

// // 添加key，将值为数组的转换成字符串，用逗号分隔
// // 含size的转换成KB或MB
const refactorProperties = (obj: any) => {
  const newObj = JSON.parse(JSON.stringify(obj));
  Object.keys(obj).forEach((key: string) => {
    if (Array.isArray(obj[key])) {
      newObj[key] = obj[key].join(",");
    } else if (typeof obj[key] === "boolean") {
      newObj[key] = String(obj[key]);
    } else if (key.includes("size") || key.includes("Size")) {
      newObj[key] = transformFileSize(obj[key]);
    }
  });
  newObj.key = new Date();
  return newObj;
};

function ModelAnalysisModal(param: {
  onClose: Function;
  jsonDoc: Document | null;
}) {
  let textureData: Array<any> = [];
  let materialsData: Array<any> = [];
  let meshesData: Array<any> = [];
  if (param.jsonDoc) {
    const obj = inspect(param.jsonDoc);
    if (obj.textures && obj.textures.properties) {
      textureData = obj.textures.properties.map(refactorProperties);
    }

    if (obj.materials && obj.materials.properties) {
      materialsData = obj.materials.properties.map(refactorProperties);
    }

    if (obj.meshes && obj.meshes.properties) {
      meshesData = obj.meshes.properties.map(refactorProperties);
    }
  }

  console.log(
    "init ModelAnalysisModal",
    textureData,
    materialsData,
    meshesData
  );
  const closeFun = () => {
    param.onClose();
  };
  return (
    <Modal
      title="模型分析"
      zIndex={1001}
      visible={true}
      onOk={closeFun}
      onCancel={closeFun}
      centered
      width={"100%"}
      maskClosable={false}
      okText="确认"
      cancelText="取消"
      bodyStyle={{ overflow: "auto" }}
    >
      <div className="pl-10">纹理(texture)</div>
      <Table columns={textureColumns} dataSource={textureData} />
      <div className="pl-10">材质(materials)</div>
      <Table columns={materialsColumns} dataSource={materialsData} />
      <div className="pl-10">网格(meshes)</div>
      <Table columns={meshesColumns} dataSource={meshesData} />
    </Modal>
  );
}

export default ModelAnalysisModal;
