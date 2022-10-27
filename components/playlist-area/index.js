// components/playlist-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '默认歌单'
    },
    // 传递过来的对象
    recommendPlaylist: {
      type: Object,
      value: {}
    }
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
    handleItemClick: function (event) {
      console.log(event);
      const item = event.currentTarget.dataset.item
      // 点击跳转到详情页，携带参数然后在options里面打印出即可
      wx.navigateTo({
        url: `/pages/playlist-detail/index?id=${item.id}`,
      })
    }
  }
})
