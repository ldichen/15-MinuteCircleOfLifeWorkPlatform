import * as echarts from 'echarts'
export function getOption(refName, data) {
  if (refName == 'scoreSegment') {
    // const segmentValues = data.map((item) => item.value)
    // const names = data.map((item) => item.name)
    return {
      title: {
        text: '75', //主标题文本
        subtext: '社区总数', //副标题文本
        left: 'center',
        top: '32%',
        textStyle: {
          fontSize: 32,
          color: '#454c5c',
          align: 'center'
        },
        subtextStyle: {
          fontFamily: '微软雅黑',
          fontSize: 16,
          color: '#6c7a89'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '分段情况',
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: false,
          padAngle: 2,
          itemStyle: {
            normal: {
              borderRadius: 5,
              color: function (colors) {
                var colorList = ['#91cc75', '#73c0de', '#fac858', '#ee6666']
                return colorList[colors.dataIndex]
              }
            }
          },
          label: {
            normal: {
              show: true,
              position: 'outer',
              color: '#4c4a4a',
              formatter:
                '{b|{b}}' + '\n\r' + '{line|————}' + '\n\r' + '{c|{c}个}' + '\n\r' + '{d|{d}%}', //'{total|' + 75 + '}' + '\n\r' + '{active|社区总数}'
              rich: {
                b: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  fontFamily: '微软雅黑',
                  color: '#000',
                  align: 'center'
                },
                c: {
                  fontFamily: '微软雅黑',
                  fontSize: 16,
                  lineHeight: 25,
                  color: '#E6A23C',
                  align: 'center'
                },
                d: {
                  fontFamily: '微软雅黑',
                  fontSize: 16,
                  color: '#409EFF',
                  align: 'center'
                },
                line: {
                  fontFamily: '微软雅黑',
                  // fontSize: 16,
                  color: '#73c0de',
                  align: 'center'
                }
              }
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: data
        }
      ]
    }
  }
  if (refName == 'rank') {
    const rankData = []

    data.map((item) => {
      const tmpData = []
      tmpData.push(item.name)
      tmpData.push(item.value)
      rankData.push(tmpData)
    })
    const richData = {}
    for (let i = 0; i < rankData.length; i++) {
      if (i == 0) {
        richData[`a${rankData.length - i - 1}`] = {
          color: '#fff',
          fontWeight: 'bold',
          backgroundColor: '#a61b29',
          fontSize: 16,
          width: 2,
          height: 2,
          padding: 10,
          align: 'center',
          verticalAlign: 'middle',
          borderRadius: 50
        }
      }
      if (i == 1) {
        richData[`a${rankData.length - i - 1}`] = {
          color: '#fff',
          fontWeight: 'bold',
          backgroundColor: '#f26b1f',
          fontSize: 16,
          width: 2,
          height: 2,
          padding: [10, 10, 10, 10],
          align: 'center',
          verticalAlign: 'middle',
          borderRadius: 50
        }
      }
      if (i == 2) {
        richData[`a${rankData.length - i - 1}`] = {
          color: '#fff',
          fontWeight: 'bold',
          backgroundColor: '#f8bc31',
          fontSize: 16,
          width: 2,
          height: 2,
          padding: [10, 10, 10, 10],
          align: 'center',
          verticalAlign: 'middle',
          borderRadius: 50
        }
      }
      if (i > 2) {
        richData[`a${rankData.length - i - 1}`] = {
          color: '#fff',
          backgroundColor: '#188df0',
          fontSize: 16,
          width: 2,
          height: 2,
          padding: [10, 10, 10, 10],
          align: 'center',
          verticalAlign: 'middle',
          borderRadius: 50
        }
      }
    }

    var yMax = 96
    var dataShadow = []

    // 将实际值显示在阴影柱的label 位置 需要对label 进行处理
    for (var i = 0; i < data.length; i++) {
      dataShadow.push({
        value: yMax,
        name: data[i].name
      })
    }
    return {
      grid: {
        top: '3%',
        left: '1%',
        right: '20%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: { splitLine: { show: false }, axisLabel: { show: false } },
      yAxis: {
        type: 'category',
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          margin: 20,
          formatter: (params, index) => {
            return `{a${index}|${rankData.length - index}}`
          },
          align: 'center', // 文字左排序
          rich: richData
        }
      },
      series: [
        {
          // For shadow
          type: 'bar',
          itemStyle: {
            color: 'rgba(0,0,0,0.05)',
            barBorderRadius: 10
          },
          barGap: '-100%', // 设置背景的关键代码
          barCategoryGap: '40%',
          label: {
            show: true,
            position: 'right',
            color: '#000',

            formatter: function (params) {
              return `{name|${params.name}}`
            },
            rich: {
              name: {
                color: '#000',
                fontSize: 14,
                fontWeight: 'bold'
              }
            }
          },
          data: dataShadow,
          animation: false
        },
        {
          type: 'bar',
          // encode: { x: 'value', y: 'name' },
          datasetIndex: 1,
          arCategoryGap: '50%',
          // showBackground: true,
          // backgroundStyle: { color: '#05315f', borderRadius: [50, 50, 50, 50] },
          itemStyle: {
            color: function (colors) {
              let indexNum = 0
              var colorList = [
                new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  { offset: 0, color: '#f26b1f' },
                  { offset: 1, color: '#a61b29' }
                ]),
                new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  { offset: 0, color: '#f8bc31' },
                  { offset: 1, color: '#f26b1f' }
                ]),
                new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  { offset: 0, color: '#f7da94' },
                  { offset: 1, color: '#f8bc31' }
                ]),
                new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  { offset: 0, color: '#188df0' },
                  { offset: 1, color: '#83bff6' }
                ])
              ]
              if (rankData.length - colors.dataIndex - 1 == 0) {
                indexNum = 0
              }
              if (rankData.length - colors.dataIndex - 1 == 1) {
                indexNum = 1
              }
              if (rankData.length - colors.dataIndex - 1 == 2) {
                indexNum = 2
              }
              if (rankData.length - colors.dataIndex - 1 > 2) {
                indexNum = 3
              }
              return colorList[indexNum]
            },
            borderRadius: [50, 50, 50, 50]
          },
          label: {
            show: true,
            position: 'insideRight',
            color: '#000',

            formatter: function (params) {
              return `{name|${params.value}}`
            },
            rich: {
              name: {
                color: '#000',
                fontSize: 14,
                fontWeight: 'bold',
                align: 'center',
                verticalAlign: 'middle'
              }
            }
          },
          data: data
        }
      ]
    }
  }
  if (refName == 'scores') {
    const values = data.map((item) => item.value)
    return {
      radar: {
        indicator: [
          { name: '日常生活', max: 100 },
          { name: '文体娱乐', max: 100 },
          { name: '公共空间', max: 100 },
          { name: '教育服务', max: 100 },
          { name: '医疗护理', max: 100 },
          { name: '长者照料', max: 100 },
          { name: '社区安全', max: 100 }
        ],
        radius: 80,
        axisName: {
          color: '#000',
          fontWeight: 'bold',
          fontSize: 14
          // padding: [3, 5]
        },
        splitArea: {
          areaStyle: {
            color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)'
          }
        }
      },

      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: values,
              name: 'Allocated Budget'
            }
          ],
          areaStyle: {
            color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
              {
                color: 'rgba(255, 145, 124, 0.1)',
                offset: 0
              },
              {
                color: 'rgba(255, 145, 124, 0.9)',
                offset: 1
              }
            ])
          }
        }
      ]
    }
  }
}
