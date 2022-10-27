// components/playlist-detail-header/playlist-detail-header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlistData : { 
      type: Object,
      value: {}
    },
    navgationBarHeight: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    coverHeight: 450,
    coverTransition: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTouchStart() {

    },
    handleTouchMove() {

    },
    handleTouchEnd() {

    },
    // 分享
    handleShare() {

    }
  }
})
