// components/bottomnav.js
const app = getApp();

Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    currentPage: app.globalData.currentPage
  },

  /**
   * Component methods
   */
  methods: {
    findBtnHandler() {
      this.setData({ currentPage: 0})
      app.globalData.currentPage = this.data.currentPage
      console.log(app.globalData.currentPage)
      console.log("FIND TOILETS")
      wx.redirectTo({
        url: '/pages/toilets/index',
      })
    },
    
    userBtnHandler() {
      this.setData({ currentPage: 1})
      app.globalData.currentPage = this.data.currentPage
      console.log(app.globalData.currentPage)
      console.log("USER PAGE")
      wx.redirectTo({
        url: '/pages/user/index',
      })
    },
    
    addBtnHandler() {
      const component = this;
      this.setData({ currentPage: 2})
      app.globalData.currentPage = this.data.currentPage
      console.log(app.globalData.currentPage)
      console.log("ADD TOILET")
      wx.redirectTo({
        url: '/pages/add/index',
      })
    }
  }
})
