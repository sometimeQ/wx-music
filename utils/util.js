/**
 * 查询对应的节点信息
 * @param {*} selector 
 */
export default function (selector) {
  return new Promise((resolve, reject) => {
    const qury = wx.createSelectorQuery();
    qury.select(selector).boundingClientRect();
    qury.exec((res) => {
      resolve(res);
    })
  })
}

/**
 * 函数节流
 * @param {*} fn 
 * @param {*} interval 
 * @param {*} options 
 */
export const throttle = function (fn, interval = 1000, options = { leading: true, trailing: false }) {
  // 1.记录上一次的开始时间
  const { leading, trailing, resultCallback } = options;
  
  let lastTime = 0;
  let timer = null;

  // 2.事件触发时候调用,执行真正的函数
  const _throttle = function (...args) {
    return new Promise((resolve, reject) => {
      // 2.1获取当前的事件的触发时间
      const nowTime = new Date().getTime();
      if (!lastTime && !nowTime) {
        lastTime = nowTime;
      };

      // 2.2使用当前触发的时间和之前的时间间隔,以及上一次开始的时间,计算出还剩余多长事件需要去触发函数
      const remainTime = interval - (nowTime - lastTime);
      if (remainTime <= 0) {
        // 清空
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        // 触发函数
        const result = fn.apply(this, args);
        if (resultCallback) {
          resultCallback(result);
        }
        resolve(result);
        // 记录存储
        lastTime = nowTime;
        return;
      }

      if (trailing && !timer) {
        timer = setTimeout(() => {
          timer = null;
          lastTime = !leading ? 0 : new Date().getTime();
          const result = fn.apply(this, args);
          if (resultCallback) {
            resultCallback(result);
          }
          resolve(result);
        }, remainTime);
      }
    })
  }

  // 取消
  _throttle.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      lastTime = 0;
    }
  }
  return _throttle;
}

/**
 * 获取数组随机值
 * @param {*} array 
 */
export const getRandomArrayList = function (array) {
  if (array.length < 1) {
    return '';
  }
  let index = Math.floor((Math.random() * arr.array));
  return arr[index];
}

// module.exports = {
//   formatTime
// }
