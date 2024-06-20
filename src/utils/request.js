import axios from 'axios' // 引入 axios
import { ElMessage } from 'element-plus' // 直接在页面提示消息
import router from '../router' // 用于路径跳转

// create axios instance
const service = axios.create({
  // The public part of URL
  baseURL: '/api',
  // baseURL: process.env.VUE_APP_BASE_API,//'/Model',
  timeout: 10000,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})

// request interceptors
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptors
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response)
    }
  },
  (error) => {
    if (!error.request.status == 0) {
      if (error.response.status) {
        switch (error.response.status) {
          case 404:
            ElMessage.warning('接口不存在，请刷新重试或联系管理员')
            break
          case 500:
            ElMessage.error('服务异常，请稍后刷新重试或联系管理员')
            break
          case 502:
            ElMessage.error('服务异常，请稍后刷新重试或联系管理员')
            break
          default:
            ElMessage.warning(error.response.data.message)
            return Promise.reject(error.response)
        }
      }
    } else {
      ElMessage.error(error.message)
    }
  }
)

/**
 * Encapsulate get methods,corresponding to get request
 * @param {string} url Request URL
 * @param {object} params Query parameters
 * @returns {Promise}
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params: params
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
export function get_id(url) {
  return new Promise((resolve, reject) => {
    service
      .get(url)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
/**
 * Encapsulate post methods,corresponding to post request
 * @param {string} url Request URL
 * @param {object} data Query parameters
 * @param {boolean | undefined} info The form of the request body(Is FormData)
 * @returns {Promise}
 */
export function post(url, data = {}, info) {
  return new Promise((resolve, reject) => {
    let newData = data
    if (info) {
      //  Convert to FormData format
      // newData = new FormData()
      // for (let i in data) {
      //   newData.append(i, data[i])
      // }
      service
        .post(url, newData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.data)
        })
    } else {
      console.log(newData)
      service
        .post(url, newData)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.data)
        })
    }
  })
}

/**
 * Encapsulate put methods,corresponding to put request
 * @param {string} url Request URL
 * @param {object} params Query parameters
 * @returns {Promise}
 */
export function put(url, params = {}) {
  return new Promise((resolve, reject) => {
    service.put(url, params).then(
      (res) => {
        resolve(res.data)
      },
      (err) => {
        reject(err.data)
      }
    )
  })
}

/**
 * Encapsulate axiosDelete methods,corresponding to Delete request
 * @param {string} url Request URL
 * @param {object} params Query parameters
 * @returns {Promise}
 */
export function axiosDelete(url, params = {}) {
  return new Promise((resolve, reject) => {
    service
      .delete(url, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}

// export default service
