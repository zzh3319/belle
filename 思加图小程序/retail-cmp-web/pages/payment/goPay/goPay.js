// pages/payment/payment.js
var APP = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var order_no = options.order_no;
    wx.request({
      url: APP.globalData.url + '/api/v1/pay/signature',
      method: 'POST',
      data: { prepay_id: options.prepay_id },
      success: function (res) {
        console.log(res)
        var paysignInfo = res.data;
        wx.requestPayment({
          'appId': paysignInfo.appId,
          'timeStamp': paysignInfo.timestamp+'',
          'nonceStr': paysignInfo.nonce,
          'package': paysignInfo.pack,
          'signType': 'MD5',
          'paySign': paysignInfo.signature,
          'success': function (res) {
            console.log(res)
            wx.showToast({
              title: '支付成功',
            })

            setTimeout(function(){
              wx.reLaunch({
                url: '/pages/payment/paySuccess/paySuccess?order_no=' + order_no
              })
            },500)
          },
          'fail': function (res) {

            console.log(res)
            wx.redirectTo({
              url: '/pages/order-list/order-list'
            })
            console.log('支付失败')
          }
          // 'complete': function (res) {
          //   console.log(res)
          //   wx.navigateTo({
          //     url: '/pages/order-list/order-list'
          //   })
          // }bug: 6.5.2 及之前版本中，用户取消支付不会触发 fail 回调，只会触发 complete 回调，回调 errMsg 为 'requestPayment:cancel'
        })
      },
      fail:function(){
        console.log('支付失败')
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})