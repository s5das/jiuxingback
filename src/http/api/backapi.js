import serviceAxios from "..";
export const logIn = (info)=>{
    return serviceAxios({
        method:'post',
        url:'/api/v1/login',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            username:info.username,
            password:info.password
        }
    })
}

export const getInfoByPage= (currentPage) => {
       return serviceAxios({
        method:'get',
        url:'/api/v1/queryByPage',
        params:{
            page:currentPage
        }
       })
}

export const deleteRecord = (id) => {
      return serviceAxios({
        method:'delete',
        url:'/api/v1/deleteById',
        params:{
            id
        }
      })
}

export const getInfoByFilter = (arg,page,filter_type) => {
       return serviceAxios({
          method:'get',
          url:"/api/v1/queryByFilter",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
          params:{
            arg,
            page,
            filter_type
          }
       })
}

export const getblob = ()=>{
    return serviceAxios({
        responseType: 'arraybuffer',
        url:'/api/v1/getExcel',
        method:'get'
    })
}