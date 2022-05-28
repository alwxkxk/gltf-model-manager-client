import { Card } from "antd";

const { Meta } = Card;

function ModelInfoItem(param: { data: IModelInfo }) {
  const paramData = param.data;
  const clickModel = () => {
    console.log("clickModel", param);
  };
  return (
    <Card
      style={{ width: 240 }}
      cover={<img alt="example" src={paramData.imgPath} />}
      onClick={clickModel}
    >
      <Meta title={paramData.name} description={paramData.desc} />
    </Card>
  );
}

export default ModelInfoItem;
