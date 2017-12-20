import etc from './etc.js'
class Logon {
  constructor() {
  }
  /**
   * 判断登录，从本地缓存中获取用户，存在且已开卡则返回用户信息，否则false
   */
  isLogin() {
    try {
      var _userInfo = wx.getStorageSync('userInfo')
      console.log(_userInfo);
      if (_userInfo.memberId && _userInfo.hasCard == true) {
        return _userInfo;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  getUserinfoAndSet(userinfo, brandcode, who) {
    console.log(userinfo.openId + "--" + userinfo.unionId + "--" + brandcode)
    wx.request({
      url: etc.basePath + '/api/v1/sign/in',
      method: "post",
      data: { openid: userinfo.openId, unionid: userinfo.unionId, brandcode: brandcode },
      success: function (result) {
        var userinfos = result.data.data;
        console.log(userinfos);
        try {
          let _userInfo = {
            avatarUrl: userinfo.avatarUrl,
            nickName: userinfo.nickName,
            memberId: userinfos.member_id,
            openId: userinfos.open_id,
            unionId: userinfos.union_id,
            province: userinfo.province,
            country: userinfo.country,
            city: userinfo.city,
            gender: userinfo.gender,
            hasCard: userinfos.has_card,
            loginName: userinfos.logon_name,
            mobile: userinfos.mobile,
            assistantCode: userinfos.assistant_code
          };
          console.log(_userInfo);
          wx.setStorageSync('userInfo', _userInfo)
          if (who) {
            who.setData({
              userInfo: _userInfo
            })
            who.getBoreUserInfo(who);
          }

        } catch (e) {
          console.log(e)
        }
      },
      fail: function () {
        console.log('系统错误')
      }
    });
  }

  /**
   * 授权登录开卡
   */
  sign(brandcode, who) {
    console.log(brandcode)
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
      duration: 2500
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code;
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              console.log(res)
              wx.request({
                url: etc.basePath + '/api/v1/user/encryptData',
                data: { encryptData: res.encryptedData, iv: res.iv, code: code },
                success: function (result) {
                  //4.解密成功后 获取自己服务器返回的结果
                  console.log(result);
                  if (result.data.data) {
                    var userinfo = result.data.data;
                    try {
                      console.log(userinfo);
                      if (userinfo) {
                        wx.request({
                          url: etc.basePath + '/api/v1/sign/in',
                          method: "post",
                          data: { openid: userinfo.openId, unionid: userinfo.unionId, brandcode: brandcode },
                          success: function (result) {
                            console.log(result);
                            if (result.data.code == 42002) { //会员不存在
                              //调用开卡组件                          
                              wx.request({
                                url: etc.basePath + '/api/v1/user/get/cardparam/' + brandcode,
                                success: function (res) {
                                  console.log(res.data);
                                  wx.navigateToMiniProgram({
                                    appId: 'wxeb490c6f9b154ef9', //固定为此 appid，不可改动
                                    extraData: { encrypt_card_id: res.data.encrypt_card_id, outer_str: res.data.outer_str, biz: res.data.biz }, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
                                    success: function (rsCard) {
                                      console.log(rsCard);
                                      new Logon().getUserinfoAndSet(userinfo, brandcode, who)
                                    },
                                    fail: function (rsCard) {
                                      console.log(rsCard);
                                      new Logon().getUserinfoAndSet(userinfo, brandcode, who)
                                    },
                                    complete: function () {
                                      new Logon().getUserinfoAndSet(userinfo, brandcode, who)
                                    }
                                  });
                                }
                              });
                            }
                            if (result.data.data) {
                              if (result.data.data.has_card == false) {
                                var cardInfo = result.data.data.user_card;
                                console.log(cardInfo)
                                //调用开卡
                                wx.addCard({
                                  cardList: [
                                    {
                                      cardId: cardInfo.card_id,
                                      cardExt: cardInfo.card_ext
                                    }
                                  ],
                                  success: function (res) {
                                    console.log(res.cardList) // 卡券添加结果
                                    new Logon().getUserinfoAndSet(userinfo, brandcode, who)
                                  },
                                  fail: function (e) {
                                    console.log(e)
                                    new Logon().getUserinfoAndSet(userinfo, brandcode, who)
                                  }
                                });
                              } else {
                                console.log(result)
                                try {
                                  if (result.data) {
                                    new Logon().getUserinfoAndSet(userinfo, brandcode, who)
                                  }
                                } catch (e) {
                                  console.log(e);
                                }
                                wx.showToast({
                                  title: '欢迎您',
                                });
                              }
                            }
                          },
                          fail: function () {
                            console.log('系统错误')
                          }
                        });
                      } else {
                        console.log("未登录");
                      }
                    } catch (e) {
                      console.log(e);
                    }

                  }

                },
                fail: function () {
                  console.log('系统错误')
                }
              });
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function (rs) {
        console.log(rs)
      }
    });
  }
}

export default Logon