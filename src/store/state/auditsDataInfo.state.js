export default {
  state: {
    dataList: []
  },
  mutations: {
    setAuditsListInfo(state, auditsListInfo) {
      state.dataList.push(auditsListInfo)
    },
    cleanAuditsListInfo(state) {
      state.dataList.length = 0
    }
  }
}
