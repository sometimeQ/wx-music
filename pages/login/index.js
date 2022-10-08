const { default: Dialog } = require("../../miniprogram_npm/@vant/weapp/dialog/dialog");
import { hexMD5 } from '../../utils/md5';
import { login } from '../../api/login';
import Toast from '@vant/weapp/toast/toast';

// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
       // 背景图片
       backGroundPictureList: [
        'https://pic1.zhimg.com/80/v2-81edb0e3eb31a081c2968ac20df4031c_720w.jpg?source=1940ef5c',
        'https://pic2.zhimg.com/80/v2-e601e1f87e462e2b48e862ee710c04d0_720w.jpg?source=1940ef5c', 
        'https://pic3.zhimg.com/80/v2-c51ab51a4cd7a838246e62baa9b29354_720w.jpg?source=1940ef5c',
        'https://pic1.zhimg.com/80/v2-363a736abc4577c98320afc3fa0c2f52_720w.jpg?source=1940ef5c', 
        'https://pic1.zhimg.com/80/v2-084b769ff956d4283ce4eb1c37ac73b9_720w.jpg?source=1940ef5c', 
        'https://pic3.zhimg.com/80/v2-980b6be35b890fcac085bf61aff79add_720w.jpg?source=1940ef5c', 
        'https://pica.zhimg.com/80/v2-4ad7eb8c5d20f60869755c0dbc31d3db_720w.jpg?source=1940ef5c', 
        'https://pic3.zhimg.com/80/v2-80fb532b369d97e845be0ed98ca14cd3_720w.jpg?source=1940ef5c', 
        'https://pic2.zhimg.com/80/v2-1197240bdbce7180a6d9136bafc34eaa_720w.jpg?source=1940ef5c', 
        'https://pica.zhimg.com/80/v2-086471057d327c969f719f41a440129f_720w.jpg?source=1940ef5c'
      ],
      backGroundPictureUrl: '',
      userPhone: '',
      userPassword: ''
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 加载背景图片
    this.getBackgroundPicture();
  },
  /**
   * 加载背景图片
   */
  getBackgroundPicture() {
    const tempArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let randArrayValue = this.getArrayRandValue(tempArray);
    const randPictureUrl = this.data.backGroundPictureList[randArrayValue];
    // 赋值
    this.setData({ backGroundPictureUrl: randPictureUrl });
  },
  /**
   * 获取随机的值,用于取背景图片
   * @param {*} arrays 
   */
  getArrayRandValue: function (arrays) {
    if (arrays.length < 1 ) return '';
    let index = Math.floor((Math.random() * arrays.length));
    return arrays[index];
  },
  /**
   * 用户输入完回调信息
   */
  handleInput: function (event) {
    // console.log(event);
    let type = event.currentTarget.id;
    let value = event.detail.value;
    // console.log(type);
    this.setData({ [type]: value });
  },
  /**
   * 登陆事件
   */
  login: function () {
    let { userPhone, userPassword } = this.data;
    if (!userPhone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })

      // Toast.success('成功文案');

      return;
    }
    let phoneReg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
    if (!phoneReg.test(userPhone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return;
    }
    if (!userPassword) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }

    // 密码加密
    const md5_password = hexMD5(userPassword);
    // network
    login(userPhone, md5_password).then((res) => {
      console.log(res);
      console.log('康康登陆返回的什么数据');

      if (res.code === 200) {
        wx.showToast({
          title: '登陆成功',
          icon: 'success'
        })

        // 将用户的信息存储到本地
        wx.setStorageSync('userInfo', JSON.stringify(res.profile));
        // 关闭了内存中的保留的某个页面, navagationTo是用于跳转,页面少比较推荐to
        wx.reLaunch({
          url: '/pages/user/index',
        })
      } else if (result.code === 400) {
        wx.showToast({
          title: '手机号错误',
          icon: 'error',
        })
      } else if (result.code === 502) {
        wx.showToast({
          title: '密码错误',
          icon: 'error',
        })
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'error',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})