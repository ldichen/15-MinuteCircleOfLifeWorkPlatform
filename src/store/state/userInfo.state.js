export default {
  state: {
    dataList: []
  },
  mutations: {
    setUserListInfo(state, userListInfo) {
      state.dataList.push(userListInfo)
      // userListInfo.forEach((item) => {
      //   state.dataList.push(item)
      // })
    },
    cleanUserListInfo(state) {
      state.dataList.length = 0
    }
  }
}
