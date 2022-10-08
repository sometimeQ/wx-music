// app.js
import { gloableSystemMessage } from './utils/global';

App({
  onLaunch() {
    /*
      rpx 单位本质上就是一个百分比单位：100% 为 750rpx，若想将 px 转为 rpx
      let navBarHeight = 44；
      let navBarHeightNew = navBarHeight * 750 / wx.getSystemInfoSync().windowWidth;
    */
   
    // 设置系统全局对象保存信息
    gloableSystemMessage(this);
    
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    // console.log(this.globalData.navBarHeight);

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  // 定义数据
  globalData: {

  }
})
