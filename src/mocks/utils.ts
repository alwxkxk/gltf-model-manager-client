export function respondBody(
  data: any,
  errInfo?: { code: number; msg: string }
) {
  if (errInfo) {
    return {
      errCode: errInfo.code,
      errMsg: errInfo.msg,
      data: data,
    };
  } else {
    return {
      errCode: 0,
      data: data,
    };
  }
}
