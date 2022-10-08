import network from './index';

/**
 * 请求MV数据列表
 * @param {*} offset 偏移量
 * @param {*} area 区域
 * @param {*} order 
 * @param {*} limit 
 */
export function getTopMVList(offset, area = '',  order = '', limit = 10) {
  return network.GET('/mv/all', {
    offset,
    area,
    limit,
    order
  });
}

