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
import Map from 'ol/Map'
import View from 'ol/View'
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
  const map = new Map({
    target: 'mapDiv',
    layers: tiandilayers,
    view: new View({
      center: fromLonLat([121.397428, 31.13923]), // 设置地图中心点坐标（例如：北京）
      zoom: 10 // 设置初始缩放级别
      // projection:"EPSG:4326"
    })
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
