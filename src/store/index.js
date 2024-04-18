import { createStore } from 'vuex'
import comScoresInfo from './state/comScoresInfo.state'
import POIdataInfo from './state/POIdataInfo.state'
import userInfo from './state/userInfo.state'
import captureDataInfo from './state/captureDataInfo.state'
import auditsDataInfo from './state/auditsDataInfo.state'

export default createStore({
  modules: {
    comScoresInfo,
    POIdataInfo,
    userInfo,
    captureDataInfo,
    auditsDataInfo
  }
})
