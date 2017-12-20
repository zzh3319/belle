// import city from '../../../json/city';
// import tips from '../../../json/tips';
var APP = getApp();

Page({
    // 页面的初始数据
    data: {
        shippingId: '', //自提为''，快递有值
        hidden: false,
        Self: true, //自提
        Post: false, //快递
        address: {}, //地址数据
        addressList: [],
        navId: 1,
        memberId: '', //全局传参
        regionArray: [],
        regionIndex: [0, 0, 0],
        items: {
            labelText: '设为默认地址',
            iconType: 'circle',
            is_default: false
        },
        isPickerChange: false,
        isConfirm: true,
        goodsList: []
    },
    showModal: function() {
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
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 100)
    },
    hideModal: function() {
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
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 100)
    },
    // 选项卡方法
    navClick: function(e) {
        this.setData({
            navId: e.target.dataset.id
        })
    },
    createOrder(e) {
        let that = this,
            _userInfo = that.data.userInfo,
            _ds = that.data,
            _data = _ds.sData;
        let shippingId = that.data.shippingId;
        if(that.data.navId && !shippingId){
            wx.showModal({
                content: '请添加收货地址！',
                mask: true
            });
            return;
        }
        that.setData({isConfirm: false});
        wx.showLoading({
          title: '创建订单中',
          mask: true
        });
        wx.request({
            url: APP.globalData.url + '/api/v1/order/create',
            method: 'POST',
            data: {
                buy_total_count: _data.total_count,
                consignee_id: shippingId,
                custom_note: '',
                delivery_type: _ds.navId ? 0 : 1,
                mall_brand_no: _data.postInfo.mall_brand_no,
                mall_no: _data.postInfo.mall_no,
                mall_shop_no: _data.postInfo.mall_shop_no,
                member_id: _userInfo.memberId,
                pay_type: _data.pay_type,
                pre_order_detail_list: _data.shop_products[0].item_list,
                shop_no: APP.globalData.retail_shop_no,
                sc: APP.globalData.from_saleCode,
                login_name: _userInfo.loginName,
                wx_open_id: _userInfo.openId,
                wx_union_id: _userInfo.unionId
            },
            success: function(res) {
                if (res.data.code === 20000) {
                    let _data = res.data.data;
                    wx.redirectTo({
                        url: '/pages/payment/goPay/goPay?prepay_id=' + _data.prepay_id + '&order_no=' + _data.order_no
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        success: function(res) {
                            that.setData({isConfirm: true});
                        }
                    })
                }
            },
            fail: function (e) {
              that.setData({isConfirm: true});
            }
        });
    },
    showModal: function(e) {
        if (this.data.consignee_info) {
            this.getAddressList(e.currentTarget.dataset);
        }else{
          this.setData({isFirstAddAddress: true});
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
            showModalStatus: true
        })
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 100)
    },
    hideModal: function() {
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
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 100)
    },
    // 加载
    onLoad(options) {
        let that = this,
            _key = options.orderkey;

        wx.getStorage({
            key: _key,
            success(res) {
                if (res.errMsg === 'getStorage:ok') {
                    let _data = res.data,
                        _itemList = _data.shop_products[0].item_list,
                        //一期暂不考虑多店情况, 默认单店 add by guoran 20171213
                        goodsList = _itemList.map((item, i) => {
                            return {
                                pic: item.product_pic_url,
                                name: item.product_name,
                                price: item.sale_price,
                                discount_price: item.tag_price,
                                color: item.color_name,
                                size: item.size_mapping_value,
                                num: item.quantity,
                                id: item.product_no,
                                linkTo: 'confirm'
                            }
                        });
                    that.setData({
                        sData: _data,
                        goodsList: goodsList,
                        payAmount: _data.pay_amount,
                        vipAmount: _data.vip_pref_amount,
                        totalCount: _data.total_count,
                        consignee_info: _data.consignee_info.whether_default === 3 ? 0 : (function(item) {
                            return Object.assign(item, {
                                receiverName: item.receiver_name,
                                receiverPhone: item.receiver_phone,
                                shippingId: item.shipping_id
                            });
                        }(_data.consignee_info)),
                        shippingId: _data.consignee_info.whether_default === 3 ? 0 : _data.consignee_info.shipping_id,
                        isList: true
                    });
                }
            }
        });
        wx.getStorage({
            key: 'userInfo',
            success(e) {
                if (e.errMsg === 'getStorage:ok') {
                    that.setData({ userInfo: e.data });
                }
            },
            fail(e) {
                wx.showModal({
                    content: '用户信息获取失败'
                })
            }
        });
        that.loadRegion();
    },
    addAddress(e) {
        let that = this,
            _opts = e.detail.value;
        _opts.member_id = that.data.userInfo.memberId;
        if (_opts.whether_default.length) {
            _opts.whether_default = _opts.whether_default[0];
        }else{
          _opts.whether_default = 2;
        }
        wx.request({
            url: APP.globalData.url + '/api/v1/address/addAddress',
            method: 'POST',
            data: _opts,
            success: function(res) {
                if (res.data.code === 20000) {
                    let _data = res.data.data;
                    if (_data.result) {
                        wx.showToast({
                            icon: 'success',
                            content: _data.data,
                            mask: true
                        });

                        that.setData({
                            isList: true
                        });

                        if (that.data.listAdd) {
                            that.getAddressList();
                        } else {
                            that.getDefaultAddress();
                            that.setData({
                                showModalStatus: false
                            });
                        }
                    } else {
                        wx.showModal({
                            content: '地址保存失败'
                        })
                    }

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
    getDefaultAddress(e) {
        let that = this;
        wx.request({
            url: APP.globalData.url + `/api/v1/address/getDefaultAddress/${that.data.userInfo.memberId}`,
            success: function(res) {
                if (res.data.code === 20000) {
                    let _data = res.data.data;
                    if (_data.total) {
                        that.setData({
                            consignee_info: _data.data,
                            shippingId: _data.data.shippingId,
                            addressSelectedId: _data.data.shippingId
                        });
                    } else {
                        wx.showModal({
                            content: _data.message
                        })
                    }
                } else {
                    wx.showModal({
                        content: res.data.message
                    })
                }
            }
        });
    },
    loadAddress(e) {
        let that = this,
            _ds = e.target.dataset,
            shippingId = _ds.shippingId;
        wx.request({
            url: APP.globalData.url + `/api/v1/address/getAddress/${that.data.userInfo.memberId}/${shippingId}`,
            success: function(res) {
                if (res.data.code === 20000) {
                    let _data = res.data.data;
                    if (_data.result) {
                        that.setData({ addressEditData: _data.data, isList: false, shippingId: _data.data.shippingId, isPickerChange: false });
                        that.loadPickDefault(_data.data);
                    }
                } else {
                    wx.showModal({
                        content: res.data.message
                    })
                }
            }
        });
    },
    loadPickDefault(address) {
        let that = this,
            list = that.data.regionList,
            addIndex = [],
            regionArray = [
                [],
                [],
                []
            ];
        if (list.length) {
            list.forEach((item, i) => {
                regionArray[0].push({
                    code: item.province_code,
                    name: item.province_name,
                    text: item.text,
                    value: item.value
                });
                if (item.province_code == address.provinceCode) {
                    addIndex[0] = i;
                    let city = item.city;
                    city.forEach((item, y) => {
                        regionArray[1].push({
                            code: item.city_code,
                            name: item.city_name,
                            text: item.text,
                            value: item.value
                        });
                        if (item.city_code == address.cityCode) {
                            addIndex[1] = y;
                            that.getCountry(address.cityCode, address.districtCode, function(countrys, _index) {
                                addIndex[2] = _index;
                                regionArray[2] = countrys;
                                that.setData({ regionIndex: addIndex, regionArray: regionArray });
                            })
                        }
                    });
                }
            });
        }
    },
    closeAddDialog(e) {
        if(this.data.isFirstAddAddress){
          this.setData({showModalStatus: false});
        }
        this.setData({ addressEditData: 0, isList: true, listAdd: false });
    },
    closeEditDialog(e) {
        this.setData({ addressEditData: 0, isList: true, listAdd: false });
    },
    updateAddress(e) {
        let that = this,
            _opts = e.detail.value;
        _opts.member_id = that.data.userInfo.memberId;
        wx.request({
            url: APP.globalData.url + '/api/v1/address/updateAddress',
            method: 'POST',
            data: _opts,
            success: function(res) {
                if (res.data.code === 20000) {
                    let _data = res.data.data;
                    if (_data.result === 1) {
                        wx.showToast({
                            icon: 'success',
                            content: _data.data,
                            mask: true
                        });

                        that.setData({
                            isList: true,
                            listAdd: true
                        });

                        if (that.data.listAdd) {
                            that.getAddressList();
                        } else {
                            that.setData({
                                showModalStatus: false
                            });
                        }
                    } else {
                        wx.showModal({
                            content: '地址修改失败'
                        })
                    }

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
    getAddressList(ds) {
        let that = this;
        wx.request({
            url: APP.globalData.url + '/api/v1/address/getAddressList/' + that.data.userInfo.memberId,
            success: function(res) {
                if (res.data.code === 20000) {
                    let _data = res.data.data.data;
                    if (_data.length) {
                        if (ds) {
                            that.setData({ addressSelectedId: ds.shippingId });
                        }
                        that.setData({ addressList: _data });
                    }
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.message,
                        success: function(res) {
                            //
                        }
                    })
                }
            }
        });

    },
    getCountry(code, countryCode, cbk) {
        let that = this;
        wx.request({
            url: APP.globalData.url + '/api/v1/lookup/findCounty',
            data: {
                code: code
            },
            success: function(res) {
                if (res.data.code === 20000) {
                    let _data = res.data.data,
                        _countrys = [],
                        _i = 0;
                    _data.forEach((item, i) => {
                        _countrys.push(item);
                        if (item.county_code == countryCode) {
                            _i = i;
                        }
                    });
                    if (cbk) {
                        cbk(_countrys, _i);
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 3000
                    });
                }
            }
        })
    },
    addNewAddress(e) {
        this.setData({ isList: false, listAdd: true, addressEditData: 0, regionIndex: [0, 0, 0], regionArray: this.data.baseRegion});
    },
    addressChange(e) {
        this.setData({ shippingId: e.detail.value })
    },
    selectAddress(e) {
        let that = this,
            address = this.data.addressList.filter((item, i) => {
                return item.shippingId == that.data.shippingId
            });
        if (address.length) {
            this.setData({
                consignee_info: address[0],
                addressSelectedId: that.data.shippingId
            });
            this.hideModal();
        }
    },
    loadRegion() {
        let that = this;
        wx.request({
            url: APP.globalData.url + '/api/v1/lookup/findProvinceAndCity',
            data: {},
            success: function(res) {
                if (res.data.code === 20000) {
                    let _data = res.data.data,
                        column1 = _data.map((item, i) => {
                            return {
                                code: item.province_code,
                                name: item.province_name,
                                text: item.text,
                                value: item.value
                            }
                        }),
                        column2 = _data[0].city.map((item, i) => {
                            return {
                                code: item.city_code,
                                name: item.city_name,
                                text: item.text,
                                value: item.value
                            }
                        });
                    that.setData({
                        regionList: _data,
                        regionArray: [column1, column2, []],
                        baseRegion: [column1, column2, []]
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 3000
                    });
                }
            }
        })
    },
    setCountry(sdata, code) {
        var that = this;
        wx.request({
            url: APP.globalData.url + '/api/v1/lookup/findCounty',
            data: {
                code: code
            },
            success: function(res) {
                if (res.data.code === 20000) {
                    let _data = res.data.data,
                        column3 = _data.map((item, i) => {
                            return {
                                code: item.county_code,
                                name: item.county_name,
                                text: item.text,
                                value: item.value
                            }
                        });
                    sdata.regionArray[2] = column3;
                    that.setData(sdata);
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 3000
                    });
                }
            }
        })
    },
    bindRegionPickerChange(e) {
        this.setData({
            isPickerChange: true,
            regionIndex: e.detail.value
        })
    },
    bindRegionColumnChange(e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        let that = this,
            _column = e.detail.column,
            _index = e.detail.value,
            data = {
                regionArray: this.data.regionArray,
                regionIndex: this.data.regionIndex
            };
        data.regionIndex[_column] = _index;
        // [this.data.regionList, this.data.regionList[e.detail.value].city, [{}]]
        switch (e.detail.column) {
            case 0:
                data.regionIndex = [_index, 0, 0];
                data.regionArray[1] = this.data.regionList[_index].city.map((item, i) => {
                    return {
                        code: item.city_code,
                        name: item.city_name,
                        text: item.text,
                        value: item.value
                    }
                });
                that.setCountry(data, data.regionArray[1][data.regionIndex[1]].code);
                break;
            case 1:
                data.regionIndex[2] = 0;
                that.setCountry(data, data.regionArray[1][_index].code);
                break;
            default:
                break;
        }

        this.setData(data);
    }

})
