<template>
  <div class="title"><span>评分情况</span></div>
  <div class="midright-chart">
    <div id="scoreChart" ref="chart"></div>
  </div>
</template>

<script setup>
import { reactive, toRefs, ref, watch, onMounted } from 'vue'
import * as echarts from 'echarts'
import store from '@/store'
import { getOption } from '@/components/echarts/workplatformchart.js'
const data = reactive({
  scoreType: [
    {
      name: '宜业',
      value: 0
    },
    { name: '宜居', value: 0 },
    { name: '宜养', value: 0 },
    { name: '宜学', value: 0 },
    { name: '宜游', value: 0 }
    // { name: '长者照料', value: 60 },
    // { name: '社区安全', value: 80 }
  ]
})
let myrightTopChart = null
window.addEventListener('resize', () => {
  myrightTopChart.resize()
})
// const chart = ref(null)
onMounted(() => {
  getList()
})
watch(store.state.mapLayersInfo.dataList, (newValue) => {
  data.scoreType.forEach((item) => {
    item.value = getRandomNumber()
  })
  getList()
})
const getList = () => {
  // let myrightTopChart = echarts.getInstanceByDom(chart.value)
  // if (myrightTopChart == undefined) {
  //   myrightTopChart = echarts.init(chart.value)
  // }
  myrightTopChart = echarts.init(document.getElementById('scoreChart'))
  let Option = getOption('scores', data.scoreType)
  myrightTopChart.clear()
  myrightTopChart.setOption(Option)
}
const getRandomNumber = () => {
  const min = 30
  const max = 99
  return Math.floor(Math.random() * (max - min + 1)) + min
}
</script>

<style scoped>
.title {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-weight: bold;
  height: 2rem;
}

.midright-chart {
  width: 100%;
  height: calc(100% - 2rem);
}
#scoreChart {
  width: 100%;
  height: 100%;
}
</style>
