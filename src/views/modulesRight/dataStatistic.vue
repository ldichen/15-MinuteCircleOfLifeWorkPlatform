<template>
  <div class="right-top">
    <div class="right-title"><span>覆盖率得分情况</span></div>
    <div class="right-chart">
      <div class="top-chart" ref="topchart"></div>
    </div>
  </div>
  <div class="right-bottom">
    <div class="right-title"><span>社区排名</span></div>
    <div class="right-chart">
      <div class="bottom-chart" ref="bottomchart"></div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getOption } from '@/components/echarts/workplatformchart.js'
const data = reactive({
  scoreSegmentType: [
    { value: 15, name: '优' },
    { value: 30, name: '良' },
    { value: 20, name: '中' },
    { value: 10, name: '差' }
  ],
  rankType: [
    { name: '双塔街道', value: 27 },
    { name: '江苏路街道', value: 29 },
    { name: '田林社区', value: 54 },
    { name: '仙霞新村', value: 56 },
    { name: '静安寺街道', value: 57 },
    { name: '蓬莱公园社区', value: 67 },
    { name: '临汾社区', value: 73 },
    { name: '曹杨社区', value: 73 },
    { name: '江湾镇街道', value: 74 },
    { name: '四平社区', value: 75 },
    { name: '江宁路街道', value: 78 },
    { name: '虹桥机场新村', value: 85 },
    { name: '宝山路街道', value: 89 },
    { name: '大宁路街道', value: 93 },
    { name: '新华街道', value: 96 }
  ]
})
const topchart = ref(null)
const bottomchart = ref(null)
let myrightTopChart = null
let myrightBottomChart = null
window.addEventListener('resize', () => {
  myrightTopChart.resize()
  myrightBottomChart.resize()
})
onMounted(() => {
  getList()
})
const getList = () => {
  myrightTopChart = echarts.init(topchart.value)
  let rightTopOption = getOption('scoreSegment', data.scoreSegmentType)
  myrightTopChart.clear()
  myrightTopChart.setOption(rightTopOption)

  myrightBottomChart = echarts.init(bottomchart.value)
  let rightBottomOption = getOption('rank', data.rankType)
  myrightBottomChart.clear()
  myrightBottomChart.setOption(rightBottomOption)
}
</script>

<style scoped>
.right-top {
  height: 40%;
  width: 100%;
}
.right-bottom {
  height: 60%;
  width: 100%;
}
.right-title {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-weight: bold;
  height: 2rem;
}
.right-chart {
  width: 100%;
  height: calc(100% - 2rem);
}
.top-chart,
.bottom-chart {
  width: 100%;
  height: 100%;
}
</style>
