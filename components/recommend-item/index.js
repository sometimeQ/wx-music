
import { getSongDetail } from '../../api/network-player';
import { playerStore } from '../../store/index';

// components/recommend-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 接收父组件传递过来的数据,
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 详情页数据
    songDetail: [],
    playListSongs: [], // 只要点击了item，就会加入到这个数组里面存起来作为历史记录
  },

  /**
   * 组件的方法列表
   */
  methods: {
        // 点击了推荐新歌的item事件
        handleSongItemClick: function () {
          // 获取传入的id
          const id = this.properties.item.id;
          // 整合数据
          let newSong = {};
          let index = 0;
          let flag = false;
          
          // 请求详情网络数据
          getSongDetail(id).then((result) => {
            // console.log(result);
            // result.songs[0]); 取出来是一个对象{}, 外面套上[]，就是数组对象[{}];
            newSong = [result.songs[0]]; // [{},{}]
            // console.log(newSong);
            // console.log('分割线');
            // console.log(newSong);
            // console.log(result.songs[0]);
            // console.log([result.songs[0]]);
            this.setData({ songDetail: [result.songs[0]] });

            // 判断历史记录的数组里面是否有这个id
            for (let i = 0; i < this.data.playListSongs.length; i ++) {
              if (id === this.data.playListSongs[i].id) {
                index = i;
                // 代表已经存在
                flag = true;
              }
            }

            if (flag) {
              // 赋值，直接播放该歌曲在数组中的索引
              playerStore.setState("playListSongs", this.data.playListSongs);
              playerStore.setState("playListIndex", index);
            } else {
              // console.log('不存在了辣');
              // console.log(this.data.playListSongs);
              // 不存在, 拼接在播放歌曲列表数组后面
              let playListSongs = newSong.concat(this.data.playListSongs);
              this.setData({ playListSongs: playListSongs });
              // 设置vuex里面的值
              playerStore.setState("playListSongs", this.data.playListSongs);
              // 播放的索引,默认为0
              playerStore.setState("playListIndex", 0);
            }
          });

          // 获取state里面存储的值
          playerStore.onState("playListSongs", (result) => {
            this.setData({ playListSongs: result });
          });

          // 跳转该首先歌曲详情
          wx.navigateTo({
            url: '/pages/player/index?id=' + id,
          })
        }
  }
})
