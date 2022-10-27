const gloableSystemMessage = (object) => {
  // 获取系统信息
  const systemInfo = wx.getSystemInfoSync();
  // 获取状态栏高度
  object.globalData.statusBarHeight = systemInfo.statusBarHeight;
  // 获取屏幕宽度
  object.globalData.screenWidth = systemInfo.screenWidth;
  // 获取屏幕高度
  object.globalData.screenHeight = systemInfo.screenHeight;

  // 胶囊按钮位置信息
  const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
  // console.log(systemInfo.screenWidth);
  // console.log(menuButtonInfo.right);
  // 导航栏高度
  object.globalData.navgationBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
  // 胶囊距离右边的间距
  object.globalData.menuMarginRight = systemInfo.screenWidth - menuButtonInfo.right;
  // 胶囊距离底部间距
  object.globalData.menuMarginBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
  object.globalData.menuTop = menuButtonInfo.top;

  // 胶囊高度
  object.globalData.menuHeight = menuButtonInfo.height;
  // 宽高比
  object.globalData.deviceRadio = systemInfo.screenHeight / systemInfo.screenWidth;
}

/**
 * 这样导出的话，其他js引入界面的是需要import {  xx } from '/文件的路径的',
 * 如果是直接方法里面写入的export default function xxx函数名，那么在其他的js界面引入的是 import xxx from 'xxx 文件的路径'
 */
module.exports = {
  gloableSystemMessage
};