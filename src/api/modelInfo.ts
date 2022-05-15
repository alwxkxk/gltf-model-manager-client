// TODO: 需要给fetch 加一个拦截器或者把常用的抽出函数
export function getModelInfo(params?:any) {
    let url = `/modelInfo` 
    if(params){
        url += `?${new URLSearchParams(params)}`
    }
    return fetch(url).then((res:Response)=>{
        return res.json()
    })
}