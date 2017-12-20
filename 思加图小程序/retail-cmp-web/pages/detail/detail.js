var APP = getApp();
var Zan = require('../../component/index');
var WxParse = require('../../wxParse/wxParse.js');

Page(Object.assign({}, Zan.Quantity, {
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    goodName: "加载中...",
    currentPrice: "0.00",
    originalPrice: "0.00",
    pn: '',
    mall_shop_no: '',
    detail: "",
    kinds: [],
    colorName: "",  //颜色选择
    kindSize:"",   //尺码选择
    current: 0,
    nowSize: 0,
    total: 0,
    count: 1,
    cartGoodCount: 0,
    smpic: "",
    quantity: {},
    goOrder: true,
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    }
  },
  toggleDialog(e) {
    let gowhere;
    if (e) {
      gowhere = e.currentTarget.dataset.gowhere;
    }
    if (gowhere && gowhere == 'cart') {
      this.setData({
        goOrder: false
      });
    } else {
      setTimeout(() => {
        this.setData({
          goOrder: true
        });
      }, 300)
    }
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  onLoad(option) {    
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    if (option.sc){
      APP.globalData.from_saleCode = option.sc;
    }
    console.log(option)
    var _shopno = option.mallShopNo;
    if (_shopno){
      this.setData({
        mall_shop_no: _shopno
      });
    }
    var _pn = option.pn;
    this.setData({      
      pn: _pn
    });
  },
  getSkus(pn, mallShopNo, mallBrandNo, styleNo) {
    let that = this;
    wx.request({
        url: APP.globalData.url + '/api/v1/product/getColorAndSize',
        data: {
            pn: this.data.pn,
            mallShopNo: mallShopNo,
            mallBrandNo: mallBrandNo,
            styleNo: styleNo
        },
        success: function(res) {
            if (res.data.code === 20000) {
                let _data = res.data.data,
                    _current = _data[that.data.current];
                that.setData({
                    kinds: _data,
                    goodsId: _current.mall_item_skus[0].sku_no,
                    total: _current.mall_item_skus[0].available_qty,
                    colorName: _current.color_name,
                    kindSize: _current.mall_item_skus[0].available_qty ? _current.mall_item_skus[0].size_mapping_value : '',
                    smpic: _current.img_src,
                    quantity: {
                        quantity: 1,
                        min: 1,
                        max: _current.mall_item_skus[0].available_qty
                    }
                });
            } else {
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function(res) {
                        //
                    }
                })
            }
            wx.hideLoading();
        }
    });
  },
  handleZanQuantityChange(e) {
    var componentId = e.componentId;
    var quantity = e.quantity;
    this.setData({
      [`${componentId}.quantity`]: quantity,
      count: quantity
    });
  },
  tapKind(event) {
    let _ds = event.currentTarget.dataset,
        _type = _ds.type,
        _current = _ds.current, 
        _index = this.data.current,
        _nowItem = this.data.kinds[_type === 'color' ? _current : _index],
        _goodsId = _type === 'color' ? _nowItem.mall_item_skus[0].sku_no : _nowItem.mall_item_skus[_current].sku_no,
        _total = _type === 'color' ? _nowItem.mall_item_skus[0].available_qty : _nowItem.mall_item_skus[_current].available_qty,
        _nowSize = _type === 'color' ? 0 : _current;
    this.setData({
      current: _type === 'color' ? _current : _index,
      nowSize: _nowSize,
      goodsId: _goodsId,
      colorName: _nowItem.color_name,
      kindSize: _nowItem.mall_item_skus[_nowSize].available_qty ? _nowItem.mall_item_skus[_nowSize].size_mapping_value : '',
      total: _total,
      smpic: _nowItem.img_src,
      quantity: {
        quantity: 1,
        min: 1,
        max: _total
      },
      count: 1
    });
  },
  /**
   * 提交订单
   * add by guoran 20171211
   * @param  {object} e 事件对象
   * @return {void}   空
   */
  orderConfirm(e){
    let _ds = this.data,
       _userInfo = wx.getStorageSync('userInfo'),
        _index = _ds.current,
        _color = _ds.kinds[_index],
        _size = _color.mall_item_skus[_ds.nowSize],
        _opts = {
            color_name: _color.color_name,
            color_no: _color.color_no,
            item_sku_no: _size.sku_no,
            item_no: _color.item_no,
            brand_no: _ds.mallBrandNo,
            // item_type: 1,
            mall_brand_no: _ds.mallBrandNo,
            mall_no: _ds.mallNo,
            mall_shop_no: _ds.mallShopNo,
            // price_from_shop_name: 1,
            price_from_shop_no: APP.globalData.retail_shop_no,
            product_code: _color.product_code,
            product_name: _color.product_name,
            product_no: _color.product_no,
            quantity: _ds.count,
            size_kind: _size.size_kind,
            size_mapping_value: _size.size_mapping_value,
            size_no: _size.size_no,
            style_no: _color.style_no,
            member_id: _userInfo.memberId,
            login_name: _userInfo.loginName,
            wx_open_id: _userInfo.open_id,
            wx_union_id: _userInfo.union_id
        };
    
      if(!_ds.kindSize){
        wx.showModal({
            content: '请选择尺码',
            success: function(res) {
                //
            }
        })
        return;
      }
      wx.request({
        url: APP.globalData.url + '/api/v1/order/confirmation',
        method: 'POST',
        data: _opts,
        success: function(res) {
            if (res.data.code === 20000) {
                let _data = res.data.data;
                _data.postInfo = _opts;
                wx.setStorage({
                    key: 'orderConfirmData',
                    data: _data,
                    success(e) {
                        wx.navigateTo({
                            url: '/pages/order/confirm/confirm?orderkey=orderConfirmData'
                        });
                    },
                    fail(e) {
                        wx.showModal({
                            title: '提示',
                            content: e.data.msg,
                            success: function(res) {
                                //
                            }
                        })
                    }
                });
            } else {
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function(res) {
                        //
                    }
                })
            }
        }
    });   
  },
  buildImage(e){
    let _data = {
          goodName: this.data.goodName,
          price: this.data.currentPrice,
          img: this.data.imgUrls[0].imageSrc
        };
    var _pn = this.data.pn;
    wx.setStorage({
        key: 'buildImg',
        data: _data,
        success(e) {
            wx.navigateTo({
              url: '/pages/goodsPic/goodsPic?buildKey=buildImg&pn=' + _pn
            });
        },
        fail(e) {
            wx.showModal({
                title: '提示',
                content: e.data.msg,
                success: function(res) {
                    //
                }
            })
        }
    });
  },
  goIndex() {
    wx.switchTab({
      url: '../index/index?xs=' + APP.globalData.xs
    });
  },
  
  //分享按钮的显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  //分享按钮的隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 100)
  },

  //立即购买按钮的显示对话框
  show: function () {
    var userinfo = APP.Logon.isLogin();
    console.log(userinfo)
    if (!userinfo) { // 未登录
      APP.Logon.sign(APP.globalData.qx_brand_no);      
    }
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus2: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  //立即购买按钮的隐藏对话框
  hide: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus2: false
      })
    }.bind(this), 100)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    let args = [];
    for(var i in this.options){
      args.push(i + '=' + this.options[i])
    }
    var pathUrl = '/pages/detail/detail?pn=' + this.options.pn;
    // console.log(APP.globalData)
    if (APP.globalData.saleCode){
      pathUrl = pathUrl + '&sc=' + APP.globalData.saleCode;
    }
    pathUrl = pathUrl + '&mallShopNo=' + APP.globalData.mall_shop_no;  
    // console.log('分享path：'+pathUrl);
    return {
      title: this.data.goodName,
      path: pathUrl,
      imageUrl: this.data.imgUrls[0].imageSrc,
      success: function(res) {
          wx.showToast({
            title: '转发成功',
            duration: 3000,
            success: function(res) {
              var _userInfo = wx.getStorageSync('userInfo');
              let _union_id = '',
                  _saleCode = '',
                  _login_name = '';
              if (_userInfo){
                _union_id = _userInfo.unionId ? _userInfo.unionId : '';
                _saleCode = _userInfo.assistantCode ? _userInfo.assistantCode : '';
                _login_name = _userInfo.loginName ? _userInfo.loginName : '';
              }
              let that = this,
                globalData = APP.globalData,
                _data = {
                  click_type: '2',
                  oper_type:'2',
                  relevance_id: pathUrl,
                  login_name: _login_name,
                  union_id: _union_id,
                  shop_assistant_code: _saleCode
                };
              wx.request({
                url: globalData.url + '/api/v1/act/csi',
                data: _data,
                method: 'POST',
                success: function (res) {
                  
                }
              })
            }
        })
      },
      fail: function(res) {
        wx.showToast({
            title: '转发失败',
            image: '/images/icons/error.png',
            duration: 3000
        });
      }
    }
  },
  onShow:function(e){
    var that = this;
    var pn = this.data.pn;
    var _mall_shop_no = this.data.mall_shop_no;
    if (!_mall_shop_no){
      _mall_shop_no = APP.globalData.mall_shop_no; 
    }
    console.log(_mall_shop_no)
    wx.request({
      url: APP.globalData.url + '/api/v1/product/getProductDetail',
      data: {
        pn: pn,
        mallShopNo: _mall_shop_no
      },
      success: function (res) {
        if (res.data.code === 20000) {
          let _data = res.data.data;
          that.getSkus(pn, _data.mallShopNo, _data.mallBrandNo, _data.styleNo);
          that.setData({
            imgUrls: _data.mallProductImages,
            goodName: _data.productName,
            currentPrice: _data.presentPrice,
            originalPrice: _data.tagPrice,
            mallBrandNo: _data.mallBrandNo,
            mallNo: _data.mallNo,
            mallShopNo: _data.mallShopNo
          });
          WxParse.wxParse('detail', 'html', _data.mallProductDetail.detail, that);
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
    });
  }


}));
