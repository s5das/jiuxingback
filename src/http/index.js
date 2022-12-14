import axios from "axios";
import serverConfig from "./config";
import { ElMessage } from "element-plus";
// 创建axios实例
const serviceAxios = axios.create({
  baseURL: serverConfig.baseURL,
  timeout: 3000,
});


// 请求拦截
serviceAxios.interceptors.request.use(
  (config) => {
    // 业务逻辑

    // 如果开启token认证
    if (serverConfig.useTokenAuthorization) {
      config.headers["Authorization"] = 'Bearer ' + localStorage.getItem("token");
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// 响应拦截
serviceAxios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    let message = "";
    if (error && error.response) {
      switch (error.response.status) {
        case 302:
          message = "接口重定向了！";
          break;
        case 400:
          message = "参数不正确！";
          break;
        case 401:
          message = "您未登录，或者登录已经超时，请先登录！";
          ElMessage({
            message: '登录超时，请重新登录',
            type: 'warning',
          })
          setTimeout(() => {
            localStorage.clear()
            // 获取协议
            const handler = window.location.href.split(':')[0]
            window.location.href = handler + "://" + window.location.host 
          }, 1000);
          break;
        case 403:
          message = "您没有权限操作！";
          break;
        case 404:
          message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          message = "请求超时！";
          break;
        case 409:
          message = "系统已存在相同数据！";
          break;
        case 500:
          message = "服务器内部错误！";
          break;
        case 501:
          message = "服务未实现！";
          break;
        case 502:
          message = "网关错误！";
          break;
        case 503:
          message = "服务不可用！";
          break;
        case 504:
          message = "服务暂时无法访问，请稍后再试！";
          break;
        case 505:
          message = "HTTP 版本不受支持！";
          break;
        default:
          message = "异常问题，请联系管理员！";
          break;
      }

    }
    return Promise.reject(message);
  }
)

export default serviceAxios;