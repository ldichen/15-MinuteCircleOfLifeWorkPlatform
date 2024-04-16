import { createStore } from 'vuex'
import comScoresInfo from './state/comScoresInfo.state'
import POIdataInfo from './state/POIdataInfo.state'
import userInfo from './state/userInfo.state'

export default createStore({
  modules: {
    comScoresInfo,
    POIdataInfo,
    userInfo
  }
})
