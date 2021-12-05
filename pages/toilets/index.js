// pages/toilets/index.js
const app = getApp();


Page({

  /**
   * Page initial data
   */
  data: {
    
  },

  startNavigation() {
    const page = this;
    wx.openLocation({
      latitude: page.data.currentToilet.latitude,
      longitude: page.data.currentToilet.longitude,
      scale: 18
    })
  },

  calculateDistance (lat1, lat2, lon1, lon2) {

    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
  
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2),2);
  
    let c = 2 * Math.asin(Math.sqrt(a));
    let r = 6371;
  
    return(c * r * 1000);
  },

  setDistanceDisplay(currentToilet) {
    const page = this;
    const distance = page.calculateDistance(page.data.latitude, currentToilet.latitude, page.data.longitude, currentToilet.longitude)
    const distanceDisplay = distance < 1000
          ? `${Math.floor(distance)} m`
          : `${Math.floor(distance/100) / 10} km`
    page.setData({ currentToilet: {
      ...currentToilet,
      distanceDisplay
    } })
  },

  moveToLocation: function () {
    const page = this;
    app.globalData.mapCtx.moveToLocation()
      .then((res) => {
        // console.log(res)
        page.getToilets(true)
        // const currentToilet = page.data.nearest
        // this.setDistanceDisplay()
        // this.setDistanceDisplay(currentToilet)
      })
    // const distanceDisplay = currentToilet.distance < 1000
    //   ? `${Math.floor(currentToilet.distance)} m`
    //   : `${Math.floor(currentToilet.distance/100) / 10} km`
    // page.setData({ 
    //   currentToilet: {
    //     ...currentToilet,
    //     distanceDisplay
    //   } 
    // })
        
  },

  getToilets(setNearest = false) {
    const page = this;
    wx.request({
      url: `https://wepoop.wogengapp.cn/api/v1/toilets?latitude=${page.data.latitude}&longitude=${page.data.longitude}&ne_latitude=${page.data.ne_latitude}&ne_longitude=${page.data.ne_longitude}&sw_latitude=${page.data.sw_latitude}&sw_longitude=${page.data.sw_longitude}`,
      // url: `http://localhost:3000/api/v1/toilets?latitude=${page.data.latitude}&longitude=${page.data.longitude}&ne_latitude=${page.data.ne_latitude}&ne_longitude=${page.data.ne_longitude}&sw_latitude=${page.data.sw_latitude}&sw_longitude=${page.data.sw_longitude}`,
      method: 'GET',
      header: {
        "X-USER-EMAIL": app.globalData.headers["X-USER-EMAIL"],
        "X-USER-TOKEN": app.globalData.headers["X-USER-TOKEN"]
      },
      success(res) {
        // console.log(res)
        const toilets = res.data.toilets
        const nearest = res.data.nearest
        // page.setDistanceDisplay(currentToilet)
        if (setNearest) {
          const currentToilet = page.data.nearest
          page.setData({ toilets, nearest, currentToilet })
          page.setDistanceDisplay(currentToilet)
        } else {
          page.setData({ toilets, nearest })

        }
        // const currentToilet = toilets[0]
        // const distanceDisplay = currentToilet.distance < 1000
        //   ? `${Math.floor(currentToilet.distance)} m`
        //   : `${Math.floor(currentToilet.distance/100) / 10} km`
        // page.setData({ 
        //   currentToilet: {
        //     ...currentToilet,
        //     distanceDisplay
        //   } 
        // })
      }
    })
  },

  markerTapHandler(e) {
    const page = this;
    const toiletMarkerId = e.detail.markerId
    const currentToilet = page.data.toilets.find((toilet) => {
      return toilet.id === toiletMarkerId
    })
    // console.log(currentToilet)
    this.setDistanceDisplay(currentToilet)
    // const distanceDisplay = currentToilet.distance < 1000
    //       ? `${Math.floor(currentToilet.distance)} m`
    //       : `${Math.floor(currentToilet.distance/100) / 10} km`
    // page.setData({ currentToilet: {
    //   ...currentToilet,
    //   distanceDisplay
    // } })

    const distance = this.calculateDistance(page.data.latitude, currentToilet.latitude, page.data.longitude, currentToilet.longitude)
    console.log(distance*1000)
  },

  
  regionChangeHandler(e) { 
    const page = this;
    console.log(e)
    if (e.type === 'end') {
      // update boundary coordinates
      const ne_latitude = e.detail.region.northeast.latitude 
      const ne_longitude = e.detail.region.northeast.longitude 
      const sw_latitude = e.detail.region.southwest.latitude 
      const sw_longitude = e.detail.region.southwest.longitude
      page.setData({ ne_latitude, ne_longitude, sw_latitude, sw_longitude }) 
      page.getToilets()
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const page = this;
    app.globalData.mapCtx = wx.createMapContext('myMap')
    app.globalData.mapCtx.moveToLocation()
      .then((res) => {
        // console.log(res)
        setTimeout(() => {
          app.globalData.mapCtx.getCenterLocation()
            .then((res) => {
              // console.log(res)
              const latitude = res.latitude
              const longitude = res.longitude
              page.setData({ latitude, longitude })
              setTimeout(() => {
                app.globalData.mapCtx.getRegion()
                  .then((res) => {
                    // console.log(res)
                    const ne_latitude = res.northeast.latitude 
                    const ne_longitude = res.northeast.longitude 
                    const sw_latitude = res.southwest.latitude 
                    const sw_longitude = res.southwest.longitude
                    page.setData({ ne_latitude, ne_longitude, sw_latitude, sw_longitude})
                    page.getToilets(true)
                  })
              }, 0)
            })
        }, 500)
      })
      
    // app.globalData.mapCtx.getRegion().then((res) => {console.log(res)})
    // app.globalData.mapCtx.moveToLocation();
    // page.setData({ toilets })
    // .then((res) => {console.log(res)} )
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
    app.globalData.mapCtx = wx.createMapContext('myMap')
    app.globalData.mapCtx.moveToLocation()
      .then((res) => {
        // console.log(res)
        setTimeout(() => {
          app.globalData.mapCtx.getCenterLocation()
            .then((res) => {
              // console.log(res)
              const latitude = res.latitude
              const longitude = res.longitude
              page.setData({ latitude, longitude })
              setTimeout(() => {
                app.globalData.mapCtx.getRegion()
                  .then((res) => {
                    // console.log(res)
                    const ne_latitude = res.northeast.latitude 
                    const ne_longitude = res.northeast.longitude 
                    const sw_latitude = res.southwest.latitude 
                    const sw_longitude = res.southwest.longitude
                    page.setData({ ne_latitude, ne_longitude, sw_latitude, sw_longitude})
                    page.getToilets(true)
                  })
              }, 0)
            })
        }, 500)
      })
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



// getCurrentLocation() {
//   wx.getLocation({
//     success(res) {
//       const latitude = res.latitude;
//       const longitude = res.longitude;
//       return { latitude, longitude }
//     }
//     })
// },


