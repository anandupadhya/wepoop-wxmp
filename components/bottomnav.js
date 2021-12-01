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

  },

  /**
   * Component methods
   */
  methods: {
    moveToLocation: function () {
      app.globalData.mapCtx.moveToLocation();
    },
  }
})
