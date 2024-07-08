<!--
 * @Author: DiChen
 * @Date: 2024-06-19 19:51:30
 * @LastEditors: DiChen
 * @LastEditTime: 2024-07-04 10:36:31
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
    <div class="compute-scores">
      <comScores></comScores>
    </div>
  </div>
</template>
<script setup>
import { reactive, toRefs, ref, watch, onMounted, onUnmounted } from 'vue'
import { ElLoading } from 'element-plus'
//不同计算模式下的页面
import dragMarker from './dragMaker.vue'
import community from './community.vue'
//comScores
import comScores from '@/views/modulesRight/comScores.vue'
//mapboxgl
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
//api
import { queryPoint } from '@/api/data'
//store
import store from '@/store'
//IMG
import POIImageUrl from '@/assets/images/features/POIIndex.js'

const loading = ref(null)
const emits = defineEmits(['ocLeave'])
const props = defineProps(['map'])
var imgArr = []
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
  let arr = ['宜学', '宜游', '宜居', '宜养', '宜业']
  console.log('arr', arr)
  //添加点
  for (let i = 0; i < arr.length; i++) {
    console.log('i', i)
    const img = new Image()
    img.src = POIImageUrl[arr[i]]
    console.log('img.src', POIImageUrl[arr[i]])
    img.onload = () => {
      createImageBitmap(img).then((ImageBitmap) => {
        imgArr.push(ImageBitmap)
        props.map.addImage(arr[i], ImageBitmap)
      })
    }
  }
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
          console.log('res', res)
          res.data.name = res.time.match(/\d/g).slice(0, 14).join('')
          res.data.mode = data.profile
          res.data.isShow = true
          store.commit('setLayersInfo', res.data)
          addGeoJsonLayer(props.map, res.data)
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
//  res.data.name,
//             res.data.name,
//             res.data.features[0].properties
const addGeoJsonLayer = (map, data) => {
  let sourceId = data.name
  let layerId = data.name
  let urlSourceId = 'url' + sourceId
  let urlLayerId = 'url' + layerId
  let properties = data.polygon.features[0].properties

  map.addSource(sourceId, {
    type: 'geojson',
    data: data.polygon
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
  // Add the image to the map.value style.

  map.addSource(urlSourceId, {
    type: 'geojson',
    data: data.pois
  })
  console.log('data.pois', data.pois)
  map.addLayer({
    id: urlLayerId,
    type: 'symbol',
    source: urlSourceId,
    layout: {
      'icon-image': [
        'match',
        ['get', 'type'], // 属性名，根据此属性决定图标
        '宜学',
        '宜学', // 当属性值为 'value1' 时使用 'icon-image-1'
        '宜游',
        '宜游', // 当属性值为 'value2' 时使用 'icon-image-2'
        '宜居',
        '宜居', // 当属性值为 'value2' 时使用 'icon-image-2'
        '宜养',
        '宜养',
        '宜业',
        '宜业',
        '宜业'
        // '宜居' // 当属性值为 'value2' 时使用 'icon-image-2'
        // 'default-icon-image' // 默认图标，当属性值不匹配时使用此图标
      ],
      'icon-size': 0.15
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
  height: 25rem;
  /* background-color: #409eff; */
}
.compute-scores {
  display: flex;
  position: relative;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  /* height: calc(100%-6rem); */
  /* margin-bottom: 10rem; */
  height: 25rem;
  /* background-color: aqua; */
}
.el-radio-group {
  border: 1px solid #909399 !important;
  border-radius: 20px !important;
}
:deep(.el-radio-group .el-radio-button__inner) {
  border-radius: 20px !important;
}
</style>
