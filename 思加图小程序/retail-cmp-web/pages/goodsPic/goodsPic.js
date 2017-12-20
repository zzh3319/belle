// pages/goodsPic/goodsPic.js
var APP = getApp();
var pn = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgPath: '',
        hide: false
    },
    getQrcode: function(execute) {
        let that = this,
            globalData = APP.globalData,
            data = {
                mallNo: globalData.mall_no,
                mallShopNo: globalData.mall_shop_no,
                mallBrandNo: globalData.mall_brand_no,
                xs: globalData.xs,
                sc: globalData.saleCode,
                pn: pn,
                ot: '1',
                ln: globalData.login_name,
                wxAcodeType: 2
            },
            _data = {
              click_type: '2',
              oper_type: '1',
              relevance_id: pn,
              login_name: globalData.login_name,
              shop_assistant_code: globalData.saleCode
            };

        wx.request({
            url: globalData.url + '/api/v1/getwxacode',
            data: data,
            method: 'GET',
            success: function(res) {
                if (res.data.code == 20000) {
                    if (execute) {
                        execute(res.data.data.wxacode_url);
                        wx.request({
                          url: globalData.url + '/api/v1/act/csi',
                          data: _data,
                          method: 'POST',
                          success: function (res) {

                          }
                        })
                    }
                } else {
                    wx.showModal({
                        title: '获取小程序码',
                        content: res.errMsg,
                        success: function(res) {}
                    })
                }
            },
            fail: function(argument) {
                wx.showModal({
                    content: '获取小程序码失败！'
                })
            }
        })

    },

    saveImg: function(e) {
        wx.saveImageToPhotosAlbum({
            filePath: this.data.imgPath,
            success(result) {
              wx.showToast({
                  title: '保存成功',
                  duration: 3000
              });
            },
            fail(e) {
                wx.showModal({
                    content: '保存失败',
                    success: function(res) {}
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        pn = options.pn;
        let that = this,
            ctx = wx.createCanvasContext('buildImg'),
            width = 732,
            height = 1000;
        wx.showLoading({
            title: '图片生成中',
        });
        wx.getStorage({
            key: options.buildKey,
            success: function(res) {
                let _data = res.data;
                wx.downloadFile({
                    url: _data.img,
                    success: function(ret) {
                        if (ret.errMsg === 'downloadFile:ok') {
                            wx.getImageInfo({
                                src: ret.tempFilePath,
                                success: function(ret) {
                                    let _scale = width / ret.width,
                                        _width = ret.width * _scale,
                                        _height = ret.height * _scale,
                                        _textBoxHeight = 78,
                                        _textY = _height - 26;
                                    ctx.setFillStyle('white')
                                    ctx.fillRect(0, 0, width, height);
                                    ctx.drawImage(ret.path, 0, 0, _width, _height);
                                    ctx.setFillStyle('rgba(0, 0, 0, 0.3)');
                                    ctx.fillRect(0, _height - _textBoxHeight, _width, _textBoxHeight);
                                    ctx.setFontSize(30);
                                    ctx.setFillStyle('white');
                                    ctx.fillText(_data.goodName, 25, _textY);
                                    ctx.setFontSize(25);
                                    ctx.setFillStyle('white');
                                    ctx.fillText('￥', 470, _textY);
                                    ctx.setFontSize(30);
                                    ctx.setFillStyle('white');
                                    ctx.fillText(_data.price, 500, _textY);
                                    that.getQrcode(function(url) {
                                        that.drawCode(ctx, url, width, height, _height);
                                    })
                                },
                                fail: function(e) {
                                    wx.showModal({
                                        content: e.errMsg
                                    })
                                }
                            });
                        }
                    },
                    fail: function(e) {
                        wx.showModal({
                            content: '主图出错：' + _data.img + e.errMsg
                        })
                    }
                });
            },
            fail: function(e) {
                wx.showModal({
                    content: '主信息获取失败'
                })
            }
        })
    },
    setToImg(width, height) {
        var that = this;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: width,
            height: height,
            destWidth: width,
            destHeight: height,
            canvasId: 'buildImg',
            success: function(res) {
                that.setData({
                    imgPath: res.tempFilePath,
                    hide: true
                });
                wx.hideLoading();
            },
            fail: function(e) {
                wx.showModal({
                    content: e.errMsg,
                    success: function(res) {}
                })
            }
        })
    },
    drawCode: function(ctx, url, width, height, _height) {
        let that = this;
        wx.downloadFile({
            url: url,
            success: function(ret2) {
                if (ret2.errMsg === 'downloadFile:ok') {
                    wx.getImageInfo({
                        src: ret2.tempFilePath,
                        success: function(qret) {
                            try {
                                ctx.drawImage(qret.path, 120, _height + 45, 150, 150);
                            } catch (e) {
                                wx.showModal({
                                    content: '图片生成出错'
                                })
                            }
                            ctx.setFontSize(30);
                            ctx.setFillStyle('#cccccc');
                            ctx.fillText('长按识别小程序码访问', 120 + 150 + 45, _height + 135);
                            ctx.draw();
                            wx.getSetting({
                                success(res) {
                                    if (!res.authSetting['scope.writePhotosAlbum']) {
                                        wx.authorize({
                                            scope: 'scope.writePhotosAlbum',
                                            success() {
                                                that.setToImg(width, height);
                                            },
                                            fail(e) {
                                                wx.showModal({
                                                    content: e.errMsg
                                                })
                                            }
                                        })
                                    } else {
                                        that.setToImg(width, height);
                                    }
                                },
                                fail(e) {
                                    wx.showModal({
                                        content: '获取设置失败！'
                                    })
                                }
                            })
                        },
                        fail(e) {
                            wx.showModal({
                                content: '图片下载失败！'
                            })
                        }
                    });
                } else {
                    wx.showModal({
                        content: '28' + e.errMsg
                    })
                }
            },
            fail: function(e) {
                console.log('5')
                console.log(e)
                wx.showModal({
                    content: 'code下载失败' + e.errMsg
                })
            },
            complete: function(e) {

            }
        });

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
