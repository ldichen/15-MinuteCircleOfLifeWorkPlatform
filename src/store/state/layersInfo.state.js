/*
 * @Author: DiChen
 * @Date: 2024-06-22 14:38:39
 * @LastEditors: DiChen
 * @LastEditTime: 2024-06-22 14:53:39
 */
export default {
  state: {
    dataList: [],
    treeDatalist: []
  },
  mutations: {
    //tmp图层
    setLayersInfo(state, comListInfo) {
      comListInfo.forEach((item) => {
        state.dataList.push(item)
      })
    },
    cleanLayersInfo(state) {
      state.dataList.length = 0
    },
    // treeDatalist
    setTreeDatalist(state, treeData) {
      state.treeDatalist.push(treeData)
    },
    cleanTreeDatalist(state) {
      state.treeDatalist.length = 0
    }
  }
}
