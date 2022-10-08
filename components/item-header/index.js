// components/item-header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 接收父组件传递过来的参数
    title: {
      type: String,
      value: '默认标题'
    },
    rightTitle: {
      type: String,
      value: '更多'
    },
    // 默认展示右边的标题
    showRightItem: {
      type: Boolean,
      value: true
    },
    // 搜索图标
    showSearchItem: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    titleWidth: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取标题的宽度
    getTitleWidth: function () {
      // 获取节点信息
      const query = wx.createSelectorQuery().in(this);
      // 查询本子组件
      query.select('#title').boundingClientRect();
      query.exec((res) => {
        console.log(res);
        this.setData({
          titleWidth: res[0].width
        })
      })
    }
  },
  /**
   * 组件的生命周期，会自动触发
   */
  lifetimes: {
    attached: function () {
      this.getTitleWidth();
    }
  }
})
