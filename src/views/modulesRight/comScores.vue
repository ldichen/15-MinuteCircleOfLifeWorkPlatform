<template>
  <div class="title"><span>XX社区得分情况</span></div>
  <div class="midright-chart">
    <div id="scoreChart" ref="chart"></div>
  </div>
</template>

<script setup>
import { reactive, toRefs, ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getOption } from '@/components/echarts/workplatformchart.js'
const data = reactive({
  scoreType: [
    { name: '日常生活', value: 90 },
    { name: '文体娱乐', value: 20 },
    { name: '公共空间', value: 30 },
    { name: '教育服务', value: 40 },
    { name: '医疗护理', value: 50 },
    { name: '长者照料', value: 60 },
    { name: '社区安全', value: 80 }
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
