export function respondBody(data,errInfo){
    if(errInfo){
        return {
            errCode:errInfo.code,
            errMsg:errInfo.msg,
            data:data
        }
    }else{
        return {
            errCode:0,
            data:data
        }
    }
}