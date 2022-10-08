
const BASE_URL2 = 'http://123.207.32.32:9001' // 接口 BASE_URL 地址
const BASE_URL = 'http://cloud-music.pl-fe.cn'

class Network {
  constructor() {
    this.baseUrl = BASE_URL;
  }
  
  // 封装的内部请求
  request(url, method, data) {
    // 使用promiss
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + url, // 基本配置信息
        method: method,
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
        },
        method: method,
        timeout: 10000,
        success: (result) => {
          resolve(result.data);
        },
        fail: (res) => {
          reject(res);
        },
        complete: (res) => {

        },
      })
    })
  }
  
  // 封装GET请求
  GET(url, params) {
    return this.request(url, 'GET', params);
  }

  // 封装POST请求
  POST(url, data) {
    return this.request(url, 'POST', data);
  }
}

// const network = new Network();

export default new Network();