import JSZip from "jszip";
/**
 * 将文件列表 打包成zip文件
 * @param  {{[key:string]:Blob}} fileListObj
 */
export function zipFiles(fileListObj: { [key: string]: Blob }): Promise<Blob> {
  const zip = new JSZip();
  Object.keys(fileListObj).forEach((key: string) => {
    zip.file(key, fileListObj[key]);
  });
  // 1 (best speed) and 9 (best compression)
  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6,
    },
  });
}

/**
 * 下载Blob数据文件
 *
 * @export
 * @param {*} data
 * @param {*} fileName
 */
export function downloadBlobData(blob: Blob, fileName: string) {
  const downloadElement = document.createElement("a");
  const href = window.URL.createObjectURL(blob);

  downloadElement.href = href;
  downloadElement.download = fileName;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}
