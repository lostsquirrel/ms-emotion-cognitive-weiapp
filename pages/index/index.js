//index.js
var imageUtil = require('../../utils/util.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    systemInfo: {},
    results: [],
    imageSize: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  startTap: function() {
    var param = {}
    var that = this;
    param.count = 1;
    wx.showLoading({
      title: '上传处理中',
      mask:true
    }); 
    param.success = function(data) {
      // console.debug(data)
      var o = that.data
      // console.log(o)
      var chooseImage = data.tempFilePaths[0];
      // 
      console.log(chooseImage)
      wx.uploadFile({
        url: 'https://demos.shangao.tech/api/cognitive/upload/',
        filePath: chooseImage,
        name: "file",
        success: function(data) {
          // console.log(data);
          // console.log(data);
          // console.log(that)
          var p = {}
          // console.log(data)
          // console.log(data.data)
          var results = JSON.parse(data.data)
          p.chooseImage = results.url

          wx.getImageInfo({
            src: chooseImage,
            success: function(res) {
             
              const ctx = wx.createCanvasContext('myCanvas')
              // ctx.
              // console.log(ctx)
              // console.log(res.windowWidth)
              var systemInfo = that.data.systemInfo;
              var maxWidth = systemInfo.windowWidth;
              var scale = 0.9;
              var ratio = res.width / maxWidth;
              // console.debug(ratio)
              var width = res.width / ratio * scale;
              var height = res.height / ratio * scale;
              that.setData({
                imageSize: {
                  'width': width + 10,
                  'height': height + 10
                }
              })
              ctx.drawImage(chooseImage, 0, 0, width, height);
              ctx.draw(true)
              var dataList = results.data
              console.debug(results)
              console.debug(dataList)
              function makeRatio(original) {
                return Math.ceil(original / ratio * scale);
              }
              var resultList = {}
              that.setData({'results': {}});
              if (dataList.length) {
                for (var i = 0; i < dataList.length; i++) {
                  var item = dataList[i];
                  // console.debug(item)
                  resultList['results[' + i + ']'] = item;
                  var faceRectangle = item.faceRectangle;
                  // console.debug(faceRectangle)
                  ctx.beginPath()
                  ctx.setStrokeStyle('red')
                  ctx.rect(makeRatio(faceRectangle.left), makeRatio(faceRectangle.top), makeRatio(faceRectangle.width), makeRatio(faceRectangle.height));
                  ctx.stroke();

                }
              } else {
                resultList['results[0].result'] = '图片识别失败，请换一张试试'
              }
                
                that.setData(resultList);
                setTimeout(function(){
                  ctx.draw(true);
                }, 50);
              
              wx.hideLoading();
            }
          })
          // that.setData(p);
          // console.log(that.data)
          // console.log('-------------')
          
         
        
        }
      });
    }
    wx.chooseImage(param)
  },
  touchMove: function(e) {
    console.debug(e)
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo:res
        })
        
      },
    })
  }
})
