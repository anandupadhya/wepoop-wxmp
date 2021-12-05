// pages/toilets/index.js
const app = getApp();


Page({

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
  
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2),2);
  
    const c = 2 * Math.asin(Math.sqrt(a));
    const r = 6371;
  
    return (c * r * 1000);
  },

  setDistanceDisplay(currentToilet) {
    const page = this;

    // user's current location
    const lat1 = page.data.latitude;
    const lon1 = page.data.longitude;

    // location of the toilet chosen
    const lat2 = currentToilet.latitude;
    const lon2 = currentToilet.longitude;

    // calculate distance
    const distance = page.calculateDistance(lat1, lat2, lon1, lon2)

    // format the display text to accomodate m or km units
    const distanceDisplay = distance < 1000
          ? `${Math.floor(distance)} m`
          : `${Math.floor(distance/100) / 10} km`
    page.setData({ currentToilet: { ...currentToilet, distanceDisplay } })
  },

  moveToLocation: function () {
    const page = this;
    const mapCtx = app.globalData.mapCtx;
    mapCtx.moveToLocation()
      .then((res) => {
        page.getToilets(true)
      }) 
  },

  // if setNearest is set to true then the nearset currentToilet will be set to the nearest toilet returned from API
  // only to be used by moveToLocation function
  getToilets(setNearest = false) {
    const page = this;

    // get current user location and map boundary stored in page data
    const latitude = page.data.latitude
    const longitude = page.data.longitude
    const ne_latitude = page.data.ne_latitude; 
    const ne_longitude = page.data.ne_longitude;
    const sw_latitude = page.data.sw_latitude 
    const sw_longitude = page.data.sw_longitude


    // fetch new results from backend server
    const env = app.globalData.env
    const url = app.globalData.url[env]
    wx.request({
      url: `${url}/toilets?latitude=${latitude}&longitude=${longitude}&ne_latitude=${ne_latitude}&ne_longitude=${ne_longitude}&sw_latitude=${sw_latitude}&sw_longitude=${sw_longitude}`,
      method: 'GET',
      header: {
        "X-USER-EMAIL": app.globalData.headers["X-USER-EMAIL"],
        "X-USER-TOKEN": app.globalData.headers["X-USER-TOKEN"]
      },
      success(res) {
        const toilets = res.data.toilets.map((toilet) => {
          return { ...toilet, width: '25', height: '35' }
        })
        const nearest = res.data.nearest

        if (setNearest) {
          const currentToilet = page.data.nearest
          page.setData({ toilets, nearest, currentToilet })
          page.setDistanceDisplay(currentToilet)
        } else {
          page.setData({ toilets, nearest })

        }
      }
    })
  },

  markerTapHandler(e) {
    const page = this;

    // get id of the toilet that the user clicked
    const toiletMarkerId = e.detail.markerId

    // find that toilet in the page data
    const currentToilet = page.data.toilets.find((toilet) => toilet.id === toiletMarkerId )

    // update the distance display text
    this.setDistanceDisplay(currentToilet)
  },

  
  regionChangeHandler(e) { 
    const page = this;

    // only react when the map drag or update ends
    if (e.type === 'end') {
      // update boundary coordinates in the page data
      const ne_latitude = e.detail.region.northeast.latitude 
      const ne_longitude = e.detail.region.northeast.longitude 
      const sw_latitude = e.detail.region.southwest.latitude 
      const sw_longitude = e.detail.region.southwest.longitude
      page.setData({ ne_latitude, ne_longitude, sw_latitude, sw_longitude }) 
      page.getToilets()
    }
  },

  onLoad: function (options) {
    console.log("LOAD")
    const page = this;
    // find the map element in the wxml and create a mapCtx to be saved in globalData
    const mapCtx = wx.createMapContext('myMap');
    app.globalData.mapCtx = mapCtx

    wx.getLocation({
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        page.setData({ latitude, longitude })
        mapCtx.getRegion()
          .then((res) => {
            const ne_latitude = res.northeast.latitude 
            const ne_longitude = res.northeast.longitude 
            const sw_latitude = res.southwest.latitude 
            const sw_longitude = res.southwest.longitude
            page.setData({ ne_latitude, ne_longitude, sw_latitude, sw_longitude})
            page.getToilets(true)
          })
      }
    })
    
  },

  onReady: function () {

  },

  onShow: function () {
    
  },

  onHide: function () {
    console.log("HIDE")
  },

  onUnload: function () {
    console.log("UNLOAD")
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})














// getCenterLocation: function () {
//   const page = this;
//   app.globalData.mapCtx.getCenterLocation({
//     success(res) {
//       console.log(res.longitude)
//       console.log(res.latitude)
//     }
//   })
// },


// getCurrentLocation() {
//   wx.getLocation({
//     success(res) {
//       const latitude = res.latitude;
//       const longitude = res.longitude;
//       return { latitude, longitude }
//     }
//     })
// },


