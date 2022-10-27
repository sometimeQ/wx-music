// components/ranking-detail-header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rankingInfo: {
      type: Object,
      value: {}
    },
    rankingFirstPicture: {
      type: String,
      value: ""
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
    coverTransition: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
