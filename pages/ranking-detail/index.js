// pages/ranking-detail/index.js

import { getTopListDetail } from '../../api/network-music';
import{ rankingStore } from '../../store/index';


const app = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankingName: "", // 榜单名字
    // 状态栏高度
    statusBarHeight: app.statusBarHeight,
    // 导航栏高度
    navgationBarHeight: app.navgationBarHeight,
    // 胶囊距离底部的距离
    menuMarginBotton: app.menuMarginBotton,
    // 胶囊距离右边的距离
    menuMarginRight: app.menuMarginRight,
    menuTop: app.menuTop,
    menuMarginBotton: app.menuMarginBotton,

    // 胶囊的高度
    menuHeight: app.menuHeight,
    contentHeight: 0 , // 内容的高度

    rankingInfo: {},
    rankingSongList: [],

    rankingHeaderHeight: 0, // 榜单详情头部高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 拿到其他页面传递过来的参数
    if (options.type === "rank") { // 榜单详情  
      const name = options.ranking;
      // console.log(name);
      this.setData({ rankingName: name });
      // 获取playStore里面的数据
      rankingStore.onState(name, (result) => {
        console.log(result);
        // console.log(result.playlist);
        // console.log('------------------');
        this.setData({ 
          rankingInfo: result,
          rankingSongList:  result.tracks.splice(0, 50)
        });
      })
    } else {
      // 拿到id
      const id = options.id;
      // 请求网络数据
      getTopListDetail(id).then((result) => {
        console.log(result);
      })
    }

    // 动态计算内容的高度 
    // const globalData = getApp().globalData;
    const screenHeight = app.screenHeight;
    const statusBarHeight = app.statusBarHeight;
    const navgationBarHeight = app.navgationBarHeight;
    const deviceRadio = app.deviceRadio;
    const contentHeight = screenHeight  - statusBarHeight;
    this.setData({ contentHeight: contentHeight, isMusicLyric:  deviceRadio >= 2});

    console.log(screenHeight);
    console.log(statusBarHeight);
    console.log(navgationBarHeight);
    console.log(contentHeight);
    console.log('xxxxxxxxxx');


    // 获取头部高度
    this.getPlaylistHeaderHeight();
  },
  /**
   * 获取榜单详情头部高度
   */
  getPlaylistHeaderHeight() {
    const query = wx.createSelectorQuery().select(".ranking-header").boundingClientRect();
    query.exec((res) => {
      console.log('xxxxxxxxxxxxxxxx');
      console.log(res);
      this.setData({ rankingHeaderHeight: res[0].height + 20 });
    }); 
  },
  /**
   * 返回
   */
  handleBackBtnClick() {
    wx.navigateBack();
  },
  /**
   * 返回到
   */
  backToIndex() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})