<!--
 * @Author: DiChen
 * @Date: 2024-06-19 19:51:30
 * @LastEditors: DiChen
 * @LastEditTime: 2024-06-21 17:20:33
-->

<template>
  <div class="left-container">
    <div style="height: 2rem; display: flex; align-items: center">
      <button
        style="
          appearance: none;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          font-weight: bold;
        "
        @click="close"
      >
        <el-icon style="vertical-align: middle" :size="30"><DArrowLeft /></el-icon>
      </button>
    </div>
    <div class="compute-type">
      <el-radio-group v-model="data.radio" size="large" fill="#909399">
        <el-radio-button label="选点计算" value="dragMarker" />
        <el-radio-button label="社区计算" value="community" />
      </el-radio-group>
    </div>
    <div class="compute-params">
      <dragMarker
        v-if="data.radio == 'dragMarker'"
        :lngLat="data.lngLat"
        @setMarkerLngLat="setMarkerLngLat"
      ></dragMarker>
      <community v-if="data.radio == 'community'"></community>
    </div>
  </div>
</template>
<script setup>
import { reactive, toRefs, ref, watch, onMounted, onUnmounted } from 'vue'
import { ElLoading } from 'element-plus'
//不同计算模式下的页面
import dragMarker from './dragMaker.vue'
import community from './community.vue'
//mapboxgl
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
//api
import { queryPoint } from '@/api/data'
//store
import store from '@/store'
const loading = ref(null)
const emits = defineEmits(['ocLeave'])
const props = defineProps(['map'])
const data = reactive({
  radio: 'dragMarker',
  //映射到dragMarker
  lngLat: [121.397428, 31.15923],
  //接收输入框的经纬度
  inputLngLat: [121.397428, 31.15923],
  profile: null,

  pointGeoJsonData: [],
  conGeoJsonData: []
})
//挂载时
onMounted(() => {
  onLoad()
})
//销毁时
onUnmounted(() => {
  data.profile = null
  data.radio = 'dragMarker'
  data.lngLat = [121.397428, 31.15923]
  data.profile = null
  marker.remove()
  console.log('onComputing unmounted')
})
var marker = new mapboxgl.Marker({
  draggable: true
}).setLngLat([121.397428, 31.15923])

const onLoad = () => {
  watch(
    () => data.radio,
    (radio) => {
      if (radio == 'dragMarker') {
        marker.remove()
        marker.setLngLat([121.397428, 31.15923]).addTo(props.map)
      } else if (radio == 'community') {
        marker.remove()
      }
    },
    { immediate: true }
  )
  //只对输入框负责
  watch([() => data.inputLngLat[0], () => data.inputLngLat[1]], async (newValue) => {
    try {
      loading.value = ElLoading.service({
        target: '#mapDiv',
        lock: false,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (data.profile != null) {
        let p = {
          lon: data.inputLngLat[0],
          lat: data.inputLngLat[1],
          profile: data.profile
        }
        marker.remove()
        marker.setLngLat([data.inputLngLat[0], data.inputLngLat[1]]).addTo(props.map)
        await queryPoint(p).then((res) => {
          res.data.name = res.time.match(/\d/g).slice(0, 14).join('')
          res.data.mode = data.profile
          res.data.isShow = true
          store.commit('setLayersInfo', res.data)
          addGeoJsonLayer(
            props.map,
            res.data,
            res.data.name,
            res.data.name,
            res.data.features[0].properties
          )
        })
      }
    } catch (err) {
      console.log(err)
    } finally {
      loading.value.close()
    }
  })
  marker.on('dragend', onDragEnd)
}
/**
 * @description: 移动marker结束事件，
 * @return {*}
 */
const onDragEnd = () => {
  const lngLat = marker.getLngLat()
  data.lngLat[0] = Number(lngLat.lng.toFixed(7))
  data.lngLat[1] = Number(lngLat.lat.toFixed(7))
}
/**
 * @description: 输入框改变，marker也改变
 * @param {object} lngLat
 * @param {Number} lngLat.lon 经度
 * @param {Number} lngLat.lat 纬度
 * @param {Number} profile 计算模式
 * @return {*}
 */
const setMarkerLngLat = (lngLat, profile) => {
  data.profile = profile
  data.inputLngLat[0] = lngLat.lon
  data.inputLngLat[1] = lngLat.lat
}

const onReloadLayers = () => {
  store.state.mapLayersInfo.dataList.forEach((item, index) => {
    addGeoJsonLayer(props.map, item, index, index, item.features[0].properties)
  })
}
/**
 * @description: 添加geoJSON
 * @param {object} map
 * @param {object} data geojson
 * @param {string|number} sourceId
 * @param {string|number} layerId
 * @param {object} properties
 * @return {*}
 */
const addGeoJsonLayer = (map, data, sourceId, layerId, properties) => {
  map.addSource(sourceId, {
    type: 'geojson',
    data: data
  })
  map.addLayer({
    id: 'fiil' + sourceId,
    type: 'fill',
    source: sourceId,
    layout: {},
    paint: {
      'fill-color': properties['color'],
      'fill-opacity': properties['fill-opacity']
    },
    metadata: {
      mode: data.mode,
      isShow: data.isShow
    }
  })
  map.addLayer({
    id: 'outline' + layerId,
    type: 'line',
    source: sourceId,
    layout: {},
    paint: {
      'line-color': properties['color'],
      'line-width': 3
    }
  })
}
//关闭该组件
const close = () => {
  emits('ocLeave', 'ocShow')
}
</script>

<style scoped>
.compute-type {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 4rem;
  /* background-color: #409eff; */
}
.compute-params {
  display: flex;
  position: relative;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  /* height: calc(100%-6rem); */
  height: calc(100% - 5rem);
  /* background-color: #409eff; */
}
.el-radio-group {
  border: 1px solid #909399 !important;
  border-radius: 20px !important;
}
:deep(.el-radio-group .el-radio-button__inner) {
  border-radius: 20px !important;
}
</style>
