// components/comment-area/index.js

import { getSongComment } from '../../api/network-player';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 歌曲ID
    songId: {
      type: Number,
      value: 0,
      // 值改变回来到这里
      observer: function(newVal, oldVal) {
        // 请求当前的歌曲的评论数据
        getSongComment(newVal).then((result) => {
          // 赋值
          console.log('没有值吗');
          console.log(result);
          this.setData({ normalComments: result.comments });
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 默认评论
    normalComments: []
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
