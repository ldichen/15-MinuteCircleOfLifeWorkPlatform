export default {
  state: {
    dataList: []
  },
  mutations: {
    setComListInfo(state, comListInfo) {
      comListInfo.forEach((item) => {
        state.dataList.push(item)
      })
    },
    cleanComListInfo(state) {
      state.dataList.length = 0
    }
  }
}
