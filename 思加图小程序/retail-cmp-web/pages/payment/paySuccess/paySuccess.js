// pages/payment/payment.js
var APP = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:''
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index?xs=' + APP.globalData.xs
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderNo: options.order_no
    })
    wx.request({
      url: APP.globalData.url + '/api/v1/order/payok',
      method: 'POST',
      data: {order_no : options.order_no},
      success: function (res) {
        if (res.data.code !== 20000) {
          return
        }
        cancelCallback(res.data.data);
      }
    })
  }

})