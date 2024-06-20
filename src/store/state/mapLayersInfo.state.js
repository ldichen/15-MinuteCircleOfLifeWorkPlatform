/*
 * @Author: DiChen
 * @Date: 2024-06-20 19:29:46
 * @LastEditors: DiChen
 * @LastEditTime: 2024-06-20 20:24:18
 */
export default {
  state: {
    dataList: []
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
    }
  }
}
