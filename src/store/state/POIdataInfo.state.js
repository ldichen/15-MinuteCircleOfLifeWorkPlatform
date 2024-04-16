export default {
  state: {
    dataList: []
  },
  mutations: {
    setPoiListInfo(state, poiListInfo) {
      poiListInfo.forEach((item) => {
        state.dataList.push(item)
      })
    },
    cleanPoiListInfo(state) {
      state.dataList.length = 0
    }
  }
}
