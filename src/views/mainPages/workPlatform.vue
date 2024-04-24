<template>
  <el-header><Header></Header></el-header>
  <!-- <button style="position: absolute; top: 500; right: 500; z-index: 9999" @click="test">
    test
  </button> -->
  <div id="mapDiv"></div>
  <div class="aside" id="aside">
    <el-menu>
      <el-menu-item index="1" @click="onCapture"
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
      <el-menu-item
        @click="Pop('rmShow')"
        v-if="store.state.userInfo.dataList[0].username == 'root'"
        ><div class="aside-img-svg">
          <img src="@/assets/images/rightsManagement.svg" alt="" style="width: 2rem" />
        </div>
        <span>权限管理</span></el-menu-item
      >
    </el-menu>
  </div>
  <!-- <div class="mapModal" v-if="data.editControl.isEdit"></div> -->
  <div>
    <dataCapture v-if="data.shows.dcShow" @dcLeave="Leave"></dataCapture>
    <dataReview v-if="data.shows.drShow" @drLeave="Leave"></dataReview>
    <dataManagerment v-if="data.shows.dmShow" @dmLeave="Leave"></dataManagerment>
    <rightsManagement v-if="data.shows.rmShow" @rmLeave="Leave"></rightsManagement>
  </div>
  <el-button
    class="leaveEditButton"
    v-if="data.editShow"
    @click="onLeaveEdit"
    type="danger"
    size="large"
    >退出编辑</el-button
  >
  <transition name="fade">
    <div id="UpScores" class="up-scores" v-if="data.shows.csShow"><comScores></comScores></div>
  </transition>
  <div id="rightContainer" class="right-container">
    <dataStatistic></dataStatistic>
  </div>
  <Teleport v-if="data.editControl.isEdit" to="#editPopUp">
    <editPopForm
      @popCancel="onCancel"
      @popSubmit="onCaptureSubmit"
      :editInfo="data.editInfo"
    ></editPopForm>
  </Teleport>
  <Teleport v-if="data.isRead" to="#editPopUp">
    <editPopForm
      @popCancel="onCancel"
      @popSubmit="onCaptureSubmit"
      :editInfo="data.editInfo"
    ></editPopForm>
  </Teleport>
</template>

<script setup>
import { reactive, toRefs, onMounted, createApp, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import Header from '@/components/header.vue'
import tiandilayers from '@/layers/layers'
import geoJsonDataUrl from '@/geoJson/index.js'
import dataStatistic from '@/views/modulesRight/dataStatistic.vue'
import comScores from '@/views/modulesRight/comScores.vue'
import dataManagerment from '@/views/modulesMid/dataManagerment.vue'
import dataReview from '@/views/modulesMid/dataReview.vue'
import PositionHelper from '@/utils/PositionHelper.js'
import dataCapture from '@/views/modulesMid/dataCapture.vue'
import rightsManagement from '@/views/modulesMid/rightsManagement.vue'
import editPopForm from '@/views/editPopForm.vue'
import store from '@/store'

const data = reactive({
  shows: {
    dmShow: false,
    drShow: false,
    rmShow: false,
    csShow: true,
    dcShow: false
  },
  editShow: false,
  geoLayers: [],
  editInfo: {},
  hoveredStateId: null,
  editControl: { selectedIds: [], isEdit: false, isSave: false },
  selectedIds: [],
  isRead: false
})
onMounted(() => {
  onLoad()
})

var draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    point: true,
    line_string: true,
    polygon: true,
    trash: true
  }
})
var map = null
const onLoad = () => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg'
  map = new mapboxgl.Map({
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
    onReloadGeoJson()
    //配置鼠标悬停移动事件
    onMouseMap()
    //设置点击事件，触发弹框
    map.on('click', data.geoLayers, handleClickPopUp)

    // 监听绘制完成事件
    map.on('draw.create', handleCreateEdit)
  })
}

