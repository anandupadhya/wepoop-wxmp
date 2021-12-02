// pages/toilets/index.js
const app = getApp();
const userLocation = app.globalData.userLocation;
const toilets = app.globalData.toilets;

Page({

  /**
   * Page initial data
   */
  data: {
    
  },

  getCurrentLocation() {
    wx.getLocation({
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        return { latitude, longitude }
      }
     })
  },
  
  moveToLocation: function () {
    const page = this;
    app.globalData.mapCtx.moveToLocation({
      success(res) {
        console.log(res)
      }
    })
        
  },

  getToilets(latitude, longitude) {
    const page = this;
    wx.request({
      url: `https://wepoop.wogengapp.cn/api/v1/toilets?latitude=${latitude}&longitude=${longitude}`,
      // url: `http://localhost:3000/api/v1/toilets?latitude=${latitude}&longitude=${longitude}`,
      method: 'GET',
      header: {
        "X-USER-EMAIL": app.globalData.headers["X-USER-EMAIL"],
        "X-USER-TOKEN": app.globalData.headers["X-USER-TOKEN"]
      },
      success(res) {
        const toilets = res.data.toilets
        page.setData({ toilets })
        const currentToilet = toilets[0]
        const distanceDisplay = currentToilet.distance < 1000
          ? `${Math.floor(currentToilet.distance)} m`
          : `${Math.floor(currentToilet.distance/100) / 10} km`
        page.setData({ currentToilet: {
          ...currentToilet,
          distanceDisplay
        } })

        
      }
    })
  },

  markerTapHandler(e) {
    const page = this;
    const toiletMarkerId = e.detail.markerId
    const currentToilet = page.data.toilets.find((toilet) => {
      console.log(toilet.id)
      console.log(toiletMarkerId)
      return toilet.id === toiletMarkerId
    })
    const distanceDisplay = currentToilet.distance < 1000
          ? `${Math.floor(currentToilet.distance)} m`
          : `${Math.floor(currentToilet.distance/100) / 10} km`
    page.setData({ currentToilet: {
      ...currentToilet,
      distanceDisplay
    } })
    // *************** TODO ***************
    // somehow highlight the marker tapped and also pan it to the center location on the map
    // *************** TODO ***************
  },

  regionChangeHandler(e) { 
    if (e.type === 'end') {
      console.log(e.detail)
      console.log((e.detail.region.northeast.latitude - e.detail.region.southwest.latitude)/4)
      const page = this; 
      const latitude = e.detail.centerLocation.latitude
      const longitude = e.detail.centerLocation.longitude
      console.log(latitude, longitude)
      if ( latitude !== 0 && longitude !== 0){
        this.getToilets(latitude, longitude)
      }
    }
    // *************** TODO ***************
    // console.log(e.detail.region)
  },





  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const page = this;
    app.globalData.mapCtx = wx.createMapContext('myMap');
    app.globalData.mapCtx.moveToLocation();
    page.setData({ toilets })
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
    const currentToilet = page.data.toilets[0]
    const distanceDisplay = currentToilet.distance < 1000
          ? `${Math.floor(currentToilet.distance)} m`
          : `${Math.floor(currentToilet.distance/100) / 10} km`
        page.setData({ currentToilet: {
          ...currentToilet,
          distanceDisplay
        } })
    page.setData({ currentToilet })




    

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
    console.log("TOILETS/INDEX UNLOADED!!!!!")
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


// set map to include the toilets loaded from api
// app.globalData.mapCtx.includePoints({
//   padding: [50],
//   points: page.data.toilets
// })

// getCenterLocation: function () {
//   const page = this;
//   app.globalData.mapCtx.getCenterLocation({
//     success(res) {
//       console.log(res.longitude)
//       console.log(res.latitude)
//     }
//   })
// },


// get user's current location, store in globalData, and move the map



// moveToLocation: function () {
//   const page = this;
//   app.globalData.mapCtx.moveToLocation();
// },

    // wx.showLoading({ title: "Loading..."});