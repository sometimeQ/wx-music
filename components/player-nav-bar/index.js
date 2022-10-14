// components/player-nav-bar/index.js

// 获取应用实例
const app = getApp();

Component({
  options: {
    multipleSlots: true, // 允许使用多个插槽
  },
  /**
   * 组件的属性列表,接收父组件传递 过来的值
   */
  properties: {
    title: {
      type: String,
      value: ""
    },
    // 是否显示登陆
    showUserLogin: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 状态栏高度
    statusBarHeight: app.globalData.statusBarHeight, 
    // 导航栏高度
    navgationBarHeight: 44,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击左边返回按钮的点击事件,传递给父组件事件
    handleLeftClick() {
      this.triggerEvent('click');
    }
  }
})