//鼠标悬停、移除事件
const onMouseMap = () => {
  //鼠标悬停事件
  map.on('mousemove', data.geoLayers, (e) => {
    map.getCanvas().style.cursor = 'pointer'
    let features = map.queryRenderedFeatures(e.point)
    if (features.length > 0) {
      let feature = features[0]
      if (data.hoveredStateId) {
        // setFeatureState 和 setFilter 是两种不同的写法(都可以)
        // hover时给该区域填充颜色
        map.setFeatureState({ source: feature.layer.id, id: data.hoveredStateId }, { hover: false })
        // hover时出现区域边界线
        // map.setFilter('state-borders', [
        //   '==',
        //   'name',
        //   e.features[0].properties.name
        // ]) /* 通过设置filter更新要显示的数据，即出现鼠标悬停之后的变色效果 */
      }
      data.hoveredStateId = feature.id // ps:加载的geoJson  feature 里面必须设定一个id 属性,用于定位哪个区域需要高亮。如果原文件没有，可以手动在原文件上添加id 属性并设置对应的id 数字
      map.setFeatureState({ source: feature.layer.id, id: data.hoveredStateId }, { hover: true })
    }
  })
  //鼠标移除事件
  map.on('mouseleave', data.geoLayers, (e) => {
    map.getCanvas().style.cursor = ''
  })
}

//查看节点信息pop
const detailPopUp = new mapboxgl.Popup({
  closeButton: true, // 是否显示关闭按钮
  closeOnClick: true // 是否在点击地图其它部分时关闭弹出窗口
})

//提交表单pop
const submitPopUp = new mapboxgl.Popup({
  closeButton: true, // 是否显示关闭按钮
  closeOnClick: false // 是否在点击地图其它部分时关闭弹出窗口
})

//数据采集
const onCapture = () => {
  map.addControl(draw, 'bottom-right')
  reLoadauditsData('all')
  editEnter()
  changePage('edit')
  data.editShow = true
  // 监听 Draw 控件的 selectionchange 事件
  map.on('draw.selectionchange', onEditStateChange)
  //关闭弹窗事件
  map.off('click', data.geoLayers, handleClickPopUp)
  //关闭地图选中事件
  map.on('click', onEditState)
}
//重载审批数据
const reLoadauditsData = (type) => {
  let auditsData = store.state.auditsDataInfo.dataList
  if (auditsData.length) {
    if (type == 'all') {
      auditsData.forEach((item) => {
        draw.add(item)
      })
    } else if (type == 'last') {
      draw.add(auditsData[auditsData.length - 1])
    }
  }
}

//退出数据采集
const onLeaveEdit = () => {
  data.editShow = false
  resetEditState()
  editLeave('edit')
  map.on('click', data.geoLayers, handleClickPopUp)
  map.off('click', onEditState)
  map.removeControl(draw, 'bottom-right')
}

//点击要素弹框事件
const handleClickPopUp = (e) => {
  let features = map.queryRenderedFeatures(e.point)
  if (features.length > 0) {
    // 获取点击到的第一个要素
    let feature = features[0]

    // 构建弹框的 HTML 内容
    let popupContent =
      '<h3>' +
      feature.properties.name +
      '</h3>' +
      '<p>属性信息: ' +
      JSON.stringify(feature.properties) +
      '</p>'

    console.log(e.lngLat)
    // 创建弹框并设置位置
    detailPopUp.setLngLat(e.lngLat).setHTML(popupContent).addTo(map)
  }
}

//判断是否要素选中
const onEditState = (e) => {
  if (data.editControl.isEdit) {
    draw.changeMode('simple_select', { featureIds: data.editControl.selectedIds })
  }
}

//选中状态变化
const onEditStateChange = (e) => {
  //判断当前是否处于编辑要素状态
  if (data.editControl.isEdit == true) {
    console.log(data.editControl.isEdit)
    return
  } else {
    console.log(e)
    //非编辑要素状态
    //判断是否有选中要素
    if (e.features.length > 0) {
      data.isRead = true
      const selectedFeature = e.features[0]
      if (selectedFeature.properties != undefined) {
        if (selectedFeature.properties.state == 1) {
          EditPopFormMount(selectedFeature.geometry.coordinates, 1)
          data.editInfo = selectedFeature
          submitPopUp.on('close', resetReadState)
          console.log('Selected features:', selectedFeature)
        }
      } else {
        console.log('no selected features')
      }
    }
  }
}
//重置读取状态
const resetReadState = () => {
  data.isRead = false
  submitPopUp.off('close', resetReadState)
  console.log('resetReadState')
}

//pop页面挂载
const EditPopFormMount = (lngLat, state) => {
  if (submitPopUp.isOpen()) {
    // 检查 Popup 是否处于打开状态
    submitPopUp.remove() // 关闭并移除 Popup
  }
  if (state == 0) {
    console.log('挂载编辑弹窗')
    //第一次绘制要素
    let popupContent = '<div id="editPopUp"></div>'
    submitPopUp.setLngLat(lngLat).setHTML(popupContent).addTo(map)
  } else if (state == 1) {
    console.log('挂载信息弹窗')
    //点击查看已提交内容
    let popupContent = '<div id="editPopUp"></div>'
    submitPopUp.setLngLat(lngLat).setHTML(popupContent).addTo(map)
  }
}

