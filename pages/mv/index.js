
import { getTopMVList } from '../../api/network-video';

// 获取应用实例
const app = getApp()

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
      {'navgationTitle': 'MV', 'id': '10'}
    ],
    // 当前默认的选中索引
    currentTableIndex: 0,
    // 导航栏内容距离左侧距离
    navgationBarOffsetLeft: 0,
    // 导航栏内容宽度
    navgationBarContentWidth: 0,

    // 区域
    areaList: [{
      index: 0,
      name: '全部',
    },
    {
      index: 1,
      name: '内地',
    },
    {
      index: 2,
      name: '港台',
    },
    {
      index: 3,
      name: '欧美',
    },
    {
      index: 4,
      name: '日本',
    },
    {
      index: 5,
      name: '韩国',
    },
    ],
    currentAreaValue: '', // 歌手地区值
    currentTypeValue: -1, // 歌手类型值
    currentAreaIndex: 0, // 当前点击的歌手地区的索引值
    currentTypeIndex:0, // 歌手类型索引
    currentAreaName: '全部', // 歌手地区名字
    currentTypeName: '全部', // 歌手类型名字

    mvList: [], // mv列表数据

    // 筛选条件
    filterArray: [{
      text: '上升最快',
      value: '上升最快',
    },
    {
      text: '最热',
      value: '最热',
    },
    {
      text: '最新',
      value: '最新',
    },
    ],
    defaultFilterString: '上升最快',

    // 下拉刷新
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航栏内容宽度、高度
    this.getNavBarStyle();
    // 获取网络mv数据列表
    this.getTopMVData(0, this.data.currentAreaValue);
  },
  // 定义函数方法,获取导航栏内容宽度、高度
  getNavBarStyle() {
    // 界面上的节点查询,参考官方文档 
    // https://developers.weixin.qq.com/miniprogram/dev/framework/view/selector.html
    const query = wx.createSelectorQuery();
    query.select('.navgationbar-selected').boundingClientRect();
    query.exec((res) => {
      // console.log(res[0].left + '  ' + res[0].width);
      // console.log(res);
      this.setData({
        navgationBarOffsetLeft: res[0].left,
        navgationBarContentWidth: res[0].width,
      });
    })
  },
  // mv 点击区域item事件
  handleAreaActiveItem(event) {
    console.log(event);
    const value = event.currentTarget.dataset.name
    const index = event.currentTarget.dataset.index
    const name = event.currentTarget.dataset.name

    this.setData({ 
      currentAreaName: name,
      currentAreaIndex: index,
      currentAreaValue: value,
     })

    // 请求下拉刷新事件事件, 下拉刷新后覆盖掉原来的数据
    this.getTopMVData(0, this.data.currentAreaValue, this.data.defaultFilterString); 
  },
  // 封装网络的请求方法
  getTopMVData(offset, area, limit) {
    // 判断是否可以请求数据（hasMore 为 false 且 offset 不为 0，则不需要再请求数据）
    // 第一次请求数据可以过这个判断，增加 offset 的判断是为了避免 hasMore 初始化为 false 的情况
    if (!this.data.hasMore && offset !== 0) return;
    // wx.showNavigationBarLoading();
    wx.showLoading({
      title: '正在加载中...',
    })

    // 开始请求数据
    getTopMVList(offset, area, limit).then((result) => {
      console.log(result);
      console.log('没有请求数据吗');
      let newData = this.data.mvList;
      // 第一次请求数据，则使用新数据
      if (offset === 0) {
        newData = result.data
      } else {
        // 第N次，拼接在原数组后面
        newData = newData.concat(result.data)
      }
      
      this.setData({
        mvList: newData,
        hasMore: result.hasMore
      });

      // 关闭
      // wx.hideNavigationBarLoading();
      wx.hideLoading();
      // 关闭下拉刷新动画（数据加载完后主动停止，不设置则会在一定时间内停止）
      if (offset === 0) {
        wx.stopPullDownRefresh();
      }
    })
  },
  // 筛选条件下拉框
  changeFilterValue(event) {
    // console.log(event);
    const order = event.detail
    this.setData({
      defaultFilterString: order
    });
    // 调取接口显示满足符合的条件, 下拉刷新
    this.getTopMVData(0, this.data.currentAreaValue, order)
  },
  // 点击的item
  handleVideoItemClick(event) {
    // 获取页面 ID
    const id = event.currentTarget.dataset.item.id;
    console.log(id);
    // 开始播放

    
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
    this.getTopMVData(0, this.data.currentAreaValue, this.data.defaultFilterString);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 如果 hasMore 为 false，则没有更多数据，不需要继续加载
    // 和原数据进行拼接达到加载数据效果，保存最新的 hasMore 来判断数据是否加载完全
    this.getTopMVData(this.data.mvList.length + 1, this.data.currentAreaValue, this.data.defaultFilterString);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})