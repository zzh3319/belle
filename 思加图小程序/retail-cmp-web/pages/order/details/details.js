// pages/main/index.js
var APP = getApp();
var QR = require("../../../utils/qrcode.js");
Page({
  data: {
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
    ifSelfge: false,
    showQRcode: true
  },
  onLoad: function (option) {
    // 页面初始化 options为页面跳转所带来的参数
    // var size = this.setCanvasSize();//动态设置画布大小
    // var initUrl = JSON.stringify({ "os": 12, "dtlVo": [{ "bNo": "BS01", "code": "CS00361230-009", "size": "235", "qty": 1 }] });
    // this.createQrCode(initUrl, "mycanvas", size.w, size.h);


    var that = this;
    let orderNo = option.orderNo;
    let orderStatus = option.orderStatus;


    let addressUrl = APP.globalData.url + '/api/v1/order/getOrderConsigneeInfoList/' + orderNo;
    let orderUrl = APP.globalData.url + '/api/v1/order/getOrderInfo/' + orderNo;
    let data = {};
    let method = 'Get';
    function orderMsgCallback(res) {
      console.log(res);
      let orderPickType = res.orderPickType;//快递/自提0 1

      if (orderPickType === 1) {//自提

        if (orderStatus == 80 || orderStatus == 4 || orderStatus == 1) {//不显示二维码(已取消、已收货、待付款)
          that.setData({
            showQRcode: false
          })
        } else {//显示二维码
          let orderObj = { "os": 12, "dtlVo": [] };
          let orderList = res.mallOrderDetailVos;
          for (let i = 0, length = orderList.length; i < length; i++) {
            orderObj.dtlVo.push(
              {
                'bNo': orderList[i].brandNo,
                'code': orderList[i].productCode,
                'size': orderList[i].sizeNo,
                'qty': orderList[i].quantity
              }
            )
          }
          let orderMsg = JSON.stringify(orderObj)
          var size = that.setCanvasSize();//动态设置画布大小
          that.createQrCode(orderMsg, "mycanvas", size.w, size.h);
          that.setData({
            showQRcode: true
          })
        }

      } else {//快递 显示地址

        APP.sentHttpRequestToServer(addressUrl, data, method, addressCallback);
        function addressCallback(res) {

          let data = res[0];
          let address = data.province + data.city + data.district + data.address;
          that.setData({
            address: address,
            consigneeName: data.consigneeName,
            mobilePhone: data.mobilePhone
          })
        }
      }


      let mallOrderDetailVos = res.mallOrderDetailVos;
      for (let i = 0, length = mallOrderDetailVos.length; i < length; i++) {
        mallOrderDetailVos[i].url = '/pages/detail/detail?pn=' + mallOrderDetailVos[i].productNo
      }
      let dataObj = {
        orderStatusName: res.orderStatusName,
        orderNo: res.orderNo,
        mallOrderDetailVos: mallOrderDetailVos,
        orderTotalAmount: res.orderTotalAmount,
        quantity: res.quantity,
        createTime: res.createTime,//下单时间
        payTime: res.payTime,//payTime
        payFlag: res.payFlag == 0 ? '未支付' : '已支付',
        orderPickType: orderPickType === 0 ? '快递' : '自提',
        ifSelfge: orderPickType === 0 ? false : true
        // showGoodsMsg: orderStatus==()
      }
      that.setData(dataObj);
    }
    APP.sentHttpRequestToServer(orderUrl, data, method, orderMsgCallback);//订单
  },

  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 600
    })
    setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  }

})