import { audioContext, playerStore } from '../../store/index';
import { getSimiSong, getSongComment, getSongDetail } from '../../api/network-player';

// 播放的模式、顺序、随机、单曲
const playModeNames = ["order", "repeat", "random"];

// pages/player/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songId: '', // 歌曲id,用来获取评论
    currentSong: {}, // 当前歌曲
    durationTime: 0, // 歌曲的总时长
    lyricInfos: [],  // 解析后的歌词
    currentPage: 1, // 当前的页
    contentHeight: 0 , // 内容的高度
    isMusicLyric: true, // 是否是歌词
    navBarList: ['评论', '歌曲', '歌词'], // 导航栏数据

    currentTime: 0, // 当前播放的时间
    currentLyricIndex: 0, // 当前给次播放的索引
    currentLyricText: '', // 当前显示的歌词
    playModeIndex: 0, // 当前播放的模式
    playModeName: 'order', // 播放的模式名字

    sliderValue: 0, // 滑块总长度
    isSliderChanging: false, // 是否正在滑动

    playingName: 'pause', // 暂停？播放？等
    isPlaying: false, // 是否正在播放
    singerId: 0, // 歌手id
    singerPic: "", // 歌手图片

    show: false, // 是否显示歌词信息，默认不显示
    canPlaySongList: [], // 能播放的数组
    canPlaySongCurrentIndex: 0, // 当前播放的索引

    simiSongsList: [], // 相似歌曲数据

    commentFlag: true, // 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 接收index,点击item传递过来的参数
    this.setData({ songId: options.id });
    // 调取网络接口信息开始处理歌词等
    const songId = options.id;
    playerStore.dispatch("playMusicWithSongIdAction", {id: songId});

    // 数据监听,获取对应的值
    this.setupPlayerStoreListener();

    // 动态计算内容的高度 
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navgationBarHeight = globalData.navgationBarHeight;
    const deviceRadio = globalData.deviceRadio;
    const contentHeight = screenHeight  - statusBarHeight - navgationBarHeight;
    this.setData({ contentHeight: contentHeight, isMusicLyric:  deviceRadio >= 2});

    // 监听播放的历史记录
    playerStore.onState("playListSongs", (list) => {
      this.setData({ canPlaySongList:  list});
    })

    // 监听播放的索引
    playerStore.onState("playListIndex", (index) => {
      this.setData({ canPlaySongCurrentIndex: index });
    });
  },

  /**
   * 监听播放
   */
  setupPlayerStoreListener() {
    // 1.监听currentSong/durationTime/lyricInfos, vuex里面的
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], this.handleCurrentMusicListener);
    // 2.监听currentTime/currentLyricIndex/currentLyricText  --> 后面可以绑定函数，返回解构后的值
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({ currentTime, currentLyricIndex, currentLyricText }) => {
      // 并且当前没有正在滑动滑块才赋值 不然滑动的时候会卡顿，
      if (currentTime && !this.data.isSliderChanging) { // fasle，
        // 计算滑块的值 当前播放的时间  / 总时间
        const sliderValue = currentTime / this.data.durationTime * 100;
        this.setData({ currentTime: currentTime, sliderValue: sliderValue });
      }

      // 索引
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex: currentLyricIndex });
      }

      // 当前播放的歌词
      if (currentLyricText) {
        this.setData({ currentLyricText: currentLyricText });
      }
    });

    // 3.监听播放模式相关的数据,是否循环操作
    playerStore.onStates(["playModeIndex", "isPlaying"], ({ playModeIndex, isPlaying }) => {
      if (playModeIndex !== undefined) {
        // 设置当前播放的模式、当前播放的状态、暂停、播放等
        this.setData({ playModeIndex: playModeIndex, playModeName:playModeNames[playModeIndex] });
      }
      if (isPlaying !== undefined) {
        // 自定义
        this.setData({ 
          isPlaying: isPlaying,
          playingName: isPlaying ? "pause" : "resume" 
        });
      }
    });
  },
  // 绑定监听的函数 
  handleCurrentMusicListener({ currentSong, durationTime, lyricInfos }) {
    // console.log('??????????????????????');
    if (currentSong) {
      this.setData({ currentSong: currentSong });
    };
    if (durationTime) {
      this.setData({ durationTime: durationTime });
    };
    if (lyricInfos) {
      // console.log('handleCurrentMusicListener');
      // console.log(lyricInfos);
      // console.log('handleCurrentMusicListener end');

      this.setData({ lyricInfos: lyricInfos });
    };
  },
  // 点击底部的内容swiper切换
  handleSwiperChange(event) {
    // console.log(event);
    const current = event.detail.current;
    if (current === 0 && this.data.commentFlag) {
      // 1.获取歌手的图片
      playerStore.onState("singerPic", (singerPic) => {
        // console.log(singerPic);
        this.setData({ singerPic: singerPic });
      });

      // 2.获取歌曲id
      playerStore.onState("songId", (songId) => {
        // console.log(songId);
        // console.log("什么情况");
        this.setData({ songId: songId });
        // 获取相似的歌曲
        this.getSimiSongs(songId);
      })

      // 获取歌手的id
      playerStore.onState("singerId", (singerId) => {
        this.setData({ singerId:  singerId});
      })

      // 是否已经加载过内容了
      this.setData({ commentFlag: false });
    }

    // 赋值给滚动的页码
    this.setData({ currentPage: current });
  },
  // 滑块拖动过程中触发的事件
  handleSliderChanging(event) {
    // console.log(event);
    const value = event.detail.value;
    const currentTime = this.data.durationTime *value / 100;
    this.setData({ currentTime: currentTime, isSliderChanging: true });
  },
  // 滑块完成一次拖动后触发的事件
  handleSliderChange(event) {
    // console.log(event);
    // 1.获取slider变化的值
    const value = event.detail.value;
    // 2.计算需要播放的currentTIme
    const currentTime = this.data.durationTime * value / 100;
    // 3.设置context播放currentTime位置的音乐
    audioContext.seek(currentTime / 1000);
    // 4.记录最新的sliderValue, 并且需要将isSliderChaning设置回false
    this.setData({ sliderValue: value, isSliderChanging: false });
  },
  // 点击遮罩选择了播放历史记录里面的item
  handleSelectBtnClick(event) {
    console.log(event.currentTarget.dataset.index);
    const index = event.currentTarget.dataset.index;
    // 播放啦
    playerStore.dispatch("selectNewMusicAction", index);
  },
  // 相似歌曲的点击事件
  handleSongItemClick() {
    console.log('点击啦~');
  },
  // 播放模式点击事件
  handleModeBtnClick() {
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1;
    if (playModeIndex === 3) {
      playModeIndex = 0;
    }
    
    // 设置playerStore中的playModeIndex
    playerStore.setState("playModeIndex", playModeIndex);
  },
  // 点击上一首歌曲的点击事件
  handlePrevBtnClick() {
    playerStore.dispatch("changeNewMusicAction", false);
  },
  // 点击播放按钮的点击事件
  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying);
  },
  // 点击下一首歌曲的播放事件
  handleNextBtnClick() {
    playerStore.dispatch("changeNewMusicAction");
  },
  // 点击显示歌词
  onClickShow() {
    this.setData({ show: true });
  },
  // 点击隐藏遮罩
  onClickHide() { 
    console.log('点击了吗');
    this.setData({ show: false });
  },
  // 点击切换模式
  handleModeBtnClick() {

  },
  // 导航栏左上角的的点击事件
  handleBackBtnClick() {
    wx.navigateBack();
  },
  /**
   * 获取相似的歌曲
   */
  getSimiSongs(id) {
    getSimiSong(id).then((result) => {
      console.log(result);
      this.setData({ simiSongsList: result.songs });
    });
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