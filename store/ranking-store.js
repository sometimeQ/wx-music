// 引入组件
import { HYEventStore } from 'hy-event-store';
// 引入请求数据
import { getAllTopList, getRankingList } from '../api/network-music';


// 定义数据
const rankingMap = {
  0: "rankingZero",
  1: "rankingOne",
  2: "rankingTwo",
  // 3: "allRanking",
};

// 创建store
const rankingStore = new HYEventStore({
  // 定义state
  state: {
    rankingZero: {},
    rankingOne: {},
    rankingTwo: {},
    allRankingList: [], // 所有榜单的数据
    moveDistance: 0,
  },

  // 定义action
  actions: {
    // 请求网络数据
    getRankingDataAction(ctx) {
      // 随机数组
      let randArray = [0, 1, 2, 3, 5, 7, 8, 15];
      let showArray = [];

      for (let i = 0; i < 3; i++) {
        let index = Math.floor(Math.random() * randArray.length);
        showArray.push(randArray[index]);
        // 删除index位置的元素
        randArray.splice(index, 1);
      }

      // showArray里面的数组长度是3
      showArray.forEach((item, index) => {
        getAllTopList().then((res) => {
          // 取出索引名字 key value
          const rankingName = rankingMap[index];
          // console.log('么偶有返回数据吗');
          // console.log(item);
          // console.log(res.list[item]);
          // console.log(res);

          // 获取id， 随机的数组索引取
          let id = res.list[item].id;
          // 获取歌单的详情
          getRankingList(id).then((responese) => {
            // console.log(responese);
            // console.log(responese.playlist);
            // console.log('华丽的分割线');
            // console.log(); ctx ---> { }
            // console.log(ctx[rankingName]);
            ctx[rankingName] = responese.playlist;
            // console.log(ctx[rankingName]);
          })
        })
      })

    },
    // 请求所有的榜单网络数据
    getAllRankingDataAction(ctx) {
      getAllTopList().then((res) => {
        console.log(res);
        console.log('end');
        ctx.allRankingList = res.list;
      });
    },
    // 改变滑动的距离
    changeMoveDistance(ctx, height) {

    }
  }
})

// 导出方式 commjs
export {
  rankingStore,
  rankingMap
}