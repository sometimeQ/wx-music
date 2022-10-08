import { HYEventStore } from 'hy-event-store';
import { getSongDetail, getSingerDetail, getSongLyric } from '../api/network-player';
import { parseLyric } from '../utils/parse-lyric';

// 获取多媒体
const audioContext = wx.getBackgroundAudioManager();

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true, // 是否是第一次播放
    isStoping: false, // 是否暂停
    isPlaying: false, // 是否播放

    id: 0,
    currentSong: {}, // 当前播放的歌曲信息
    durationTime: 0, // 时间
    lyricInfos: [], // 解析后的歌词信息

    currentTime: 0, // 当前播放时间
    currentLyricIndex: 0, // 当前歌词的索引嘻嘻
    currentLyricText:  "", // 当前的歌词信息

    playListIndex: 0, // 播放的索引
    playModeIndex: 0, // 0: 循环播放 1: 单曲循环 2: 随机播放
    playListSongs: [], // 播放历史列表 

    songId: 0, // 歌曲id
    singerPic: "", // 歌手图片
    singerId: 0, // 歌手id

  },
  actions: {
    /**
     * 播放调取网络事件
     * @param {*} ctx 
     * @param {*} isRefresh 是否正在刷新 
     */
    playMusicWithSongIdAction: function (ctx, {id, isRefresh = false}) {
      if (ctx.id == id && !isRefresh) {
        this.dispatch('changeMusicPlayStatusAction', true);
        return;
      }

      ctx.id = id;

      // 1.根据歌曲id请求数据,详情数据
      getSongDetail(id).then((result) => {
        // console.log("开始请求详情数据");
        // console.log(result);
        // 赋值
        ctx.currentSong = result.songs[0]; // 当前播放的歌曲
        ctx.durationTime = result.songs[0].dt; // 当前歌曲的总时长
        
        // 音频赋值
        audioContext.title = result.songs[0].name;
        audioContext.coverImgUrl = result.songs[0].al.picUrl;
        audioContext.webUrl = result.songs[0].al.picUrl;

        ctx.songId = result.songs[0].id; // 当前歌曲的id

        // 获取歌手的信息
        getSingerDetail(result.songs[0].ar[0].id).then((res) => {
          // console.log(res);
          if (res.code === 200) {
            ctx.singerPic = res.data.artist.cover;
            ctx.singerId = res.data.artist.id;
          }
        })

        // 请求歌词数据
        getSongLyric(id).then((res) => {
          console.log(res);
          // 解析歌词数据
          const lyricString = res.lrc.lyric;
          // 转换格式
          let lyricTransString = "";
          try {
            lyricTransString = res.tlyric.lyric;
          } catch (error) { }

          // 开始解析
          const lyrics = parseLyric(lyricString);
          const transLyrics = parseLyric(lyricTransString); // 翻译歌词
          console.log(transLyrics);
          for (let i = 0; i < transLyrics.length; i++) {
            // const element = transLyrics[i];
            // 查找匹配的下表
            let index = lyrics.findIndex((val) => val.time  == transLyrics[i].time);
            if (index === -1) {
              console.log("不匹配的值");
            } else {
              // console.log(transLyrics[i].text);
              // console.log("===================");
              // console.log(lyrics[index]["transText"]);
              // console.log("end ================== end");
              lyrics[index]["transText"] = transLyrics[i].text;
            }
          }

          // 删除空白歌词
          for (let i = 0; i < lyrics.length; i++) {
            // const element = lyrics[i];
            if (!lyrics[i].text) {
              lyrics[i].splice(i, 1);
            }
          }
          if (lyrics === undefined) {
            ctx.lyricInfos = [];
          } else {
            ctx.lyricInfos = lyrics;
          }
        })

        // 2.播放对应id的歌曲
        audioContext.stop();
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
        audioContext.title = id;
        audioContext.autoplay = true;

        // 3.监听audioContext一些事件,是否是第一次播放
        if (ctx.isFirstPlay) {
          this.dispatch("setupAudioContextListenerAction");
          ctx.isFirstPlay = false;
        }
      });
    },

    /**
     * 监听是否是第一次播放音频的事件操作
     */
    setupAudioContextListenerAction: function (ctx) {
      // 1.监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play();
      });

      // 2.监听事件改变
      audioContext.onTimeUpdate(() => {
        // 2.1  获取当前的时间
        const currentTime = audioContext.currentTime  *  1000;
        // 2.2  根据当前的时间修改currentTime
        ctx.currentTime = currentTime;
        // 2.3  根据当前的时间去查找歌词
        if (!ctx.lyricInfos.length) return;
        let i = 0;
        for (; i < ctx.lyricInfos.length; i++) {
          // const element = array[i];
          const lyricInfo = ctx.lyricInfos[i];
          if (currentTime < lyricInfo.time) {
                break;
          }
        }

        console.log("===================");
        console.log(i);
        console.log(i - 1);
        console.log("end ================== end");

        // 2.4 设置当前歌曲的索引和内容
        const currentIndex = i - 1;
        if (ctx.currentLyricIndex !== currentIndex) {
          // 从解析的歌词里面拿 lyricInfos
          const currentLyricInfo = ctx.lyricInfos[currentIndex];
          ctx.currentLyricIndex = currentLyricIndex; // 赋值歌词的索引
          // 设置歌词内容
          if (currentLyricInfo) {
            ctx.currentLyricText = currentLyricInfo.text;
          }
        }
      });

      // 3.监听歌曲播放完成
      audioContext.onEnded(() => {
        // 播放下一首
        this.dispatch("changeNewMusicAction");
      });

      // 4.监听音乐播放/暂停/停止
      audioContext.onPlay(() => {
        ctx.isPlaying = true;
      });
      audioContext.onPause(() => {
        ctx.isPlaying = false;
      });
      audioContext.onStop(() => {
        ctx.isPlaying = false;
        ctx.isStoping = true;
      })
    },

    /**
     * 更改播放状态
     * @param {*} ctx 
     * @param {*} isPlaying 
     */
    changeMusicPlayStatusAction: function (ctx, isPlaying = true) {
      // ctx, 就是取的是status里面的值
      ctx.isPlaying = isPlaying;
      // 如果当前正在播放且
      if (ctx.isPlaying && ctx.isStoping) {
        // 设置播放来源
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`;
        audioContext.title = ctx.currentSong.name;
        // 跳转到指定位置时间
        audioContext.seek(ctx.currentTime / 1000);
        ctx.isStoping = false;
      }
      // 社遏制当前是否正在播放状态
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
    }
  }
});



// 导出
export {
  audioContext,
  playerStore
}