// pages/welcome/welcome.js
// LH120000011
var app = getApp();    
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserInfo:{},
    hasLocation:false,
    location:{},
    instrumentId:null
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("onLoad")
    var that = this
    //调用应用实例的方法获取全局数据
    wx.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    }),
    wx.getLocation({
      success: function (res) {
        app.globalData.longitude = res.longitude;
        app.globalData.latitude = res.latitude;
        //console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude,
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide') 
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('onShareAppMessage')
  },
  
  scanclick: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        console.log("--result:" + res.result + "--scanType:" + res.scanType + "--charSet:" + res.charSet + "--path:" + res.path); 
        this.data.instrumentId = res.result;
        console.log(this.data.instrumentId);
        this.setData({
          idValue:res.result
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },

  idInput:function (e){
    this.setData({
      instrumentId:e.detail.value
    })
  },

  clearInput:function(){
    this.setData({
      idValue: ""
    })
  },

  login: function(){
    
    wx.navigateTo({
      url: '../upload/upload'
    })
    app.globalData.instrumentId = this.data.instrumentId
  },

  cancleButton: function(){
    wx.navigateBack({ 
      delta: 1 
      })
  }
})