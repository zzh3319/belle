// pages/picAndtxt/picAndtxt.js
var WxParse = require('../../wxParse/wxParse.js');
var APP = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    console.log("图文加载,sc=" + options.sc + ",contentId=" + options.contentId + "version=" + options.version)  
    let that = this;    
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
      duration: 2500
    })
    that.setData({      
      contentId: options.contentId
    });
    if (options.sc) {
      APP.globalData.from_saleCode = options.sc;
    }        
    let url = APP.globalData.url +'/api/v1/act/detail_list?contentId=' + options.contentId;
    let data = {}
    let method = 'GET';
    function successCallback(res) {      
      console.log(res)
      let responseData = res.cmpContentDetailsDto.contentText;
      WxParse.wxParse('article', 'html', responseData, that, 0);
      that.setData({
        publishTimeMsg: res.publishTimeMsg,
        tagName: res.tagName,
        actTitle: res.actTitle
      })
    }
    APP.sentHttpRequestToServer(url, data, method, successCallback);
  },
  wxParseTagATap: function (e) {
    var link = e.currentTarget.dataset.src;
    console.log(link)
    wx.navigateTo({
      url: link,
    })
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
    var pathUrl = '/pages/picAndtxt/picAndtxt?contentId=' + this.data.contentId;
    var contentId = this.data.contentId;
    console.log(this.data)
    if (APP.globalData.saleCode) {
      pathUrl = pathUrl + '&sc=' + APP.globalData.saleCode+'&version='+1;
    }    
    console.log('分享图文path：' + pathUrl);    
    return {
      title: this.data.actTitle,
      path: pathUrl,
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          duration: 3000,
          success: function (res) {
            var _userInfo = wx.getStorageSync('userInfo');
            let _union_id = '',
              _saleCode = '',
              _login_name = '';
            if (_userInfo) {
              _union_id = _userInfo.unionId ? _userInfo.unionId : '';
              _saleCode = _userInfo.assistantCode ? _userInfo.assistantCode : '';
              _login_name = _userInfo.loginName ? _userInfo.loginName : '';
            }
            let that = this,
              globalData = APP.globalData,
              _data = {
                click_type: '1',
                oper_type: '2',
                relevance_id: contentId,
                login_name: _login_name,
                union_id: _union_id,
                shop_assistant_code: _saleCode
              };
            wx.request({
              url: globalData.url + '/api/v1/act/csi',
              data: _data,
              method: 'POST',
              success: function (res) {
                console.log(res)
              }
            })
          }
        })
      },
      fail: function (res) {
        wx.showModal({
            content: '转发失败',
            success: function(res) {}
        })
      }
    }
  }
})