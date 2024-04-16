import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuex from 'vuex'
import './assets/main.css'
import Element from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import $ from 'jquery'
import gsap from 'gsap'
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/styles.css'
import * as echarts from 'echarts'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
// import MapboxLanguage from '@mapbox/mapbox-gl-language' //可以将标签改为中文

const app = createApp(App)

app.component('echarts', echarts)

app.use(router)
app.use(vuex)
app.use(mapboxgl)
app.use($)
app.use(gsap)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(Element)
app.use(echarts)
app.mount('#app')
