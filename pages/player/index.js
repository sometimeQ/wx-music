import { audioContext, playerStore } from '../../store/index';

// pages/player/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songId: '', // 歌曲id
    currentSong: {}, // 当前歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 接收index,点击item传递过来的参数
    this.setData({ songId: options.id });
    // 调取接口信息
    const songId = options.id;
    playerStore.dispatch("playMusicWithSongIdAction", {id: songId});
    // 数据监听
    this.setupPlayerStoreListener();
  },
  /**
   * 监听
   */
  setupPlayerStoreListener() {
    // 1.监听currentSong/durationTime/lyricInfos, vuex里面的
    playerStore.onState(["currentSong", "durationTime", "lyricInfos"], this.handleCurrentMusicListener);



  },
  // 绑定监听的函数
  handleCurrentMusicListener() {

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