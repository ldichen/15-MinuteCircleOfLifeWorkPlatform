/*
 * @Author: DiChen
 * @Date: 2024-06-20 19:29:46
 * @LastEditors: DiChen
 * @LastEditTime: 2024-06-22 15:09:43
 */
export default {
  state: {
    dataList: [],
    treeDatalist: []
  },
  mutations: {
    setLayersInfo(state, LayersInfo) {
      if (!Array.isArray(LayersInfo)) {
        state.dataList.push(LayersInfo)
      } else {
        LayersInfo.forEach((item) => {
          state.dataList.push(item)
        })
      }
    },
    cleanLayersInfoInfo(state) {
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
