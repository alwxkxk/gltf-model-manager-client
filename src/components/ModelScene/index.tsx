import { createRef, useEffect } from "react";
import Space from "@/utils/Space";
import { setSpace } from "@/utils/global-variable";

function ModelScene(param: { files: Array<File> }) {
  console.log("init ModelScene");
  const canvasContainerEle: React.Ref<HTMLDivElement> = createRef();

  useEffect(() => {
    if (canvasContainerEle.current) {
      // 如果里面有其它元素，清空
      if (canvasContainerEle.current.childNodes.length !== 0) {
        canvasContainerEle.current.innerHTML = "";
      }
      const space = new Space(canvasContainerEle.current);
      setSpace(space);
      if (param.files.length === 1) {
        const url = window.URL.createObjectURL(param.files[0]);
        space.loadGLTF(url);
        space.frameTargetView(space.scene);
        space.initGrid();
      } else {
        // TODO:待开发
        console.warn("待开发");
      }
    }
  }, [canvasContainerEle, param.files]);
  return <div className="full" ref={canvasContainerEle}></div>;
}

export default ModelScene;
