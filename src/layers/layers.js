var tk = '9f96691cc73d1dbde94de64b78d35bc2'
let cva = { id: 'cva', url: 'http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + tk }
let vec = {
  id: 'vec',
  url: 'https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + tk
}
let tiandilayers = [vec, cva]
export default tiandilayers
