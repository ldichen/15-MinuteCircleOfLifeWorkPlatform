/*
 * @Author: DiChen
 * @Date: 2024-06-18 15:11:47
 * @LastEditors: DiChen
 * @LastEditTime: 2024-06-19 20:41:37
 */
export default {
  state: {
    dataList: []
  },
  mutations: {
    setUserListInfo(state, userListInfo) {
      state.dataList.length = 0
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
