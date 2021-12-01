// app.js
App({
  onLaunch() {
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.getLocation({
      success: res =>{
        this.globalData.userLocation.latitude = res.latitude
        this.globalData.userLocation.longitude = res.longitude
        // this.globalData.userLocation.latitude = 31.2247847
        // this.globalData.userLocation.longitude = 121.4452639
        console.log("Initial user location")
        console.log(this.globalData.userLocation)
        wx.login({
          success: res => {
            // console.log(res)
            wx.request({
              url: 'https://wepoop.wogengapp.cn/api/v1/login',
              // url: 'https://wepoop.wogengapp.cn/api/v1/manual_login',
              // url: 'http://localhost:3000/api/v1/login',
              method: 'POST',
              data: {
                'code': res.code,
              },
              success(res) {
                // console.log(res)
                getApp().globalData.headers = res.data.headers
                // console.log("Headers set in globalData")
                // console.log(getApp().globalData.headers)
                const latitude = getApp().globalData.userLocation.latitude
                const longitude = getApp().globalData.userLocation.longitude
                // get first toilet locations to show users
                wx.request({
                  url: `https://wepoop.wogengapp.cn//api/v1/toilets?latitude=${latitude}&longitude=${longitude}`,
                  method: 'GET',
                  header: {
                    "X-USER-EMAIL": getApp().globalData.headers["X-USER-EMAIL"],
                    "X-USER-TOKEN": getApp().globalData.headers["X-USER-TOKEN"]
                  },
                  success(res) {
                    // console.log(res)
                    res.data.toilets.forEach((toilet) => {
                      getApp().globalData.toilets.push(toilet)
                    })
                    wx.redirectTo({
                      url: '/pages/toilets/index',
                    })
                  }
                })


                // setTimeout(() => {
                //   wx.redirectTo({
                //     url: '/pages/toilets/index',
                //   })
                // }, 3000)
                
              }
            })
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
          }
        })
      }
     })
    
    // wx.login({
    //   success: res => {
    //     // console.log(res)
    //     wx.request({
    //       url: 'https://wepoop.wogengapp.cn/api/v1/login',
    //       // url: 'https://wepoop.wogengapp.cn/api/v1/manual_login',
    //       // url: 'http://localhost:3000/api/v1/login',
    //       method: 'POST',
    //       data: {
    //         'code': res.code,
    //       },
    //       success(res) {
    //         console.log(res)
    //         getApp().globalData.headers = res.data.headers
    //         console.log("Headers set in globalData")
    //         console.log(getApp().globalData.headers)
    //         setTimeout(() => {
    //           wx.redirectTo({
    //             url: '/pages/toilets/index',
    //           })
    //         }, 2000)
            
    //       }
    //     })
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })

    //get user current location on app launch and store in globalData
    
  },
  globalData: {
    userInfo: null,
    userLocation: {},
    toilets: []
  }
})
