var APP = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    moduleDataArr: [],
    goodsItem: [],
    moduleListReName:[],
    moduleDataArr:[],
    moduleList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.sc) {
      APP.globalData.from_saleCode = options.sc;
    }
    this.setData({
      moduleDataArr: [],
      goodsItem: [],
      moduleListReName: [],
      moduleDataArr: [],
      moduleList: []
    })
    let url = APP.globalData.url + '/api/v1/cms/index';
    let data = {
      'xs': APP.globalData.xs
    }

    var method = 'GET';
    var that = this;
    function successCallback(res) {
      var responseData = res;
      // console.log(responseData)
      let moduleListReName = [];//模块数组；
      let moduleList = [];
      let length = responseData.length;
      for (let i = 0; i < length; i++) {
        if (moduleListReName.indexOf(responseData[i].layout) < 0) {
          moduleListReName.push(responseData[i].layout);
        } else {
          moduleListReName.push(responseData[i].layout + "" + i);
        }
        moduleList.push(responseData[i].layout)
      }
      that.setData({
        moduleList: moduleList,
        moduleListReName: moduleListReName
      })

      for (let i = 0; i < length; i++) {
        var moduleName = moduleList[i];//模块名称

        switch (moduleName) {
          case 'slides'://轮播
            that.slidesFn(moduleList[i], i, responseData[i])
            break;
          case 'image_map'://热区
            that.image_mapFn(moduleList[i], i, responseData[i])
            break;
          case 'pic_act'://图文
            that.pic_actFn(moduleList[i], i, responseData[i])
            break;
          case 'video'://视频
            that.videoFn(moduleList[i], i, responseData[i])
            break;
          case 'pro_list'://模块链接
            that.pro_listFn(moduleList[i], i, responseData[i])
            break;
          default:

        }
      }
    }
    APP.sentHttpRequestToServer(url, data, method, successCallback)


  },
  onShow: function () {
   
    // this.loadGoodsList();

  },
  slidesFn: function (moduleName, index, data) {//轮播
    let that = this;
    let slideList = data.list;
    let dataObj = {};
    let imgList = [];
    let urlList = [];
    for (let i = 0, length = slideList.length; i < length; i++) {
      imgList.push(slideList[i].image_src);
      urlList.push(slideList[i].link);
    }
    dataObj = {
      imgList: imgList,
      urlList: urlList,
      moduleName: moduleName
    }
    let moduleDataArr = that.data.moduleDataArr;
    moduleDataArr.push(dataObj);
    that.setData({
      moduleDataArr: moduleDataArr
    })
  },
  pic_actFn: function (moduleName, index, data) {//图文
    let that = this;
    let pic_actList = data.list[0];
    let urlList = pic_actList.link;//因为list只有一个
    let imgList = pic_actList.image_src;
    let title = pic_actList.title;
    let publis_time = pic_actList.publis_time;
    let act_tag = pic_actList.act_tag;
    let dataObj = {};
    dataObj = {
      urlList: urlList,
      imgList: imgList,
      title: title,
      publis_time: publis_time,
      act_tag: act_tag,
      moduleName: moduleName
    };
    let moduleDataArr = that.data.moduleDataArr;
    moduleDataArr.push(dataObj);
    that.setData({
      moduleDataArr: moduleDataArr
    })
  },
  image_mapFn: function (moduleName, index, data) {//热区
    let that = this;
    let image_mapList = data.list;
    let urlList = [];
    let imgList = [];
    let positionList = [];
    let dataObj = {};

    for (let i = 0, length = image_mapList.length; i < length; i++) {

      let coordsArr = image_mapList[i].coords.split(',');//方向变数组
      let coordLengrh = coordsArr.length;
      let coordItem = ''
      if (!image_mapList[i].coords.length) {//mask为空 模板未铺满
        coordItem = `left:0;top:0;width:100%;height:100%`;
      } else {
        let dirc = ['left', 'top', 'width', 'height'];
        for (let j = 0; j < coordLengrh; j++) {
          coordItem += (dirc[j] + ":" + (coordsArr[j] * (375 / 380) * 1.85) + 'rpx;')//图片缩放比例
          //因为原图默认是 760px 也就是  380  6s的屏 375   375 / 380缩放  本应*2（test1.85成功）+‘rpx’
        }
      }
      positionList.push(coordItem);
      urlList.push(image_mapList[i].link);
    }
    imgList.push(image_mapList[0].image_src);
    dataObj = {
      imgList: imgList,
      urlList: urlList,
      positionList: positionList,
      moduleName: moduleName
    }
    let moduleDataArr = that.data.moduleDataArr;
    moduleDataArr.push(dataObj);
    that.setData({
      moduleDataArr: moduleDataArr
    })
  },
  pro_listFn: function (moduleName, index, data) {//商品列表
    let that = this;
    let pro_list = data.list;
    let imgList = [];
    let urlList = [];
    let product_name = [];
    let tag_price = [];
    let sale_price = [];
    let dataObj = {};
    let singleData = [];
    for (let i = 0, length = pro_list.length; i < length; i++) {
      singleData.push({
        gridPic: pro_list[i].image_src,
        link: pro_list[i].link,
        productName: pro_list[i].product_name,
        salePrice: pro_list[i].sale_price,
        tagPrice: pro_list[i].tag_price,
      })
    }
    dataObj = {
      singleData: singleData,
      moduleName: moduleName
    }
    let moduleDataArr = that.data.moduleDataArr;
    moduleDataArr.push(dataObj);
    that.setData({
      moduleDataArr: moduleDataArr
    })
  },
  videoFn: function (moduleName, index, data) {//视频

    let that = this;
    let videoList = data.list[0];
    let urlList = videoList.link;//因为list只有一个
    let title = videoList.title;
    let publis_time = videoList.publis_time;
    let act_tag = videoList.act_tag;
    let image_src = videoList.image_src;
    let dataObj = {
      urlList: urlList,
      publis_time: publis_time,
      title: title,
      act_tag: act_tag,
      image_src: image_src,
      moduleName: moduleName
    }
    let moduleDataArr = that.data.moduleDataArr;
    moduleDataArr.push(dataObj);
    that.setData({
      moduleDataArr: moduleDataArr
    })
  }

})