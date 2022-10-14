import network from './index';

/**
 * 根据id获取详情页面
 * @param {*} id 
 */
export function getSongDetail(id) {
  return network.GET('/song/detail', {ids: id});
}

/**
 * 根据歌手id，获取歌手详细
 * @param {*} id 
 */
export function getSingerDetail(id) {
  return network.GET("/artist/detail", {
    id
  })
}

/**
 * 请求歌词详细信息
 * @param {*} id 
 */
export function getSongLyric(id) {
  return network.GET("/lyric", {
    id
  })
}

/**
 * 获取相似歌曲
 * @param {*} id 
 */
export function getSimiSong(id) {
  return network.GET("/simi/song", {
    id
  })
}

/**
 * 获取歌曲的评论
 * @param {*} id 
 * @param {*} limit 
 */
export function getSongComment(id, limit = 10) {
  return network.GET("/comment/music", {
    id,
    limit
  })
}