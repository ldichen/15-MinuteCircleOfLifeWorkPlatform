/*
 * @Author: DiChen
 * @Date: 2024-06-20 19:29:46
 * @LastEditors: DiChen
 * @LastEditTime: 2024-07-01 21:54:38
 */
export default {
  state: {
    dataList: [],
    treeDatalist: [],
    checkedKeys: []
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
    //

    // treeDatalist
    setTreeDatalist(state, treeData) {
      state.treeDatalist.push(treeData)
    },
    cleanTreeDatalist(state) {
      state.treeDatalist.length = 0
      state.checkedKeys.length = 0
    },
    setCheckedKeyslist(state, checkedKeys) {
      checkedKeys.forEach((item) => {
        state.checkedKeys.push(item)
      })
      console.log('checkedKeys', state.checkedKeys)
    }
  },
  actions: {
    async parseTree({ state, commit, dispatch }, layersData) {
      try {
        let treeId = 0
        let checked = []
        for (const item of layersData.filter((item) => item.metadata != undefined)) {
          if (item.metadata.mode != undefined) {
            if (state.treeDatalist.length != 0) {
              for (let j = 0; j < state.treeDatalist.length; j++) {
                let treeItem = state.treeDatalist[j]
                if (treeItem.label == (await dispatch('transComputeMode', item.metadata.mode))) {
                  treeItem.children.push({ label: item.source, id: treeId })
                  checked.push(treeId)
                  treeId += 1
                  break
                } else {
                  if (j == state.treeDatalist.length - 1) {
                    let leaf = { label: '', id: treeId, children: [] }
                    leaf.label = await dispatch('transComputeMode', item.metadata.mode)
                    checked.push(treeId)
                    treeId += 1
                    leaf.children.push({ label: item.source, id: treeId })
                    checked.push(treeId)
                    treeId += 1
                    commit('setTreeDatalist', leaf)
                    break
                  }
                }
              }
            } else {
              //新的标签
              let leaf = { label: '', id: treeId, children: [] }
              leaf.label = await dispatch('transComputeMode', item.metadata.mode)
              checked.push(treeId)
              treeId += 1
              leaf.children.push({ label: item.source, id: treeId })
              checked.push(treeId)
              treeId += 1
              commit('setTreeDatalist', leaf)
            }
          }
        }
        commit('setCheckedKeyslist', checked)
      } catch (e) {
        console.log(e)
      }
    },
    transComputeMode(context, type) {
      if (type == 1) {
        return '驾驶模式'
      }
      if (type == 3) {
        return '步行模式'
      }
      if (type == 4) {
        return '骑行模式'
      }
    }
  }
}
