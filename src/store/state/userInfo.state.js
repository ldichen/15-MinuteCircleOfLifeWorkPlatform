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
      console.log(state.dataList)
    },
    cleanUserListInfo(state) {
      state.dataList.length = 0
    }
  }
}
