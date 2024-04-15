import './assets/main.css'
import Element from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $ from 'jquery'
import gsap from 'gsap'
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/styles.css'
import * as echarts from 'echarts'

const app = createApp(App)

app.component('echarts', echarts)

app.use(router)
app.use($)
app.use(gsap)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(Element)
app.use(echarts)
app.mount('#app')
