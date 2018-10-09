var app = getApp();
var api = app.globalData.api;
var COS = require('../lib/cos-wx-sdk-v5');
var config = require('./config');
var cos = new COS({
  getAuthorization: function (params, callback) {	//获取签名        
  var authorization = COS.getAuthorization({            
    SecretId: config.SecretId,            
    SecretKey: config.SecretKey,            
    Method: params.Method,            
    Key: params.Key        
  });        
  callback(authorization);    
  }
});

    
Page({
  data: {
    list: [],
    tempFilePaths:[],
  },
  
  //图片上传本地
  uploadImg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var file = that.data.tempFilePaths;
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          file.push(res.tempFilePaths[i]);
        }
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths: file
        })
      }
    })
  },
  simpleUpload: function (data) {
    // 选择文件
    for (var i = 0; i < this.data.tempFilePaths.length; i++) {
        var filePath = this.data.tempFilePaths[i]
        var Key = filePath.substr(filePath.lastIndexOf('.') + 1); // 这里指定上传的文件名
        var dateObj = new Date();
        var timestamp = dateObj.getTime();
        var nowDate = dateObj.toLocaleDateString();
        var nowMin = dateObj.toLocaleTimeString().substr(2);
        var nowTime = nowDate + ' ' + nowMin;
        var formatDate = nowDate.replace(/\//g, "-");  // 格式斜杠日期
        //console.log(formatDate);
        var newKey = app.globalData.instrumentId + '/' + formatDate + '/' + timestamp + '.' + Key;   // cos上定义目录
        //console.log(newKey);
        var tempObj = {};
        var fileName = timestamp + '.' + Key;
        var picAddress = "https://hnty-1257729707.cos.ap-beijing.myqcloud.com/" + newKey;
        tempObj.imgLocation = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + newKey; // 返回上传的绝对URL

        cos.postObject({
          Bucket: config.Bucket,  // 存储桶
          Region: config.Region,  // 地域
          Key: newKey,
          FilePath: filePath,     // 本地文件临时地址
          // onProgress: function (info) {   // 上传时基本信息
          // console.log(JSON.stringify(info));
          // }
        }, requestCallback(null, tempObj));
      wx.request({
        url: 'http://47.92.33.38:8080/hnty/app/android/insertAppUploadMediaInfo?mediaName=' + fileName,
        method: "POST",
        data: {
          bucketName: "hnty-1257729707",
          instrumentId: app.globalData.instrumentId,
          latitude: app.globalData.longitude,
          longitude: app.globalData.latitude,
          mediaAddress: picAddress,
          mediaDate: nowTime,
          mediaName: fileName,
          mediaType: Key,
          telNumber: ""
        },
        success: function (res) {
          //console.log(res.data);
          var tempArray = null;
          tempArray = wx.getStorageSync('picture');
          console.log(tempArray);
          tempArray.push(picAddress)
          wx.setStorageSync('picture', picAddress);
        }
      })
    }
  },
      
  //删除已选择图片
  deleteimg: function (e) {
    var that = this;
    var images = that.data.tempFilePaths;
    var index = e.currentTarget.dataset.id;//获取当前长按图片下标
    //console.log(index);
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          //console.log('点击确定了');
          images.splice(index, 1);
        } else if (res.cancel) {
          //console.log('点击取消了');
          return false;
        }
        that.setData({
          tempFilePaths:images
        });
      }
    })
  }

});

// 上传图片回调函数
var requestCallback = function (err, data) {
  //console.log(err || data);
  if (err && err.error) {
    wx.showModal({ title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
  } else if (err) {
    wx.showModal({ title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
  } else {
    wx.showToast({ title: '请求成功', icon: 'success', duration: 3000 });
  }
};


