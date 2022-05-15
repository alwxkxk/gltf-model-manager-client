
import { Card } from 'antd';

const { Meta } = Card;

function ModelInfoItem(param:{data:IModelInfo}) {
  const paramData = param.data
    return (
      <Card
      style={{ width: 240 }}
      cover={
        <img
          alt="example"
          src={paramData.imgPath}
        />
      }
    >
      <Meta
        title={paramData.name}
        description={paramData.desc}
      />
    </Card>
    );
  }
  
  export default ModelInfoItem;
  