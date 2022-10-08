import network from './index';


// 暴露对外提供的方法
/**
 * 获取轮播图数据
 * @param {*} params 
 */
export function getBanners(params) {
  return network.GET('/banner', {type: 2});
}

/**
 * 获取歌单详情数据
 * @param {*} params 
 */
export function getPlaylistDetail(params) {
  return network.GET('/playlist/detail/dynamic', {id: params})
}

/**
 * 获取所有的榜单
 * @param {*} params 
 */
export function getAllTopList(params) {
  return network.GET('/toplist');
}

/**
 * 获取所有的榜单、歌单详情数据
 * @param {*} params 
 */
export function getTopListDetail(id) {
  return network.GET('/playlist/detail', id);
}

/**
 * 获取推荐歌曲数据
 * @param {*} params 
 */
export function getRecommendSongs(params) {
  return network.GET('/personalized/newsong');
}

/**
 * 获取个性推荐网络数据
 * @param {*} params 
 */
export function getRecommendPlaylist(params) {
  return network.GET('/personalized');
}

/**
 * 游客登陆
 */
export function registerLogin() {
  return network.GET('/register/anonimous')
}

/**
 * 底部飙升榜、把超时的接口地址复制到浏览器打开即可临时解决请求需要权限问题
 * @param {*} id 
 */
export function getRankingList(id) {
  // return network.GET('/toplist', {id});  

  // toplist?id=19723756

    return network.GET('/playlist/detail', {
      id: id,
      csrf_token: '9078dc9304f081c24fe2e5ce052f6c3c'
    });
}

/**
 * 获取歌手分类详情
 * @param {*} type 
 * @param {*} limit 
 * @param {*} offset 
 * @param {*} area 
 */
export function getArtistList(type, limit = 30, offset = 0, area) {
  return network.GET('/artist/list', {
    type,
    limit,
    offset,
    area
  })
}
