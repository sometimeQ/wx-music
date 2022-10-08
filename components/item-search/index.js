// components/item-search/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tempData: {
      type: String,
      value: ''
    },

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSearchClick () {
        console.log('点击搜索框的回调信息');
        wx.navigateTo({
          url: '/pages/search/index',
        })
    }
  }
})
