import { JSONDocument, WebIO } from "@gltf-transform/core";
import { TextureBasisu, TextureTransform } from "@gltf-transform/extensions";

// 要注册扩展，否则加载模型时用到那些扩展会报错
const io = new WebIO({ credentials: "include" }).registerExtensions([
  TextureBasisu,
  TextureTransform,
]);

/**
 * 读取glb文件
 * @param  {Blob} blob
 * @returns {Promise<Document>}
 */
export async function gtReadGlb(blob: Blob): Promise<any> {
  const arrayBuffer = await blob.arrayBuffer();
  return io.readBinary(new Uint8Array(arrayBuffer));
}

/**
 * 读取gltf文件(embedded)，输入url
 * @param  {String} url
 * @returns {Promise<Document>}
 */
export function gtReadGltf(url: string): Promise<any> {
  // io.readAsJSON(url).then((res) => {
  //   console.log("readAsJSON", res);
  // });
  return io.read(url);
}

/**
 * 读取gltf文件(separate)，输入url
 * @param  {string} url
 * @param  {Map} filesBufferMap
 * @returns {Promise<Document>}
 */
export function gtReadSeparateGltf(
  url: string,
  filesBufferMap: Map<string, Uint8Array>
): Promise<any> {
  const jsonDoc: JSONDocument = {
    json: {
      asset: { version: "2.0" },
      images: [],
    },
    resources: {},
  };
  return fetch(url)
    .then((response) => response.json())
    .then(async (json) => {
      jsonDoc.json = json;
      filesBufferMap.forEach((buffer, fileName) => {
        jsonDoc.resources[fileName] = buffer;
      });
      console.log("jsonDoc", jsonDoc);
      // TODO:针对外部的资源还要额外处理
      return io.readJSON(jsonDoc);
    });
}

// /**
//  * 将文档 转换成对象 {文件名:blob对象}
//  * @param  {} doc
//  */
// export function gtWriteToSeparateGltf(doc) {
//   const options = {
//     basename: "model",
//   };
//   const obj = io.writeJSON(doc, options);
//   // {
//   //   json:{...},// 一个对象，对应
//   //   resources:{...} // 多个ArrayBuffer，包括：.bin , 及纹理等的 .jpg
//   // }

//   // 该库会将图片名字改变成 ${basename}.jpg 这样子的
//   const result = {};
//   const jsonBlob = new Blob([JSON.stringify(obj.json)], {
//     type: "application/json",
//   });
//   result["model.gltf"] = jsonBlob;

//   Object.keys(obj.resources).forEach((key) => {
//     result[key] = new Blob([obj.resources[key]]);
//   });

//   console.log("gtWriteToSeparateGltf", obj, result);
//   return result;
// }

/**
 * 从文件数组里生成对应的 urlMap,bufferMap。
 * @param  {FileList} files
 */
export function generateFilesMap(files: FileList): Promise<any> {
  const filesArr = Array.from(files);
  const filesUrlMap: Map<string, string> = new Map();
  const filesBufferMap: Map<string, Uint8Array> = new Map();
  const fileBufferPromiseList: Array<Promise<any>> = [];
  filesArr.forEach((file) => {
    filesUrlMap.set(file.name, window.URL.createObjectURL(file));
    const p = file.arrayBuffer().then((buffer: ArrayBuffer) => {
      filesBufferMap.set(file.name, new Uint8Array(buffer));
    });
    fileBufferPromiseList.push(p);
  });

  return Promise.all(fileBufferPromiseList).then(() => {
    return { filesUrlMap, filesBufferMap };
  });
}
/**
 * 解析文件成doc。
 * @param  {FileList} files
 */
export function parseFilesToDocument(files: FileList): Promise<any> {
  if (files.length === 1) {
    if (files[0].name.includes(".glb") || files[0].name.includes(".gltf")) {
      const url = window.URL.createObjectURL(files[0]);
      return gtReadGlb(files[0])
        .then((doc) => {
          console.log("gtReadGlb", doc, doc.getRoot().listTextures());
          window.URL.revokeObjectURL(url);
          return doc;
        })
        .catch((err) => {
          window.URL.revokeObjectURL(url);
          return Promise.reject(err);
        });
    } else {
      return Promise.reject("文件格式需要是glb/gltf");
    }
  } else {
    console.log("本地选择多文件：", files);
    return generateFilesMap(files).then((obj) => {
      // console.log('generateFilesMap', res)
      const filesUrlMap = obj.filesUrlMap;
      const filesBufferMap = obj.filesBufferMap;

      const disposeFun = () => {
        // 释放资源
        filesUrlMap.forEach((url: string) => {
          window.URL.revokeObjectURL(url);
        });
        filesUrlMap.clear();
        filesBufferMap.clear();
      };

      let rootFileUrl: string = "";
      let errorMsg = null;
      filesUrlMap.forEach((url: string, fileName: string) => {
        if (fileName.includes(".gltf")) {
          if (!rootFileUrl) {
            rootFileUrl = url;
          } else {
            // 存在多个gltf文件
            errorMsg = "文件夹里不允许存在多个gltf文件";
          }
        }
      });

      if (!rootFileUrl) {
        errorMsg = "没找到gltf文件";
      }

      if (errorMsg) {
        console.error(errorMsg);
        return Promise.reject(errorMsg);
      }

      return gtReadSeparateGltf(rootFileUrl, filesBufferMap)
        .then((doc) => {
          console.log("gtReadSeparateGltf", doc, doc.getRoot().listTextures());
          disposeFun();
          return doc;
        })
        .catch((err) => {
          disposeFun();
          return Promise.reject(err);
        });
    });
  }
}
