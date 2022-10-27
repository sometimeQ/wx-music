// components/ranking-list-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    },
    hotNumList: {
      type: Number,
      value: 3
    },
    contentHeight: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 榜单前三名
    hotNumList: [1, 2, 3]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
