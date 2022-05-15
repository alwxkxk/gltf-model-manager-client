import { rest } from 'msw'
import { respondBody } from './utils'

export const modelInfo = [
    rest.get('/modelInfo', (req, res, ctx) => {
      
      let data = []
      for (let index = 0; index < 15; index++) {
        data.push({name:`模型${index}`,imgPath:'/logo192.png',desc:`模型${index}描述`})
      }

      const keyword = req.url.searchParams.get('keyword')
      if(keyword){
        data = data.filter(i=>{
          if(i.name.includes(keyword) || i.desc.includes(keyword)){
            return true
          }else{
            return false
          }
        })
      }
      return res(
        // Respond with a 200 status code
        ctx.status(200),
        ctx.json(respondBody(data))
      )
    })
  ]