//绘制完成事件
const handleCreateEdit = (e) => {
  //标志进入编辑模式
  data.editControl.isEdit = true
  //获取绘制完成的经纬度信息
  let lngLat = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]
  //记录编辑的节点id
  data.editControl.selectedIds.push(e.features[0].id)
  //构建弹框的 HTML 内容,并挂载
  EditPopFormMount(lngLat, 0)
  //获取编辑时间
  var stamp = new Date().getTime() + 8 * 60 * 60 * 1000
  // 格式化北京时间为"YYYY-MM-DD HH:mm:ss"
  var beijingTime = new Date(stamp)
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')
    .substring(0, 19)
  data.editInfo.id = e.features[0].id
  data.editInfo.editLngLat = lngLat
  data.editInfo.state = 0
  data.editInfo.editTime = beijingTime
  //监听地图点击事件，保持该要素选中状态
  map.on('click', onEditState)
  //关闭弹窗事件
  submitPopUp.on('close', onEditClosePop)
}
//关闭弹窗删除当前编辑要素
const onEditClosePop = () => {
  if (!data.editControl.isSave) {
    // 删除选中的要素
    data.editControl.selectedIds.forEach((featureId) => {
      draw.delete(featureId) // 使用 Draw 插件的 delete 方法删除指定 ID 的要素
    })
  }
  //初始化编辑信息
  resetEditState()
}

//重置编辑状态
const resetEditState = () => {
  data.editControl.isEdit = false
  data.editControl.selectedIds = []
  data.editControl.isSave = false
  data.editInfo = {}
  map.off('click', onEditState)
  submitPopUp.off('close', onEditClosePop)
  console.log('resetEditState')
}

//删除编辑节点
const onCancel = () => {
  if (submitPopUp.isOpen()) {
    // 检查 Popup 是否处于打开状态
    submitPopUp.remove() // 关闭并移除 Popup
  }
}
//完成提交
const onCaptureSubmit = () => {
  if (submitPopUp.isOpen()) {
    data.editControl.isSave = true
    // 检查 Popup 是否处于打开状态
    submitPopUp.remove() // 关闭并移除 Popup
    reLoadauditsData('last')
  }
}

//重新载入geojson数据
const onReloadGeoJson = () => {
  geoJsonDataUrl.forEach((item) => {
    if (map.getLayer(item.name)) {
      map.removeLayer(item.name)
    }
  })

  geoJsonDataUrl.forEach((item) => {
    addGeoJsonLayer(map, item.url, item.name, item.name)
    data.geoLayers.push(item.name)
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

const addGeoJsonLayer = (map, url, sourceId, layerId) => {
  map.addSource(sourceId, {
    type: 'geojson',
    data: url
  })
  map.addLayer({
    id: layerId,
    type: 'circle',
    source: sourceId,
    paint: {
      // make circles larger as the user zooms from z12 to z22
      'circle-radius': {
        type: 'exponential',
        base: 2,
        stops: [
          [7, 8],
          [16, 8]
        ]
      },
      'circle-color': '#627BC1',
      'circle-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 1]
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

const editEnter = () => {
  const RightIds = ['rightContainer']
  const asideIds = ['aside']
  PositionHelper.leaveRightActions(RightIds, 0)
  PositionHelper.leaveLeftActions(asideIds, 0)
}
const editLeave = (type) => {
  data.shows[type] = false
  const RightIds = ['rightContainer']
  const asideIds = ['aside']
  PositionHelper.enterLeftActions(asideIds, 0)
  PositionHelper.enterRightActions(RightIds, 0)
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
.mapModal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  z-index: 9998;
}
:deep(.mapboxgl-popup) {
  z-index: 5;
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
:deep(.mapboxgl-popup) {
  max-width: 1000px !important;
}
:deep(.mapboxgl-popup-content) {
  padding: unset !important;
}
:deep(.mapboxgl-popup-close-button) {
  font-size: 25px;
}
.leaveEditButton {
  bottom: 10px;
  right: 60px;
  position: absolute;
  z-index: 999;
}
:deep(.mapboxgl-ctrl-bottom-left) {
  display: none;
}
:deep(.mapboxgl-ctrl-bottom-right) {
  display: block;
}
</style>
