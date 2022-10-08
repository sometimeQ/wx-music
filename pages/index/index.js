// index.js
import { getBanners, getRecommendSongs, 
  getRecommendPlaylist, registerLogin,
  getArtistList 
} from '../../api/network-music';
import quryNode from '../../utils/util';
import { throttle, getRandomArrayList } from  '../../utils/util';
// 引入全局共享数据状态管理
import { rankingStore, rankingMap } from '../../store/index';

// 获取应用实例
const app = getApp()
// 使用节流生成函数来使用
const throttleQueryRect = throttle(quryNode, 1000, {
  trailing: true
});

Page({
  // 数据定义在data里面进行, 页面的初始数据
  
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
      {'navgationTitle': '推荐', 'id': '10'}, 
      {'navgationTitle': '音乐馆', 'id': '11'}, 
      {'navgationTitle': '歌手', 'id': '12'}
    ],
    // 当前默认的选中索引
    currentTableIndex: 0,
    // 导航栏内容距离左侧距离
    navgationBarOffsetLeft: 0,
    // 导航栏内容宽度
    navgationBarContentWidth: 0,

    // 轮播图数据
    banners: [],
    // 轮播图的高度
    swiperHeight: 0,

    // 推荐歌曲数据列表
    recommendSongs: [],
    // 推荐歌曲总的数据
    recommendTotalSongs: [],

    // 个性推荐网络数据
    recommendPlaylist: [],

    // 底部飙升榜
    rankings: {
      0: {},
      1: {},
      2: {}
    }, // 榜单数据（初始化数据保证数据顺序）
    allRankingList: [], // 所有榜单数据

    // 歌手地区分类
    areaList: [{
      index: 0,
      name: '全部',
      value: -1
    },
    {
      index: 1,
      name: '华语',
      value: 7
    },
    {
      index: 2,
      name: '欧美',
      value: 96
    },
    {
      index: 3,
      name: '日本',
      value: 8
    },
    {
      index: 4,
      name: '韩国',
      value: 16
    },
    {
      index: 5,
      name: '其他',
      value: 0
    },
    ],
    // 歌手性别
    typeList: [{
        index: 0,
        name: '全部',
        value: -1
      },
      {
        index: 1,
        name: '男',
        value: 1
      },
      {
        index: 2,
        name: '女',
        value: 2
      },
      {
        index: 3,
        name: '乐队',
        value: 3
      },
    ],
    singerTypeList: [], // 歌手分类网络请求数据
    currentAreaValue: -1, // 歌手地区值
    currentTypeValue: -1, // 歌手类型值
    currentAreaIndex: 0, // 当前点击的歌手地区的索引值
    currentTypeIndex:0, // 歌手类型索引
    currentAreaName: '全部', // 歌手地区名字
    currentTypeName: '全部', // 歌手类型名字
    singerTypeList: [], // 歌手数据列表
    singerFlag: true, // 是否完成请求
    hasMore: true, // 是否还有更多数据

  },
  // 生命周期函数--监听页面加载
  onLoad() {
    // 游客登陆
    this.registerLogin();
    // 获取导航栏内容宽度、高度
    this.getNavBarStyle();
    // 请求轮播图数据
    this.requestBannerData();
    // 发起全局共享数据请求
    rankingStore.dispatch('getAllRankingDataAction');
    rankingStore.dispatch('getRankingDataAction');
    
    // 从 store 中获取共享数据, 巅峰排行榜网络数据, 对应的key value
    rankingStore.onState("rankingZero", this.getRankingList(0));
    rankingStore.onState("rankingOne", this.getRankingList(1));
    rankingStore.onState("rankingTwo", this.getRankingList(2));
    rankingStore.onState("allRankingList", this.getAllRankingList());

    // 请求推荐歌曲网络数据
    this.getRecommendSongs();
    // 请求个性推荐网络数据
    this.getRecommendPlaylist();
  },
  registerLogin() {
    registerLogin().then((response) => {
      console.log(response);
    })
  },
  // 点击处理导航栏的事件
  switchNavagationBar: function (e) {
    console.log('点击处理的函数');
    console.log(e);

    // 如果点击导航栏item相等
    if (e.currentTarget.dataset.index === this.data.currentTableIndex) return;
    
    this.setData({
      currentTableIndex: e.currentTarget.dataset.index,
    }, function () {
      // console.log('进来了回调吗');
      // 查询节点
      quryNode('.navgationbar-selected').then((response) => {
        const nodeRect = response[0];
        console.log(nodeRect);
        const w = nodeRect.width + this.data.menuMarginRight + 5;
        this.setData({
          navgationBarOffsetLeft: nodeRect.left,
          navgationBarContentWidth: w,
        })
      })
    });



  // 查询激活节点宽度
  this.getNavBarStyle();

   // 调取对应的接口展示数据,歌手网络请求接口数据
   if (e.currentTarget.dataset.index == 2 && this.data.singerFlag) {
    getArtistList(this.data.currentTypeValue, 30, 0, this.data.currentAreaValue).then((response) => {
      // console.log('请求歌手分类接口啦');
      // console.log(response);
      this.setData({ 
        singerTypeList: response.artists,
        singerFlag: false, 
      });
    })
   }
  },
  // 定义函数方法,获取导航栏内容宽度、高度
  getNavBarStyle() {
    // 界面上的节点查询,参考官方文档 
    // https://developers.weixin.qq.com/miniprogram/dev/framework/view/selector.html
    const query = wx.createSelectorQuery();
    query.select('.navgationbar-selected').boundingClientRect();
    query.exec((res) => {
      // console.log(res[0].left + '  ' + res[0].width);
      // console.log('差那么一点点');
      // console.log(res);
      // console.log('感觉还是差点');
      this.setData({
        navgationBarOffsetLeft: res[0].left,
        navgationBarContentWidth: res[0].width,
      });
    })
  },
  // 网络数据请求相关
  requestBannerData() {
    getBanners().then((response) => {
      // console.log(response);
      // 改变data里面定义的banner的值
      this.setData({
        banners: response.banners
      });
    })
  },
  // 滑动切换navgationbar事件
  changeNavbarAction(e) {
    // console.log(e.detail);
    // 不然和上面的点击导航栏的item切换会有问题
    if (e.detail.source !== 'touch') return;
    // 设置导航栏底部的偏移
    this.setData({
      currentTableIndex: e.detail.current,
    })

    //计算屏幕的高度
    // let buffer = (750 / res.windowWidth) * res.windowHeight-80;

    // 查询节点,设置激活样式
    this.getNavBarStyle();
    // quryNode('.navgationbar-selected').then((response) => {
    // const nodeRect = response[0];
    // this.setData({
    //     navgationBarOffsetLeft: nodeRect.left,
    //     navgationBarContentWidth: nodeRect.width + this.data.menuMarginRight,
    //   })
    // })

    // 调取对应的接口展示数据,歌手网络请求接口数据
    if (e.detail.current == 2 && this.data.singerFlag) {
      getArtistList(this.data.currentTypeValue, 30, 0, this.data.currentAreaValue).then((response) => {
        console.log('请求歌手分类接口啦');
        console.log(response);
        this.setData({ 
          singerTypeList: response.artists,
          singerFlag: false, 
        });
      })
    }
  },
  // 当swiper图片加载完成时候调用
  handleSwiperImageLoaded() {
    // 使用节流函数获取图片的高度
    throttleQueryRect('.swiper-image').then((result) => {
      const res = result[0];
      this.setData({
        swiperHeight: res.height,
      })
    });
  },
  // 请求推荐歌曲网络数据列表
  getRecommendSongs() {
    getRecommendSongs().then((res) => {
      const recommendSongs = res.result.slice(0, 5);
      // console.log('mmmmmmmmmmmmmm 1');
      // console.log(recommendSongs);
      // console.log('mmmmmmmmmmmmmm 2');
      this.setData({
        recommendSongs: recommendSongs,
        recommendTotalSongs: res.result
      });
    })
  },
  // 个性推荐网络数据
  getRecommendPlaylist() {
    getRecommendPlaylist().then((response) => {
      // 处理随机数据，
      let tempArray = [];
      for (let i = 1; i <= 23; i++ ) {
        tempArray.push[i];
      }
      // 随机获取歌单索引
      let randerIndex = getRandomArrayList(tempArray);
      this.setData({ recommendPlaylist: response.result.splice(randerIndex, 6)});
    })
  },
  getAllRankingList: function () {
    return (result) => {
      if (result.length > 0) {
        this.setData({ allRankingList: result });
      }
    }
  },
  // 巅峰排行榜网络数据
  getRankingList(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return;
      // 获取数据
      const id = res.id;
      const name = res.name;
      const coverImgUrl = res.tracks[0].al.picUrl;
      const songList = res.tracks.slice(0, 3);
      const playCount = res.playCount;

      // 组合数据
      const rankingObj = {
        id,
        name,
        coverImgUrl,
        playCount,
        songList
      }

      const newRankings = {
        // 解构
        ...this.data.rankings,
        [idx]: rankingObj
      }
      // 赋值
      this.setData({ rankings: newRankings });
    }
  },
  // 巅峰榜数据点击的item事件
  handleRankingItemClick: function (e) {
    // console.log(e.currentTarget);
    // 获取点击的索引
    const idx = e.currentTarget.dataset.index;
    // 取出名字
    const rankingName = rankingMap[idx];
    // 跳转到榜单详情
    wx.navigateTo({
      url: `/pages/ranking-detail/index?id=${idx}&type=idx`
    })
  },
  // 新歌推荐item歌曲点击事件
  handleSongItemClick: function () {
    
  },
  // 新歌推荐更多的点击事件
  handleMoreClick: function () {
    // 跳转到哪里
    console.log('点击啦新歌推荐的更多');
  },
  // 歌手分类区域点击事件
  handleAreaActiveItem: function (event) {
    // 取值
    const value = event.currentTarget.dataset.value
    const index = event.currentTarget.dataset.index
    const name = event.currentTarget.dataset.name
  
    this.setData({
      currentAreaIndex: index,
      currentAreaValue: value,
      currentAreaName: name,
    });

    // 请求对应的底部展示接口信息 value -> 代表的是 数字
    getArtistList(this.data.currentTypeValue, 30, 0, value).then((result) => {
      this.setData({ singerTypeList: result.artists })
    })
  },
  // 点击的性别
  handleTypeActiveItem: function (event) {
    // 取值
    const value = event.currentTarget.dataset.value
    const index = event.currentTarget.dataset.index
    const name = event.currentTarget.dataset.name
  
    this.setData({
      currentTypeIndex: index,
      currentTypeValue: value,
      currentTypeName: name,
    });

    getArtistList(value, 30, 0, this.data.currentAreaValue).then(res => {
      this.setData({
        singerTypeList: res.artists
      })
    })

  },
  // 歌手列表点击item事件
  handleSingerIdItem(event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url:  '/pages/singer/index?id=' + id,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('没有触发上拉刷新吗');
    // 音乐馆触发
    if (this.data.currentTableIndex === 2) {
      const offset = this.data.singerTypeList.length;
      getArtistList(this.data.currentTypeValue, 30, offset, this.data.currentAreaValue).then((result) => {
        if (!this.data.hasMore && offset !== 0) return;
        // 展示加载动画
        wx.showNavigationBarLoading();
        // 数据
        let newData = this.data.singerTypeList;
        // 第一次请求数据，则使用新数据
        if (offset == 0) {
          newData = result.artists;
        } else {
          // 拼接在原数据后面
          newData = newData.concat(result.artists);
        }

        this.setData({ 
          singerTypeList: newData,
          hasMore: result.more
         });

         // 关闭下来动画
         wx.hideNavigationBarLoading();
         // 关闭下拉刷新动画（数据加载完后主动停止，不设置则会在一定时间内停止）
         if (offset === 0) {
            wx.stopPullDownRefresh();
         }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
