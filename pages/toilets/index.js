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

  getToilets(latitude, longitude) {
    const page = this;
    wx.request({
      url: `https://wepoop.wogengapp.cn//api/v1/toilets?latitude=${latitude}&longitude=${longitude}`,
      method: 'GET',
      header: {
        "X-USER-EMAIL": app.globalData.headers["X-USER-EMAIL"],
        "X-USER-TOKEN": app.globalData.headers["X-USER-TOKEN"]
      },
      success(res) {
        console.log(res)
        page.setData({ toilets: res.data.toilets })
        const currentToilet = res.data.toilets[0]
        page.setData({ currentToilet })

        // set map to include the toilets loaded from api
        // app.globalData.mapCtx.includePoints({
        //   padding: [50],
        //   points: page.data.toilets
        // })
      }
    })
  },

  mapTapHandler(e) {
    // console.log("Map tapped")
    // console.log(e)
  },

  markerTapHandler(e) {
    const page = this;
    console.log("Marker tapped")
    const toiletMarkerId = e.detail.markerId
    //use the marker id to find the toilet and put the object in the currentToilet
    const currentToilet = page.data.toilets.find((toilet) => {
      console.log(toilet.id)
      console.log(toiletMarkerId)
      return toilet.id === toiletMarkerId
    })
    console.log(currentToilet)
    page.setData({ currentToilet })
    // *************** TODO ***************
    // use the marker ID to display the toilet info in the display box 
    // toilet data is stored in the page data and globalData
    // *************** TODO ***************
    
  },

  regionChangeHandler(e) {

    // *************** TODO ***************
    // request toilets from the api again with centerLocation
    const page = this; 
    const latitude = e.detail.centerLocation.latitude
    const longitude = e.detail.centerLocation.longitude
    if ( latitude !== 0 && longitude !== 0){
      this.getToilets(latitude, longitude)
    }
    
    // *************** TODO ***************
    // console.log(e.detail.region)
  },

  // getCenterLocation: function () {
  //   const page = this;
  //   app.globalData.mapCtx.getCenterLocation({
  //     success(res) {
  //       console.log(res.longitude)
  //       console.log(res.latitude)
  //     }
  //   })
  // },

  // moveToLocation: function () {
  //   const page = this;
  //   app.globalData.mapCtx.moveToLocation();
  // },

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
    const currentToilet = toilets[0]
    console.log("asdfasdfasdfasdasdfasdf")
    console.log(currentToilet)
    page.setData({ currentToilet })

    // get user's current location, store in globalData, and move the map
    // wx.getLocation({
    //   success: res =>{
    //     userLocation.latitude = res.latitude
    //     userLocation.longitude = res.longitude
    //     app.globalData.mapCtx.moveToLocation();
    //   }
    //  })

    // wx.showLoading({ title: "Loading..."});
    
    // this.getToilets(999, 999)
    // page.setData({ toilets })
    // set current toile to be the first toilet in the list

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