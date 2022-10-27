// pages/playlist-detail/index.js

import { getRankingList } from '../../api/network-music';
import { playerStore, rankingStore } from '../../store/index';

const app = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 状态栏高度
    statusBarHeight: app.statusBarHeight,
    // 导航栏高度
    navgationBarHeight: app.navgationBarHeight,
    // 胶囊距离底部的距离
    menuMarginBotton: app.menuMarginBotton,
    // 胶囊距离右边的距离
    menuMarginRight: app.menuMarginRight,
    menuTop: app.menuTop,
    // 胶囊的高度
    menuHeight: app.menuHeight,
    playlistInfo: {},
    // 歌单详情头部高度,用来拼接底部的列表margin-top
    playlistHeaderHeight: 0, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 接收跳转传入的参数
    const id = options.id;

    // 网络请求
    getRankingList(id).then((result) => {
      // console.log("??????????????");
      // console.log(result);
      this.setData({ playlistInfo: result.playlist });
    });

    // 获取歌单头部高度
    this.getPlaylistHeaderHeight();
  },

  /**
   * 获取歌单详情头部高度
   */
  getPlaylistHeaderHeight() {
    const qury = wx.createSelectorQuery();
    qury.select('.playlist-header').boundingClientRect().exec((result) => {
      // console.log(result);
      // console.log('完毕啦啊啊啊');
      this.setData({ playlistHeaderHeight: result[0].height + 20 });
      // 从vuex里面获取数据
      rankingStore.onState("moveDistance", (moveDistance) => {
        console.log(moveDistance);
        console.log('什么情况');

        // 保存起来，方便其他的子组件需要用着
        this.setData({ playlistHeaderHeight: result[0].height + 20 + moveDistance });
      })

    });
  },
  /**
   * 点击返回
   */
  handleBackBtnClick() {
    wx.navigateBack();
  },
  /**
   * 回到首页
   */
  backToIndex() {
    // 就是关闭销毁内存中不存在的页面了
    wx.reLaunch({
      url: '../index/index',
    })
  },
  /**
   * 点击item的点击事件
   */
  handleSongItemClick(event) {
    console.log(event);
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