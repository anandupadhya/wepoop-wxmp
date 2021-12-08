// pages/user/index.js
const app = getApp()
const user = app.globalData.user

Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const page = this;
    const user_id = app.globalData.user.id
    page.setData({ user_id })

    const env = app.globalData.env
    const url = app.globalData.url[env]
    
    wx.request({
      url: `${url}/users/${user_id}`,
      // url: `http://localhost:3000/api/v1/toilets?latitude=${latitude}&longitude=${longitude}`,
      method: 'GET',
      header: {
        "X-USER-EMAIL": getApp().globalData.headers["X-USER-EMAIL"],
        "X-USER-TOKEN": getApp().globalData.headers["X-USER-TOKEN"]
      },
      success(res) {
        console.log(res)
        page.setData({
          favorites: res.data.favorites,
          reviews: res.data.reviews
        })
      }
    })
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