// pages/add/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    // latitude: 31.22478,
    // longitude: 121.44526,
    toilets: [
      {
        latitude: 31.22478,
        longitude: 121.44526,
      }
    ]
  },

  moveToLocation: function () {
    const page = this;
    page.data.mapCtx.moveToLocation({
      success(res) {
        console.log(res)
        // {errMsg: "moveToMapLocation:ok"}
        page.data.mapCtx.getCenterLocation({
          success(res) {
            console.log(res)
            // {errMsg: "getMapCenterLocation:ok", latitude: 31.18826000000001, longitude: 121.43687}
          }
        })
        page.data.mapCtx.getRegion({
          success(res) {
            console.log(res)
            // {errMsg: "getMapCenterLocation:ok", latitude: 31.18826000000001, longitude: 121.43687}
          }
        })
      }
    })
        
  },

  setUserLocation() {
    const page = this;
    wx.getLocation({
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        const toilets = [{ latitude, longitude }]
        page.setData({ latitude, longitude })
        page.setData({ toilets })
      }
     })
  },

  regionChangeHandler(e) { 
    const page = this;
    if (e.type === 'end') {
      // console.log(e.detail)
      const page = this; 
      const latitude = e.detail.centerLocation.latitude
      const longitude = e.detail.centerLocation.longitude
      console.log(latitude, longitude)
      const toilets = [{ latitude, longitude }]
      page.setData({ toilets })
      
    }
    // *************** TODO ***************
    // console.log(e.detail.region)
  },

  submitHandler(e) {
    const page = this;
    console.log("Going to submit")
    // console.log(e)

    const description = e.detail.value.description
    const directions = e.detail.value.directions
    if ( description && directions ) {
      wx.request({
        url: `https://wepoop.wogengapp.cn/api/v1/toilets`,
        // url: `http://localhost:3000/api/v1/toilets`,
        method: 'POST',
        header: {
          "X-USER-EMAIL": app.globalData.headers["X-USER-EMAIL"],
          "X-USER-TOKEN": app.globalData.headers["X-USER-TOKEN"]
        },
        data: {
          user_id: getApp().globalData.user.id,
          latitude: page.data.toilets[0].latitude,
          longitude: page.data.toilets[0].longitude,
          description: description,
          // male: true,
          // female: true,
          directions: directions,
          // changing_station: false,
          // accessibility: false,
          // address: "999 Some Rd., Some District, Shanghai"
        },
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
          // setTimeout(() => {
          //   wx.redirectTo({
          //     url: '/pages/toilets/index',
          //   })        
          // }, 1000)
        } 
      })
    } else {
      console.log("Incomplete")
      wx.showToast({
        title: 'Incomplete',
        icon: 'error',
        duration: 2000,
      })
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setUserLocation()
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
    const page = this;
    const mapCtx = wx.createMapContext('addMap');
    mapCtx.moveToLocation();
    page.setData({ mapCtx })
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