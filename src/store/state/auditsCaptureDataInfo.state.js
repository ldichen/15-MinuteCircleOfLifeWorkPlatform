/*
 * @Description: 应该另外建一个库存储数据
 * @Author: DiChen Liu
 * @Date: 2024-04-22
 * @LastEditTime: 2024-04-22
 */
export default {
  state: {
    dataList: [
      {
        id: 1234567,
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [121.30527417212659, 31.051864729476065]
        },
        properties: {
          id: 1234567,
          name: '公园1',
          type: '文化服务',
          time: '2024-04-23 01:40:53',
          com: '新华社区',
          uploader: '小明',
          state: 1
        }
      },
      {
        id: 7654321,
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [121.47618803622277, 30.978700667456067]
        },
        properties: {
          id: 7654321,
          name: '地铁口',
          type: '交通服务',
          time: '2024-04-23 01:44:35',
          com: '北京路',
          uploader: '大明',
          state: 1
        }
      }
    ],
    dataModel: {
      id: null,
      type: 'Feature',
      geometry: {
        type: '',
        coordinates: []
      },
      properties: {
        id: null,
        name: '',
        type: '',
        time: '',
        com: '',
        uploader: '',
        state: 1
      }
    }
  },
  mutations: {
    setAuditsCaptureListInfo(state, auditsCaptureInfo) {
      //遍历数据信息
      state.dataModel.id = auditsCaptureInfo.id
      state.dataModel.geometry.type = auditsCaptureInfo.featureType
      state.dataModel.geometry.coordinates[0] = auditsCaptureInfo.lon
      state.dataModel.geometry.coordinates[1] = auditsCaptureInfo.lat
      state.dataModel.properties.id = state.dataModel.id
      state.dataModel.properties.name = auditsCaptureInfo.name
      state.dataModel.properties.type = auditsCaptureInfo.type
      state.dataModel.properties.time = auditsCaptureInfo.time
      state.dataModel.properties.com = auditsCaptureInfo.com
      state.dataModel.properties.uploader = auditsCaptureInfo.uploader
      state.dataList.push(state.dataModel)
      console.log(state.dataList)
    },
    cleanAuditsCaptureListInfo(state) {
      state.dataList.length = 0
    }
  }
}
