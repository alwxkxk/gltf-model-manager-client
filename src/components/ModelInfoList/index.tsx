import ModelInfoItem from "../ModelInfoItem";
import {useState,useEffect} from 'react';
import {  Space,Input  } from 'antd';
import { ChangeEvent } from "react";
import {getModelInfo} from "@/api/modelInfo"

function ModelInfoList() {
  const [modelInfoList,setModelInfoList] = useState<IModelInfoList>([])

  useEffect(()=>{
    getModelInfo().then(res=>{
      setModelInfoList(res.data)
    })
  },[])

  const searchModelInfo =(event:ChangeEvent)=>{
    const element = event.target as HTMLInputElement
    let param = null
    if(element.value){
      param = {keyword:element.value}
    }
    getModelInfo(param).then(res=>{
      setModelInfoList(res.data)
    })
    // TODO：延时搜索
    console.log('searchModelInfo:',element.value)
  }
  // TODO:标签选择组件
  return (
    <div>
    <Space className="mt-10">
       <Input placeholder="名称/描述" onChange={searchModelInfo}/>
    </Space>
    <br></br>
    <Space wrap className="mt-10">
      {
        modelInfoList.map((i)=>{
          return  <ModelInfoItem key={i.name} data={i}/>
        })
      }

    </Space>
    </div>

  );
}

export default ModelInfoList;
