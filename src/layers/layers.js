import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'

var tk = '9f96691cc73d1dbde94de64b78d35bc2'
let tiandilayers = [
  new TileLayer({
    title: '矢量图',
    source: new XYZ({
      crossOrigin: 'anonymous',
      url: 'https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + tk
    })
  }),
  new TileLayer({
    title: '标注',
    source: new XYZ({
      url: 'http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + tk
    }),
    zIndex: 2
  })
]
export default tiandilayers
