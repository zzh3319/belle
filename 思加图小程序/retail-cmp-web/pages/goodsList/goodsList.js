var APP = getApp();
Page({
    // 页面的初始数据
    data: {
        goodsItem: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(opt) {
        var that = this;
        wx.request({
            url: APP.globalData.url + '/api/v1/product/getProductList',
            data: {
                linkType: opt.linkType || 4,
                pageId: opt.pageId || '',
                pageSize: opt.pageSize || 20
            },
            success: function(res) {
                if (res.data.code === 20000) {
                    that.setData({
                        goodsItem: res.data.data.list || []
                    });
                } else {
                    wx.showModal({
                        content: res.errMsg,
                        success: function(res) {
                            //
                        }
                    });
                }
            }
        })
    }
})
