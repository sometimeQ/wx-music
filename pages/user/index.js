
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 状态栏高度
    statusBarHeight: app.globalData.statusBarHeight, 
    // 导航栏高度
    navgationBarHeight: app.globalData.navgationBarHeight,
    // 胶囊距离底部的距离
    menuMarginBotton: app.globalData.menuMarginBotton,
    // 胶囊距离右边的距离
    menuMarginRight: app.globalData.menuMarginRight,
    // 胶囊的高度
    menuHeight: app.globalData.menuHeight,
    // 屏幕的宽度
    screenWidth: app.globalData.screenWidth,

    // 定义导航栏的数组
    navgationBarList: [
      {'navgationTitle': '我的', 'id': '10'}
    ],
    // 当前默认的选中索引
    currentTableIndex: 0,
    // 导航栏内容距离左侧距离
    navgationBarOffsetLeft: 0,
    // 导航栏内容宽度
    navgationBarContentWidth: 0,
    
    // 用户信息
    userInfoList: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否登陆，如果没有登陆则跳转去登陆
    this.getLoaginStatus();
    // 获取导航栏内容宽度、高度
    this.getNavBarStyle();
  },
  /**
   * 获取登陆状态
   */
  getLoaginStatus: function () {
    // 获取登陆后接口返回的信息
    wx.getStorage({
      key: "userInfo",
      success: ((response) => {
        // 解析
        const userInfo = JSON.parse(response.data);
        this.setData({ userInfoList: userInfo });
      }),
      fail: (error => {
        // 如果没有信息则代表无登陆,跳转到登陆页界面
        wx.navigateTo({
          url: '/pages/login/index',
        })
      })
    })
  },
  /**
   * 获取导航栏宽度高度
   */
  getNavBarStyle() {
    // 界面上的节点查询,参考官方文档 
    // https://developers.weixin.qq.com/miniprogram/dev/framework/view/selector.html
    const query = wx.createSelectorQuery();
    query.select('.navgationbar-selected').boundingClientRect();
    query.exec((res) => {
      this.setData({
        navgationBarOffsetLeft: res[0].left,
        navgationBarContentWidth: res[0].width,
      });
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})