//app.js
import Etc from 'utils/etc'
import Logon from 'utils/logincard'
App({
  onLaunch: function () {
    let that = this;
    if (!that.globalData.url){
      that.globalData.url = Etc.basePath;
    }
    if (!that.globalData.xs) {
      that.globalData.xs = Etc.xs;
    }
    let globaoUrl = this.globalData.url;
    wx.request({
      url: globaoUrl + '/api/v1/entry?xs=' + that.globalData.xs,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code !== 20000) {
          wx.showToast({
            title: '数据错误',
            icon: 'loading',
            duration: 2000
          })
          console.log('入口参数接口错误')
          return;
        }
        let responseData = res.data.data;
        that.globalData.mall_brand_no = responseData.mall_brand_no;
        that.globalData.retail_brand_no = responseData.retail_brand_no;
        that.globalData.mall_no = responseData.mall_no;
        that.globalData.mall_shop_no = responseData.mall_shop_no;
        that.globalData.retail_shop_no = responseData.shop_no;
        that.globalData.qx_brand_no = responseData.qx_brand_no;        
      }
    })
  },
  globalData: {
    userInfo: null,
    url: '',
    mall_shop_no: '',
    retail_shop_no: '',
    mall_no: '',
    mall_brand_no: '',
    retail_brand_no:'',
    qx_brand_no:'',
    from_saleCode:'',
    saleCode :'',
    login_name : '',
    xs: ''

  },
  sentHttpRequestToServer: function (url, data, method, successCallback, failCallback, completeCallback) {
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (response) {
        if (response.data.code !== 20000) {
          wx.showToast({
            title: '数据错误',
            icon: 'loading',
            duration: 2000
          })
          return;
        }
        wx.hideLoading()
        successCallback(response.data.data)
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '服务器错误，请联系客服',
          showCancel: false
        })
        // failCallback()
      },
      complete: completeCallback
    })
  },
  Logon: new Logon,
  Etc: Etc,
})