/*
 * @Author: DiChen
 * @Date: 2024-06-18 15:11:47
 * @LastEditors: DiChen
 * @LastEditTime: 2024-06-20 19:30:57
 */
import { createStore } from 'vuex'
import comScoresInfo from './state/comScoresInfo.state'
import POIdataInfo from './state/POIdataInfo.state'
import userInfo from './state/userInfo.state'
import captureDataInfo from './state/captureDataInfo.state'
import auditsDataInfo from './state/auditsCaptureDataInfo.state'
import mapLayersInfo from './state/mapLayersInfo.state'

export default createStore({
  modules: {
    comScoresInfo,
    POIdataInfo,
    userInfo,
    captureDataInfo,
    auditsDataInfo,
    mapLayersInfo
  }
})
