// pages/order-list/order-list.js
var APP = getApp();
Page({
  // 页面的初始数据
  data: {
    bottomStyle: "content-box-border-bottom",
    bottomStyleList: ["content-box-border-bottom"],
    scrollTop: 0,
    threshold: 50,
    pageSize: 10,
    pageNo: 1,
    isMore: true,
    allpages: 0,
    goodsList: [],
    currentIndex: '',
    requestTask: null
  },

  // 生命周期函数--监听页面加载

  initData: function (index) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    let mallShopNo = APP.globalData.mall_shop_no;
    let mallBrandNo = APP.globalData.mall_brand_no;
    let ajaxTask = that.data.requestTask;
    if (ajaxTask) {
      ajaxTask.abort;
      that.setData({
        requestTask: null
      })
    }
    var _userInfo = wx.getStorageSync('userInfo');
    let requestTask = wx.request({
      url: APP.globalData.url + '/api/v1/order/getMyOrderList',
      data: {
        memberId: _userInfo.memberId,
        mallShopNo: mallShopNo,
        mallBrandNo: mallBrandNo,
        pageSize: that.data.pageSize,
        pageNo: that.data.pageNo,
        orderStatus: index
      },
      success: function (res) {

        if (res.data.code != 20000) {
          wx.showToast({
            title: 'error',
            icon: 'loading',
            duration: 3000
          });
          return;
        }
        let goodsList = that.data.goodsList;
        let dataObj = res.data.data.list;
        let pageNo = that.data.pageNo;
        let allpages = res.data.data.pages;
        if (pageNo == allpages || allpages === 0) {
          that.setData({
            goodsList: goodsList.concat(dataObj),
            isMore: false
          });
        } else {
          that.setData({
            goodsList: goodsList.concat(dataObj),
            pageNo: ++pageNo
          });
        }
        wx.hideLoading()
      }
    })
    that.setData({
      requestTask: requestTask
    })
  },
  onLoad: function (option) {

    let typeIndex = option.type ? option.type : '';//当是全部的时候传空字符串 
    this.data.bottomStyleList = [];
    this.data.bottomStyleList[typeIndex ? typeIndex : 0] = this.data.bottomStyle;
    this.setData({
      bottomStyleList: this.data.bottomStyleList,
      currentIndex: typeIndex
    })
    this.initData(typeIndex);
  },
  onReachBottom: function () {
    var that = this;
    if (!that.data.isMore) {
      return;
    }
    that.initData(that.data.currentIndex)
  },
  chooseType: function (event) {
    var index = parseInt(event.currentTarget.dataset.typeid);
    if (this.data.bottomStyleList[index]) {
      return; //点击了已经点击的按钮
    }
    this.data.bottomStyleList = [];
    this.data.bottomStyleList[index] = this.data.bottomStyle;
    this.setData({
      bottomStyleList: this.data.bottomStyleList,
      isMore: true,
      pageNo: 1,
      goodsList: [],
      allpages: 0,
      currentIndex: index == 0 ? "" : index
    });
    var that = this;
    let indexNum = (index == 0 ? '' : index);
    that.initData(indexNum);
    // if (wx.pageScrollTo) {
    //   wx.pageScrollTo({
    //     scrollTop: 0
    //   })
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，无法使用回到顶部功能，请升级到最新微信版本后重试。'
    //   })
    // }
  },
  cancelOrder: function (e) {

    let that = this;
    let orderNo = e.currentTarget.dataset.orderno;
    let payFlag = e.currentTarget.dataset.payflag;
    let orderStatus = e.currentTarget.dataset.orderstatus;

    function ajaxRequire(data, cancelCallback) {
      wx.request({
        url: APP.globalData.url + '/api/v1/order/cancelOrder',
        method: 'POST',
        data: data,
        success: function (res) {
          if (res.data.code !== 20000) {
            return
          }
          cancelCallback(res.data.data);
        }
      })
    }
    let data = {
      orderNo: orderNo
    };
    if (orderStatus == 1 && payFlag == 0) {
      // if (true) {
      wx.showModal({
        title: '提示',
        content: '确认取消订单吗？',
        success: function (res) {
          if (res.confirm) {
            function cancelCallback(res) {
              wx.showToast({
                title: res.message,
                icon: 'success',
                duration: 1000,
                success: function (res) {
                  that.setData({
                    isMore: true,
                    pageNo: 1,
                    goodsList: [],
                    allpages: 0
                  });
                  let index = that.data.currentIndex;
                  that.initData(index);
                }
              })

            }
            ajaxRequire(data, cancelCallback)
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    } else {
      function noCancelCallback(res) {
        wx.showModal({
          title: '提示',
          content: res.message,
          showCancel: false,
        })
      }
      ajaxRequire(data, noCancelCallback);
    }
  },
  deleteOrder:function(e){
    console.log('删除订单还没有接口')
  },
  repay: function (e) {
    
    var _userInfo = wx.getStorageSync('userInfo');
    let that = this;
    let orderNo = e.currentTarget.dataset.orderno;
    console.log(orderNo)
    let data = {
      order_no: orderNo,
      member_id: _userInfo.memberId
    };
    wx.request({
      url: APP.globalData.url + '/api/v1/order/repay',
      method: 'POST',
      data: data,
      success: function (res) {
        
        console.log(res)
        if (res.data.code === 20000) {
          let _data = res.data.data;
          let url = '/pages/payment/goPay/goPay?prepay_id=' + _data.prepay_id + '&order_no=' + _data.order_no
          wx.redirectTo({
            url: url
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              //
            }
          })
        }
      }
    })

  }
}) 