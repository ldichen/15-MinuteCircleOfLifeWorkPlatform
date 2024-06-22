<!--
 * @Author: DiChen
 * @Date: 2024-06-21 16:13:15
 * @LastEditors: DiChen
 * @LastEditTime: 2024-06-22 15:07:47
-->

<template>
  <div class="layer-control">
    <el-collapse @change="getLayer">
      <el-collapse-item title="图层" name="1">
        <div>
          <el-tree
            v-if="data.treeShow"
            style="max-width: 600px"
            :data="store.state.mapLayersInfo.treeDatalist"
            node-key="id"
            show-checkbox
            default-expand-all
            :default-checked-keys="data.checkedKeys"
          >
            <template #default="{ node, data }">
              <span class="layer-tree-node" v-if="node.level != 1">
                <span>{{ node.label }}</span>
                <span>
                  <a style="margin-left: 8px; color: #909399" @click="removeNode(node, data)">
                    移除
                  </a>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, onUnmounted } from 'vue'
import store from '@/store'
const props = defineProps(['map'])
const data = reactive({
  treeData: [],
  treeShow: false,
  checkedKeys: []
})
onMounted(() => {
  //   onLoad()
})

onUnmounted(() => {
  data.treeData.length = 0
  data.treeShow = false
})

const getLayer = (val) => {
  if (val.length != 0) {
    parseTree(props.map.getStyle().layers)
  }
}

/**
 * @description: 解析图层数据，转换为树形
 * @param {*} layersData
 * @return {*}
 */
const parseTree = (layersData) => {
  try {
    store.commit('cleanTreeDatalist')
    // data.treeData.length = 0
    let treeId = 0
    layersData
      .filter((item) => item.metadata != undefined)
      .forEach((item) => {
        //在线计算模式
        if (item.metadata.mode != undefined) {
          console.log(store.state.mapLayersInfo.treeDatalist.length)
          if (store.state.mapLayersInfo.treeDatalist.length != 0) {
            for (let j = 0; j < store.state.mapLayersInfo.treeDatalist.length; j++) {
              let treeItem = store.state.mapLayersInfo.treeDatalist[j]
              if (treeItem.label == transComputeMode(item.metadata.mode)) {
                treeItem.children.push({ label: item.source, id: treeId })
                data.checkedKeys.push(treeId)
                treeId += 1
                break
              } else {
                if (j == store.state.mapLayersInfo.treeDatalist.length - 1) {
                  let leaf = { label: '', id: treeId, children: [] }
                  leaf.label = transComputeMode(item.metadata.mode)
                  data.checkedKeys.push(treeId)
                  treeId += 1
                  leaf.children.push({ label: item.source, id: treeId })
                  data.checkedKeys.push(treeId)
                  treeId += 1
                  //   data.treeData.push(leaf)
                  store.commit('setTreeDatalist', leaf)
                }
              }
            }
          } else {
            let leaf = { label: '', id: treeId, children: [] }
            leaf.label = transComputeMode(item.metadata.mode)
            data.checkedKeys.push(treeId)
            treeId += 1
            leaf.children.push({ label: item.source, id: treeId })
            data.checkedKeys.push(treeId)
            treeId += 1
            // data.treeData.push(leaf)
            store.commit('setTreeDatalist', leaf)
          }
        }
      })
  } catch (e) {
    console.log(e)
  } finally {
    data.treeShow = true
  }
}
const transComputeMode = (type) => {
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
/**
 * @description: 删除图层
 * @param {*} node
 * @param {*} data
 * @return {*}
 */
const removeNode = (node, data) => {
  const layers = props.map.getStyle().layers

  // 筛选出 source 为 特定值的图层
  const layersWithSource = layers.filter((layer) => layer.source === data.label)

  // 输出这些图层的 ID
  layersWithSource.forEach((layer) => {
    props.map.removeLayer(layer.id)
  })
  const parent = node.parent
  const children = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  //   检查父节点是否只有这个唯一的子节点
  if (children.length === 0) {
    // 如果父节点没有其他子节点，则删除父节点
    const grandparent = parent.parent
    if (grandparent) {
      const siblings = grandparent.data.children || grandparent.data
      const parentIndex = siblings.findIndex((d) => d.id === data.id)
      siblings.splice(parentIndex, 1)
    }
  }
  data.treeData.value = [...data.treeData.value]
}
</script>

<style scoped>
.el-collapse {
  border: 1px solid #909399;
  /* height: 3rem; */
}
.el-collapse-item {
  width: 17rem;
  margin-bottom: unset !important;
}

:deep(.el-collapse-item__header) {
  height: 2rem !important;
  padding: 0.5rem;
  border: unset;

  /* border-bottom: 1px solid #909399; */
}
:deep(.el-checkbox__inner) {
  border: 1px solid #909399;
}
.layer-tree-node {
  color: #000;
}
</style>
