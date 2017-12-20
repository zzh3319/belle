// pages/mine/mine.js
const APP = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    TelphoneNum:'0755-82877312',
    ifHidden: true,
    qrcodeImg: '',

    orderIconList: [
      {
        icon: "/images/mine/fu_xqy.png",
        name: "待付款",
        type: 1
      },
      {
        icon: "/images/mine/fa_xqy.png",
        name: "待发货",
        type: 2
      },
      {
        icon: "/images/mine/shou_xqy.png",
        name: "待收货",
        type: 3
      },
      {
        icon: "/images/mine/receive_xqy.png",
        name: "已收货",
        type: 4
      }
    ]
  },
  hide: function () {
    this.setData({ ifHidden: false })
  },
  addQrcode: function (e) {
    var _userInfo = wx.getStorageSync('userInfo');
    console.log(_userInfo)
    let globalData = APP.globalData;
    let data = {
      mallNo: globalData.mall_no,
      mallShopNo: globalData.mall_shop_no,
      mallBrandNo: globalData.mall_brand_no,
      xs: globalData.xs,
      sc: _userInfo.assistantCode,
      pn: '',
      ot: '2',
      ln: _userInfo.loginName,
      wxAcodeType: 1
    }
    let url = globalData.url + '/api/v1/getwxacode';
    let that = this;
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code != 20000) {
          wx.showToast({
            title: '数据错误',
            icon: 'loading',
            duration: 2000
          })
          return;
        }

        that.setData({
          qrcodeImg: res.data.data.wxacode_url,
          ifHidden: false
        })
     
        let _data1 = {
            click_type: '1',
            oper_type: '1',
            relevance_id: res.data.data.wxacode_url,
            login_name: _userInfo.loginName,
            union_id: _userInfo.unionId,
            shop_assistant_code: _userInfo.assistantCode
          };
        wx.request({
          url: globalData.url + '/api/v1/act/csi',
          data: _data1,

          method: 'POST',
          success: function (res) {

          }
        })
      }
    })

  },
  delete: function () {
    this.setData({ ifHidden: true })
  },
  onLoad: function () {
    let that = this;
    var brandcode = APP.globalData.qx_brand_no
    var userinfo = APP.Logon.isLogin();
    console.log(userinfo)
    if (!userinfo) { // 未登录
      APP.Logon.sign(brandcode, that);
      userinfo = APP.Logon.isLogin();
      that.setData({
        userInfo: userinfo
      });
    } else {
      that.setData({
        userInfo: userinfo
      });
      that.getBoreUserInfo(that);
    }
  },
  onShow: function (e) {
    this.setData({
      userInfo: {},
      hasUserInfo: false,
      ifHidden: true,
      qrcodeImg: ''
    })
    this.onLoad();
  },
  getBoreUserInfo: function (that) {
    var userinfo = APP.Logon.isLogin();
    APP.globalData.saleCode = userinfo.assistantCode;
    APP.globalData.login_name = userinfo.loginName;
    // 获取会员等级
    wx.request({
      url: APP.globalData.url + '/api/v1/user/getMemberInfo/' + APP.globalData.qx_brand_no + '/' + userinfo.loginName,
      success: function (res) {
        console.log(res.data);
        that.setData({
          member: res.data.data
        });

      }
    }),
      //获取有效积分
      wx.request({
        url: APP.globalData.url + '/api/v1/user/getEffectiveIntegral/' + APP.globalData.qx_brand_no + '/' + userinfo.memberId,
        success: function (res) {
          console.log(res.data);
          that.setData({
            Score: res.data
          });

        }
      })
  },
  getUserInfo: function (e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPhoneNumber: function (e) {

  },
  telHandler: function (e) {
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})
