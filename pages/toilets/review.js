// pages/toilets/review.js
const app = getApp()
const env = app.globalData.env
const url = app.globalData.url[env]

Page({

  /**
   * Page initial data
   */
  data: {
    happy: null,
    comment: ""
  },

  getFavorites() {
    const page = this;
    const env = app.globalData.env
    const url = app.globalData.url[env]
    const user_id = app.globalData.user.id
    
    wx.request({
      url: `${url}/users/${user_id}`,
      method: 'GET',
      header: {
        "X-USER-EMAIL": getApp().globalData.headers["X-USER-EMAIL"],
        "X-USER-TOKEN": getApp().globalData.headers["X-USER-TOKEN"]
      },
      success(res) {
        console.log(res)
        const favorites = res.data.favorites
        page.setData({
          favorites
        })
      }
    })
  },

  happyReviewHandler(e) {
    const page = this;
    page.setData({ happy: true, comment: "" })
  },
  
  unhappyReviewHandler(e) {
    const page = this;
    page.setData({ happy: false, comment: "" })
  },

  commentHandler(e) {
    const page = this;
    page.setData({ comment: e.target.dataset.comment })
  },

  submitHandler() {
    const page = this;

    console.log("SUBMIT REVIEW")
    
    const user_id = page.data.user_id
    const toilet_id = page.data.toilet_id
    const happy = page.data.happy
    const comment = page.data.comment
    
    if ( happy != null ) {
      console.log("READY TO SUBMIT")
      wx.request({
        url: `${url}/toilets/${toilet_id}/reviews`,
        method: 'POST',
        header: {
          "X-USER-EMAIL": app.globalData.headers["X-USER-EMAIL"],
          "X-USER-TOKEN": app.globalData.headers["X-USER-TOKEN"]
        },
        data: { user_id, toilet_id, happy, comment},
        success(res) {
          console.log(res)
          wx.showToast({
            title: 'Thanks',
            icon: 'success',
            duration: 2000,
            success(res) {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/toilets/index',
                })        
              }, 1000)
            }
          })
        } 
      })
    }
  },

  cancelHandler() {
    wx.showToast({
      title: 'No worries...',
      icon: 'success',
      duration: 2000,
      success(res) {
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/toilets/index',
          })        
        }, 1000)
      }
    })
  },

  addFavoriteHandler() {
    console.log("ADD TO FAVORITES")
    const page = this;
    const user_id = page.data.user_id
    const toilet_id = page.data.toilet_id
    
    let isFavorite = page.data.isFavorite
    if ( isFavorite === true ) {
      // isFavorite = false
      // page.setData({ isFavorite: false })
      // DELETE /favorites (favorite_id)
    } else {
      wx.request({
        url: `${url}/users/${user_id}/favorites/`,
        method: 'POST',
        header: {
          "X-USER-EMAIL": app.globalData.headers["X-USER-EMAIL"],
          "X-USER-TOKEN": app.globalData.headers["X-USER-TOKEN"]
        },
        data: { toilet_id },
        success(res) {
          console.log("TOILET SAVED")
          console.log(res)
          page.setData({ isFavorite: true })
          wx.showToast({
            title: 'Saved',
            icon: 'success',
            duration: 1000,
          })
        } 
      })

      // POST /favorites   (user_id, toilet_id)
    }
    // page.setData({ isFavorite })
  },
  
  onLoad: function (options) {
    const page = this;
    page.getFavorites()
    console.log(options)
    
    const user_id = app.globalData.user.id
    const toilet_id = options.toilet_id

    let isFavorite = options.is_favorite
    if ( isFavorite === "true" ) {
      isFavorite = true
    } else {
      isFavorite = false
    }

    page.setData({ user_id, toilet_id, isFavorite })


    if (isFavorite) {
      const favorite_id = page.data.favorites.find((item) => item.toilet_id == toilet_id).id
      page.setData({
        favorite_id
      })
    }

    // find the id of the favorite 
    // const env = app.globalData.env
    // const url = app.globalData.url[env]
    
    // wx.request({
    //   url: `${url}/users/${user_id}`,
    //   method: 'GET',
    //   header: {
    //     "X-USER-EMAIL": getApp().globalData.headers["X-USER-EMAIL"],
    //     "X-USER-TOKEN": getApp().globalData.headers["X-USER-TOKEN"]
    //   },
    //   success(res) {
    //     console.log(res)
    //     const favorite_id = res.data.favorites.find((item) => item.toilet_id == toilet_id).id
    //     // console.log(favorites[1].toilet_id == toilet_id)
    //     // console.log(favorite_id)
    //     page.setData({
    //       favorite_id
    //     })
    //   }
    // })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})