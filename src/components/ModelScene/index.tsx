import { createRef, useEffect } from "react";
import Space from "@/utils/Space";

function ModelScene(param: { files: Array<File> }) {
  console.log("init ModelScene");
  const canvasContainerEle: React.Ref<HTMLDivElement> = createRef();

  useEffect(() => {
    if (canvasContainerEle.current) {
      // 避免重复创建
      if (canvasContainerEle.current.childNodes.length === 0) {
        const space = new Space(canvasContainerEle.current);
        if (param.files.length === 1) {
          const url = window.URL.createObjectURL(param.files[0]);
          space.loadGLTF(url);
          space.frameTargetView(space.scene);
        } else {
          space.initDemo();
        }
      }
    }
  }, [canvasContainerEle, param.files]);
  return <div className="full" ref={canvasContainerEle}></div>;
}

export default ModelScene;
