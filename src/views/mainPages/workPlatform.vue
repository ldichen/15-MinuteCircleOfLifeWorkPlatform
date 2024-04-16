<template>
  <el-header><Header></Header></el-header>
  <div id="mapDiv"></div>
  <div class="aside">
    <el-menu>
      <el-menu-item @click="Pop('dcShow')"
        ><div class="aside-img-svg">
          <img src="@/assets/images/dataCapture.svg" alt="" style="width: 2rem" />
        </div>
        <span>数据采集</span></el-menu-item
      >
      <el-menu-item @click="Pop('drShow')"
        ><div class="aside-img-svg">
          <img src="@/assets/images/dataReview.svg" alt="" style="width: 1.6rem" />
        </div>
        <span>数据审核</span></el-menu-item
      >
      <el-menu-item @click="Pop('dmShow')"
        ><div class="aside-img-svg">
          <img src="@/assets/images/dataManagerment.svg" alt="" style="width: 2rem" />
        </div>
        <span>数据管理</span></el-menu-item
      >
      <el-menu-item @click="Pop('rmShow')"
        ><div class="aside-img-svg">
          <img src="@/assets/images/rightsManagement.svg" alt="" style="width: 2rem" />
        </div>
        <span>权限管理</span></el-menu-item
      >
    </el-menu>
  </div>

  <div>
    <dataCapture v-if="data.shows.dcShow" @dcLeave="Leave"></dataCapture>
    <dataReview v-if="data.shows.drShow" @drLeave="Leave"></dataReview>
    <dataManagerment v-if="data.shows.dmShow" @dmLeave="Leave"></dataManagerment>
    <rightsManagement v-if="data.shows.rmShow" @rmLeave="Leave"></rightsManagement>
  </div>
  <transition name="fade">
    <div id="UpScores" class="up-scores" v-if="data.shows.csShow"><comScores></comScores></div>
  </transition>
  <div id="rightContainer" class="right-container">
    <dataStatistic></dataStatistic>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import Header from '@/components/header.vue'
import tiandilayers from '@/layers/layers'
import { fromLonLat } from 'ol/proj'
import dataStatistic from '@/views/modulesRight/dataStatistic.vue'
import comScores from '@/views/modulesRight/comScores.vue'
import dataManagerment from '@/views/modulesMid/dataManagerment.vue'
import dataReview from '@/views/modulesMid/dataReview.vue'
import PositionHelper from '@/utils/PositionHelper.js'
import dataCapture from '@/views/modulesMid/dataCapture.vue'
import rightsManagement from '@/views/modulesMid/rightsManagement.vue'

const data = reactive({
  shows: {
    dmShow: false,
    drShow: false,
    rmShow: false,
    csShow: true,
    dcShow: false
  }
})
onMounted(() => {
  onLoad()
})

const onLoad = () => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg'
  const map = new mapboxgl.Map({
    container: 'mapDiv',
    center: [121.397428, 31.15923], // 设置地图中心点坐标（例如：北京）
    zoom: 9.5, // 设置初始缩放级别,
    style: {
      version: 8,
      sources: {},
      layers: [] //121.397428, 31.13923
    }
  })
  map.on('load', () => {
    tiandilayers.forEach((item) => {
      addRasterTileLayer(map, item.url, item.id, item.id)
    })
    addGeoJsonLayer(map, 'source-geojson', 'layer-geojson')
  })
}

const addRasterTileLayer = (map, url, sourceId, layerId) => {
  map.addSource(sourceId, {
    type: 'raster',
    tiles: [url]
  })
  map.addLayer({
    id: layerId,
    type: 'raster',
    source: sourceId
  })
}

const addGeoJsonLayer = (map, sourceId, layerId) => {
  map.addSource(sourceId, {
    type: 'geojson',
    data: '/src/geoJson/lifeServices.geojson'
  })
  map.addLayer({
    id: layerId,
    type: 'circle',
    source: sourceId,
    // layout: {
    //   'icon-size': 3, //图标大小
    //   'icon-image': 'museum-15' //图片名称
    //   // 'fill-color': '#fbb03b', //面颜色
    //   // 'fill-opacity': 0.7 // 面透明度
    // },

    paint: {
      // make circles larger as the user zooms from z12 to z22
      'circle-radius': {
        base: 150.75,
        stops: [
          [12, 2],
          [22, 180]
        ]
      },
      //'circle-radius':13,
      'circle-color': '#B42222'
    }
  })
}

const changePage = (page) => {
  if (page) {
    for (let val in data.shows) {
      if (val != page) {
        data.shows[val] = false
      } else {
        data.shows[val] = true
      }
    }
  }
}

const Enter = () => {
  const RightIds = ['rightContainer']
  PositionHelper.leaveRightActions(RightIds, 0)
}
const Leave = (type) => {
  data.shows[type] = false
  const RightIds = ['rightContainer']
  PositionHelper.enterRightActions(RightIds, 0)
}

const Pop = (page) => {
  if (!data.shows[page]) {
    changePage(page)
    Enter()
  }
}
</script>

<style scoped>
@import '@/assets/workPlatform.css';
#mapDiv {
  width: 100%;
  height: 100%;
}
.el-header {
  --el-header-padding: none;
  --el-header-height: none;
}
.aside {
  position: absolute;
  top: 8rem;
  left: 0.3rem;
  height: calc(100% - 16rem);
  width: 5rem;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #1e8df9;
}
.aside .el-menu {
  /* height: 50%; */
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */

  border-right: none;
  background-color: rgba(29, 48, 67, 0);
  /* height: 30rem; */
  /* background: var(--el-color-primary-light-8); */
}
.el-menu-item {
  height: 5rem;
  line-height: unset;
  color: black;
  flex-direction: column;
  justify-content: center;
}
.aside-img-svg {
  height: 2.5rem;
  width: 2.5rem;
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: #fff;
  border-radius: 50%;
}

.up-scores {
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 5;
  top: 8rem;
  left: 6rem;
  height: 40%;
  width: 20rem;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #1e8df9;
}
.fade-leave-active {
  transition: opacity 1s;
}
.fade-leave-to {
  opacity: 0;
}
</style>
