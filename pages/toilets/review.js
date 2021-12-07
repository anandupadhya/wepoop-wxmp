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
  
  onLoad: function (options) {
    const page = this;
    
    const user_id = getApp().globalData.user.id
    page.setData({ user_id })

    const toilet_id = options.toilet_id
    page.setData({ toilet_id })
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