export default {
  state: {
    dataList: []
  },
  mutations: {
    setCaptureListInfo(state, captureListInfo) {
      captureListInfo.forEach((item) => {
        state.dataList.push(item)
      })
    },
    cleanCaptureListInfo(state) {
      state.dataList.length = 0
    }
  }
}
