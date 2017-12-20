
var APP = getApp();
Page({
  data: {
    centerLongtitude: '',//中心经度
    centerLatitude: '',//中心维度
    shops: [],
    markers: []
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  telHandler: function (e) {
    
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  onLoad: function (res) {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var centerLatitude = res.latitude
        var centerLongtitude = res.longitude
        that.setData({
          centerLongtitude: centerLongtitude,
          centerLatitude: centerLatitude
        })
        console.log(APP.globalData.url)
         let url = APP.globalData.url + '/api/v1/shop/near/show';
         let brandNo = APP.globalData.mall_brand_no;
         console.log(brandNo)
        let data = {
          'longitude': centerLongtitude,
          'latitude': centerLatitude,
          'brandNo':brandNo
        };
        let method = 'GET';
        
    //  successCallback(mapdata)
        function successCallback(res) {
          
           let responseList = res;
          //let responseList = res.data;
          
          let markers = [];
          let shops = [];
          function toDecimal(x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
              return;
            }
            f = parseInt(x * 100) / 100;
            return f;
          }
          console.log(responseList)
          for (let i = 0, length = responseList.length; i < length; i++) {
            markers.push({
              iconPath: "/images/map/map" + (i + 1) + ".png",
              id: i,
              latitude: responseList[i].shopLatitude,
              longitude: responseList[i].shopLongitude,
              width: 25,
              height: 25
            })

            shops.push({
              fullName: responseList[i].fullName,
              tel: responseList[i].tel,
              distance: toDecimal(responseList[i].distance),
              address: responseList[i].address
            })
          }
          that.setData({
            markers: markers,
            shops: shops
          })
        }
         APP.sentHttpRequestToServer(url, data, method, successCallback)
      }
    })
  }
})