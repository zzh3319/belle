require('../../common/common');
var APP = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        trendList: [],
        threshold: 50,
        scrollTop: 0,
        pageNo: 1,
        pageSize: 10,
        isMore: true
    },
    firstLoad: function(isPullDown) {
        var that = this;
        wx.showLoading({ title: '加载中' });
        wx.request({
            url: APP.globalData.url + '/api/v1/act/list',
            data: {
                mallNo: APP.globalData.mall_no,
                mallBrandNo: APP.globalData.mall_brand_no,
                mallShopNo: APP.globalData.mall_shop_no,
                pageNo: 1,
                pageSize: that.data.pageSize
            },
            success: function(res) {
                if (res.data.code === 20000) {
                    that.setData({
                        trendList: res.data.data,
                        pageNo: res.data.data.length ? ++that.data.pageNo : that.data.pageNo
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'error',
                        duration: 3000
                    });
                }
                if(isPullDown){
                  wx.stopPullDownRefresh();
                }
                wx.hideLoading();
            },
            fail: function(e) {
                wx.hideLoading();
                wx.showToast({
                    title: e.errMsg,
                    icon: 'error',
                    duration: 3000
                });
            }
        })
    },
    loadData: function(e) {
        let that = this,
            olist = that.data.trendList;
        wx.showLoading({ title: '加载中' });
        wx.request({
            url: APP.globalData.url + '/api/v1/act/list',
            data: {
                mallNo: APP.globalData.mall_no,
                mallBrandNo: APP.globalData.mall_brand_no,
                mallShopNo: APP.globalData.mall_shop_no,
                pageNo: that.data.pageNo,
                pageSize: that.data.pageSize
            },
            success: function(res) {
                if (res.data.code === 20000) {
                    if (res.data.data.length) {
                        that.setData({
                            trendList: olist.concat(res.data.data),
                            pageNo: ++that.data.pageNo
                        });
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'error',
                        duration: 3000
                    });
                }
                wx.hideLoading();
            },
            fail: function(e) {
                wx.showToast({
                    title: e.errMsg,
                    icon: 'error',
                    duration: 3000
                });
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.firstLoad();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        console.log('haha');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function(e) {
        this.setData({
            trendList: [],
            pageNo: 1,
            pageSize: 10,
            isMore: true
        });
        this.setData({isDown: true});
        this.firstLoad(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function(e) {
        let that = this,
            _info = wx.getSystemInfoSync();
        if (_info.system.match(/ios/ig) && that.data.isDown) {
            that.setData({isDown: false});
        }else{
            this.loadData.call(this, e);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
