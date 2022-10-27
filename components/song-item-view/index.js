// components/song-item-view/index.js
import { getSongDetail } from '../../api/network-player';
import { playerStore, rankingStore } from '../../store/index';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showIndex: {
      type: Boolean,
      value: true,
    },
    index: {
      type: Number,
      value: 0
    },
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    songDetailList: [], // 详情数据
    playHistoryListSongs: [] // 历史记录数据
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick(event) {
      console.log(event);
      const id = event.currentTarget.dataset.id;
      let newSong = {};
      let index = 0;
      let flag = false;
      getSongDetail(id).then((result) => {
        console.log(result);
        newSong = result.songs[0];
        this.setData({ songDetailList: [result.songs[0]] });

        // 判断已经添加到历史记录数组当中了
        for (let i = 0; i < this.data.playHistoryListSongs.length; i ++) {
          if (id === this.data.playHistoryListSongs[i].id) {
            index = i;
            flag = true;
          }
        }

        
        if (flag) { // 添加过了
          // 赋值
          playerStore.setState("playListSongs", this.data.playHistoryListSongs);
          // 播放索引
          playerStore.setState("playListIndex", index);
        } else {
          // 没有添加过,直接拼接
          let playListSongs = newSong.concat(this.data.playHistoryListSongs);
          this.setData({ playHistoryListSongs: playListSongs });
        }
      });
      // 获取数据
      playerStore.onState("playListSongs", (result) => {
        this.setData({ playHistoryListSongs: result });
      });
      // 跳转到播放的界面
      wx.navigateTo({
        url: '/pages/player/index?id=' + id,
      })

    }
  }
})
