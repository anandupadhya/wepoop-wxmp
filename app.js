// app.js
import event from './utils/event.js';
wx.event = event;

App({
  onLaunch() {
    const app = this

    wx.login({
      timeout: 5000,
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
            getApp().globalData.user = res.data.user
            getApp().globalData.headers = res.data.headers
            wx.event.emit('userReady')
            // setTimeout(() => {
              wx.redirectTo({
                url: '/pages/toilets/index',
              })
            // }, 2000)
          }
        })
      }
    })
  },

  globalData: {
    user: null,
    headers: null,
    toilets: [],
    env: 'production',
    url: {
      development: 'http://localhost:3000/api/v1',
      production: 'https://wepoop.wogengapp.cn/api/v1'
    }
  }
})
