// components/bottomnav.js
const app = getApp();

Component({
  /**
   * Component properties
   */
  properties: {
    currentPage: {
      type: Number, value: 0
    }
  },

  /**
   * Component initial data
   */
  data: {
    
  },

  /**
   * Component methods
   */
  methods: {
    findBtnHandler() {
      // this.setData({ currentPage: 0})
      // app.globalData.currentPage = this.data.currentPage
      // console.log(app.globalData.currentPage)
      console.log(this.data.currentPage === 0)
      console.log("FIND TOILETS")
      if (this.data.currentPage !== 0) {
        wx.redirectTo({
          url: '/pages/toilets/index',
        })
      }
    },
    
    userBtnHandler() {
      // this.setData({ currentPage: 1})
      // app.globalData.currentPage = this.data.currentPage
      // console.log(app.globalData.currentPage)
      console.log(this.data.currentPage)
      console.log("USER PAGE")
      wx.redirectTo({
        url: '/pages/user/index',
      })
    },
    
    addBtnHandler() {
      // const component = this;
      // this.setData({ currentPage: 2})
      // app.globalData.currentPage = this.data.currentPage
      // console.log(app.globalData.currentPage)
      console.log(this.data.currentPage)
      console.log("ADD TOILET")
      if (this.data.currentPage !== 2) {
        wx.redirectTo({
          url: '/pages/add/index',
        })
      }
    }
  }
})
