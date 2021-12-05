// pages/playground/location.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  gcj02() {
    const page = this;
    wx.getLocation({
      type: 'gcj02', //Returns the latitude and longitude that can be used for wx.openLocation
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        page.setData({ gcj02: { latitude, longitude } })
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
     })
  },

  wgs84() {
    const page = this;
    wx.getLocation({
      // type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        page.setData({ wgs84: { latitude, longitude } })
        wx.openLocation({
          latitude,
          longitude,
          scale: 20
        })
      }
     })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    

     
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})