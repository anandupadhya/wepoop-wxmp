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
      scale: 18,
      name: page.data.currentToilet.description,
      complete(res) {
        wx.redirectTo({
          url: `/pages/toilets/review?toilet_id=${page.data.currentToilet.id}`,
        })
      }
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

    // user's current location
    const lat1 = page.data.latitude;
    const lon1 = page.data.longitude;

    // location of the toilet chosen
    const lat2 = currentToilet.latitude;
    const lon2 = currentToilet.longitude;

    // calculate distance
    const distance = page.calculateDistance(lat1, lat2, lon1, lon2)
    // const distance = page.calculateDistance(page.data.latitude, currentToilet.latitude, page.data.longitude, currentToilet.longitude)
    const distanceDisplay = distance < 1000
          ? `${Math.floor(distance)} m`
          : `${Math.floor(distance/100) / 10} km`
    page.setData({ currentToilet: { ...currentToilet, distanceDisplay } })
  },

  async moveToLocation () {
    const page = this;
    const movedRes = await app.globalData.mapCtx.moveToLocation()
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(movedRes)
      }, 500)
    })
    // app.globalData.mapCtx.moveToLocation()
    //   .then((res) => {
    //     page.getToilets(true)
    //   })   
  },

  getToilets(setNearest = true) {
    console.log('getToilets')
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
        
        function formatToiletData(toilet) {
          // const happy = Math.floor(Math.random() * 50) + 50
          // const unhappy = 100 - happy
          const callout = {
            content: `${toilet.description}`,
            fontSize: 16,
            borderRadius: 4,
            padding: 8,
          }
          return { ...toilet, width: 48, height: 48, iconPath: '/images/marker2.png', callout, }
        };
        
        const toilets = res.data.toilets.map((toilet) => {
          return formatToiletData(toilet)
        })

        const nearest = formatToiletData(res.data.nearest)

        if (setNearest) {
          const currentToilet = nearest
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
    const toiletMarkerId = e.detail.markerId
    const currentToilet = page.data.toilets.find((toilet) => toilet.id === toiletMarkerId)
    page.setDistanceDisplay(currentToilet)
  },

  regionChangeHandler(e) { 
    const page = this;
    
    if (e.type === 'end' && e.causedBy === 'drag') {
      console.log(e)
      const ne_latitude = e.detail.region.northeast.latitude 
      const ne_longitude = e.detail.region.northeast.longitude 
      const sw_latitude = e.detail.region.southwest.latitude 
      const sw_longitude = e.detail.region.southwest.longitude
      page.setData({ ne_latitude, ne_longitude, sw_latitude, sw_longitude }) 
      page.getToilets(false)
    }
  },

  onLoad: function (options) {
    app.globalData.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
//  async getUserLocation() {
//     const page = this;
//     const app = getApp()
    // app.globalData.mapCtx = wx.createMapContext('myMap')
    // const moveToLocation = await app.globalData.mapCtx.moveToLocation()
    // console.log({moveToLocation})
    // app.globalData.mapCtx.moveToLocation().then(res => console.log(111, res))
    // if (moveToLocation.errMsg == 'moveToMapLocation:ok') {
    //   console.log(888)
      // const coordinates = await app.globalData.mapCtx.getCenterLocation()
      // const region = await app.globalData.mapCtx.getRegion()
      // page.setData({
      //   latitude: coordinates.latitude,
      //   longitude: coordinates.longitude,
      //   ne_latitude: region.northeast.latitude ,
      //   ne_longitude: region.northeast.longitude ,
      //   sw_latitude: region.southwest.latitude, 
      //   sw_longitude: region.southwest.longitude
      // })
    // }
  // },

  async moveMap() {
    const app = getApp()
    const page = this;
    const movedRes = await page.moveToLocation()

    if (movedRes.errMsg === 'moveToMapLocation:ok') {
      const centerLocation = await app.globalData.mapCtx.getCenterLocation()
      const region = await app.globalData.mapCtx.getRegion()
      console.log({ centerLocation, region })
      // return new Promise ((resolve, reject) => {
      //   resolve({ centerLocation, region })
      // })
      // setData here
      page.setData({
        latitude: centerLocation.latitude,
        longitude: centerLocation.longitude,
        ne_latitude: region.northeast.latitude ,
        ne_longitude: region.northeast.longitude ,
        sw_latitude: region.southwest.latitude, 
        sw_longitude: region.southwest.longitude
      })
      page.getToilets()
    }

    

  },

  onShow: function () {
    const page = this;
    console.log("SHOW")
    const appData = getApp().globalData

    if (appData.user) {
      page.moveMap()
    } else {
      console.log('inside userReady else callback')
      wx.event.on('userReady', this, moveMap)
    }

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













// getCurrentLocation() {
//   wx.getLocation({
//     success(res) {
//       const latitude = res.latitude;
//       const longitude = res.longitude;
//       return { latitude, longitude }
//     }
//     })
// },



// onLoad
// const page = this;
    // console.log("LOAD")
    // app.globalData.mapCtx = wx.createMapContext('myMap')
    // app.globalData.mapCtx.moveToLocation()
    //   .then((res) => {
    //     // console.log(res)
    //     setTimeout(() => {
    //       app.globalData.mapCtx.getCenterLocation()
    //         .then((res) => {
    //           // console.log(res)
    //           const latitude = res.latitude
    //           const longitude = res.longitude
    //           page.setData({ latitude, longitude })
    //           setTimeout(() => {
    //             app.globalData.mapCtx.getRegion()
    //               .then((res) => {
    //                 // console.log(res)
    //                 const ne_latitude = res.northeast.latitude 
    //                 const ne_longitude = res.northeast.longitude 
    //                 const sw_latitude = res.southwest.latitude 
    //                 const sw_longitude = res.southwest.longitude
    //                 page.setData({ ne_latitude, ne_longitude, sw_latitude, sw_longitude})
    //                 page.getToilets(true)
    //               })
    //           }, 0)
    //         })
    //     }, 500)
    //   })
      
    // app.globalData.mapCtx.getRegion().then((res) => {console.log(res)})
    // app.globalData.mapCtx.moveToLocation();
    // page.setData({ toilets })
    // .then((res) => {console.log(res)} )


    