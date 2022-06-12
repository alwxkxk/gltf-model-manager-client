import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Image,
  Card,
  Alert,
  Button,
  Space,
  message,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { createRef, useEffect, useState } from "react";
import ModelAnalysisModal from "@/components/ModelAnalysisModal";
import {
  gtWriteToSeparateGltf,
  parseFilesToDocument,
} from "@/utils/gltf-transform-utils";
import ModelScene from "@/components/ModelScene";
import { getSpace, setSpace } from "@/utils/global-variable";
import { downloadBlobData, zipFiles } from "@/utils/utils";

function ModelInfoModal(param: {
  type: String;
  data: IModelInfo | null;
  onClose: Function;
}) {
  console.log("init ModelInfoModal");
  // TODO: type 分为 创建、编辑、查看三种。
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [modelSceneFiles, setModelSceneFiles] = useState<File[]>([]);
  const [jsonDoc, setJsonDoc] = useState(null);

  const closeFun = () => {
    param.onClose();
    setSpace(null);
  };

  const saveFun = async () => {
    const space = getSpace();
    let img: any = null;
    let fileListObj: any = null;

    if (space) {
      img = space.toImage();
      console.log("img", img);
    }
    if (jsonDoc) {
      fileListObj = await gtWriteToSeparateGltf(jsonDoc);
      console.log("fileListObj", fileListObj);
    }

    zipFiles(fileListObj).then((zip: Blob) => {
      downloadBlobData(zip, "model.zip");
    });

    // TODO: 先压缩，再测试下载到本地，看文件有没有损坏
    // Object.keys(fileListObj).forEach((key) => {
    //   downloadBlobData(fileListObj[key], key);
    // });

    // closeFun();
  };

  const analysisModalOnClose = () => {
    setAnalysisVisible(false);
  };
  const uploadFileBtnRef: React.Ref<HTMLInputElement> = createRef();
  const uploadFolderBtnRef: React.Ref<HTMLInputElement> = createRef();

  useEffect(() => {
    // 由于在元素上直接声明directory 会提示报错，改由JS动态修改。
    if (uploadFolderBtnRef.current !== null) {
      uploadFolderBtnRef.current.setAttribute("directory", "");
      uploadFolderBtnRef.current.setAttribute("webkitdirectory", "");
    }
  }, [uploadFolderBtnRef]);

  const uploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      parseFilesToDocument(files).then((doc) => {
        message.success("上传成功");
        console.log("parseFilesToDocument:", doc);
        setJsonDoc(doc);
      });
      setModelSceneFiles(Array.from(files));
    }

    // console.log("uploadChange", event, files);
  };

  const requiredRules = [{ required: true, message: "必填" }];

  return (
    <Modal
      title="新增模型信息"
      visible={true}
      centered
      onOk={saveFun}
      onCancel={closeFun}
      width={800}
      maskClosable={false}
      okText="确认"
      cancelText="取消"
    >
      <Row>
        <Col span={12}>
          <Form name="basic" autoComplete="off">
            <Form.Item
              label="模型文件"
              name="modelFiles"
              rules={param.type === "create" ? requiredRules : []}
            >
              <Space>
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => {
                    uploadFileBtnRef.current?.click();
                  }}
                >
                  文件
                </Button>
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => {
                    uploadFolderBtnRef.current?.click();
                  }}
                >
                  文件夹
                </Button>

                <input
                  type="file"
                  accept=".glb,.gltf"
                  ref={uploadFileBtnRef}
                  onChange={uploadChange}
                  className="hide"
                />

                <input
                  type="file"
                  ref={uploadFolderBtnRef}
                  onChange={uploadChange}
                  className="hide"
                />
              </Space>
            </Form.Item>

            <Form.Item label="模型名称" name="name" rules={requiredRules}>
              <Input disabled={param.type === "create" ? false : true} />
            </Form.Item>

            <Form.Item label="创建人" name="userName">
              <Input disabled />
            </Form.Item>

            <Form.Item label="标签" name="tags">
              <Input disabled />
            </Form.Item>

            <Form.Item label="模型说明" name="note">
              <TextArea rows={1} />
            </Form.Item>
          </Form>
        </Col>
        <Col span={12} className="flex-center">
          <Card
            style={{ width: 250, height: 250 }}
            bodyStyle={{ padding: 0, width: 250, height: 250 }}
          >
            {param.type === "create" ? (
              modelSceneFiles.length > 0 ? (
                <ModelScene files={modelSceneFiles}></ModelScene>
              ) : (
                <Alert
                  showIcon
                  message="上传模型后调整保存"
                  type="info"
                  style={{ position: "absolute", top: "100px", left: "14px" }}
                />
              )
            ) : (
              <Image width={250} height={250} src="/logo192.png" />
            )}
          </Card>
        </Col>
      </Row>
      <Row>
        <Button onClick={() => setAnalysisVisible(true)}>模型分析</Button>
      </Row>
      {analysisVisible && (
        <ModelAnalysisModal jsonDoc={jsonDoc} onClose={analysisModalOnClose} />
      )}
    </Modal>
  );
}

export default ModelInfoModal;
