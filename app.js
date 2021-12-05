// app.js
App({
  onLaunch() {
    const app = this

    wx.login({
      timeout: 10000,
      success(res) {
        const env = app.globalData.env
        const url = app.globalData.url[env]
        wx.request({
          url: `${url}/login`,
          method: 'POST',
          data: {
            'code': res.code,
          },
          success(res) {
            // console.log(res)
            app.globalData.user = res.data.user
            app.globalData.headers = res.data.headers
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/toilets/index',
              })
            }, 2000)
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null,
    env: 'production',
    url: {
      development: 'http://localhost:3000/api/v1',
      production: 'https://wepoop.wogengapp.cn/api/v1'
    } 
  }
})
