import { Col, Form, Input, Modal, Row, Image, Card, Alert, Button } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";

function ModelInfoModal(param: {
  type: String;
  data: IModelInfo | null;
  onClose: Function;
}) {
  // TODO: type 分为 创建、编辑、查看三种。

  const closeFun = () => {
    param.onClose();
  };

  const uploadModel = () => {
    console.log("uploadModel");
  };

  const modelList: Array<IModelInfo> = [];

  return (
    <Modal
      title="新增模型信息"
      visible={true}
      centered
      onOk={closeFun}
      onCancel={closeFun}
      width={800}
      maskClosable={false}
      okText="确认"
      cancelText="取消"
    >
      <Row>
        <Col span={12}>
          <Form name="basic" autoComplete="off">
            <Form.Item label="模型名称" name="name">
              <Input placeholder="模型名称必填" />
            </Form.Item>

            <Form.Item label="创建人" name="userName">
              <Input disabled />
            </Form.Item>

            <Form.Item label="标签" name="tags">
              <Input disabled />
            </Form.Item>

            <Form.Item label="模型说明" name="note">
              <TextArea rows={3} />
            </Form.Item>
          </Form>
        </Col>
        <Col span={12} className="flex-center">
          <Card style={{ width: 250, height: 250 }} bodyStyle={{ padding: 0 }}>
            {param.type === "create" ? (
              <Alert
                showIcon
                message="上传模型后选择生成缩略图"
                type="info"
                style={{ position: "absolute", top: "100px", left: "14px" }}
              />
            ) : (
              <Image width={250} height={250} src="/logo192.png" />
            )}
          </Card>
        </Col>
      </Row>

      <Row>
        模型列表
        <Button
          type="primary"
          shape="circle"
          size="small"
          style={{ marginLeft: 10 }}
          icon={<PlusOutlined />}
          onClick={() => uploadModel}
        />
      </Row>
      {modelList.length < 1 ? (
        <Alert
          showIcon
          message="暂无数据"
          type="info"
          style={{ margin: "10px", width: 200 }}
        />
      ) : (
        modelList.map((i) => {
          return <Row key={i.name}> {i.name}</Row>;
        })
      )}
    </Modal>
  );
}

export default ModelInfoModal;
