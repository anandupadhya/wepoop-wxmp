// pages/user/index.js
const app = getApp()
const user = app.globalData.user

Page({

  /**
   * Page initial data
   */
  data: {

  },

  startNavigation(e) {
    const page = this;
    const index = e.currentTarget.dataset.index
    console.log(index)
    wx.openLocation({
      latitude: page.data.favorites[index].latitude,
      longitude: page.data.favorites[index].longitude,
      scale: 18,
      name: page.data.favorites[index].description,
      complete(res) {
        // wx.redirectTo({
        //   url: `/pages/user/index`,
        // })
        wx.redirectTo({
          url: `/pages/toilets/review?toilet_id=${page.data.favorites[index].toilet_id}&is_favorite=${true}`,
        })
      }
    })
  },

  removeFavoriteHandler(e) {
    const page = this;
    console.log("going to remove favorite")

    // console.log(e.currentTarget.dataset.favoriteId)
    const id = e.currentTarget.dataset.favoriteId

    // console.log(e.currentTarget.dataset.index)
    const index = e.currentTarget.dataset.index

    //update page data so the deleted item disappears without needing to reload the page
    const favorites = page.data.favorites
    favorites[index].display = false
    page.setData({ favorites })

    // send DELETE request to remove the recod by favorite id  NOT the toilet id
    const env = app.globalData.env
    const url = app.globalData.url[env]

    wx.request({
      url: `${url}/favorites/${id}`,
      method: 'DELETE',
      header: {
        "X-USER-EMAIL": app.globalData.headers["X-USER-EMAIL"],
        "X-USER-TOKEN": app.globalData.headers["X-USER-TOKEN"]
      },
      success(res) {
        console.log(res)
        wx.showToast({
          title: 'Removed',
          icon: 'success',
          duration: 1000,
        })
      } 
    })
    
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
        const favorites = res.data.favorites.map((item, index) => {
          return { ...item, display: true }
        })
        page.setData({
          favorites,
          // reviews: res.data.reviews
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