<template>
  <div class="mid-container">
    <div class="dmheader">
      <el-row :gutter="20">
        <el-col :span="23">
          <div class="mid-header">
            <span class="mid-title">数据管理</span>
          </div>
        </el-col>
        <el-col :span="1">
          <img class="mid-close" src="@/assets/images/close.png" @click="closePop" />
        </el-col>
      </el-row>
    </div>
    <div class="dmTable">
      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="12" style="padding-left: 30px">
            <el-button type="primary" size="mini" @click="handleRowAdd">新增</el-button>
            <el-button type="primary" size="mini" @click="handleFileAdd">文件导入</el-button>
            <el-button type="primary" size="mini" :disabled="false" @click="handleDelete"
              >批量删除</el-button
            >
            <el-select
              v-model="data.currentSelectItem"
              placeholder="类型选择"
              style="width: 15rem; padding-left: 15px"
              @change="selectChange"
              size="default"
            >
              <el-option
                v-for="item in data.selectItem"
                :key="item"
                :label="item.type"
                :value="item.type"
                style="font-size: 1rem"
              />
            </el-select>
          </el-col>
          <el-col :span="12" style="display: flex; justify-content: end">
            <el-input
              v-model="data.queryParams.name"
              placeholder="请输入地点名称"
              class="table-operator-input"
              size="mini"
              clearable
            ></el-input>
            <el-button type="primary" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" size="mini" @click="handleRest">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 表单 -->
      <div style="padding: 20px; height: calc(100% - 140px)">
        <el-table
          :data="data.poiData"
          size="large"
          height="29rem"
          max-height="29rem"
          style="width: 100%"
          row-class-name="dmtable-rows"
          @selection-change="handleSelectionChange"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{
            textAlign: 'center'
          }"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="id" label="序号" width="50" />
          <el-table-column prop="name" label="名称" width="100" />
          <el-table-column prop="lon" label="经度" width="80" />
          <el-table-column prop="lat" label="纬度" width="80" />
          <el-table-column prop="uploader" label="上传者" width="80" />
          <el-table-column prop="community" label="所属社区" width="100" />
          <el-table-column prop="time" sortable label="时间" width="120" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <div style="display: flex; justify-content: center; align-items: center">
                <el-button type="primary" size="default" plain>定位</el-button>
                <el-button type="success" size="default" plain @click="delolyClick(scope.row)"
                  >详情</el-button
                >
                <el-button type="danger" size="default">删除</el-button>
              </div>
            </template></el-table-column
          >
        </el-table>
      </div>
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="data.currentPage"
          v-model:page-size="data.pageSize"
          :page-sizes="data.pageSizes"
          :background="true"
          :hide-on-single-page="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="data.pageTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <importDataPop ref="importPop"></importDataPop>
  </div>
</template>

<script setup>
import { reactive, toRefs, ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getOption } from '@/components/echarts/workplatformchart.js'
import importDataPop from './importDataPop.vue'
const data = reactive({
  show: false,
  queryParams: {
    name: null
  },
  currentSelectItem: '娱乐服务',
  selectItem: [
    { type: '娱乐服务' },
    { type: '生活服务' },
    { type: '体育服务' },
    { type: '文化服务' },
    { type: '医疗服务' },
    { type: '交通服务' }
  ],
  scoreType: [
    { name: '日常生活', value: 90 },
    { name: '文体娱乐', value: 20 },
    { name: '公共空间', value: 30 },
    { name: '教育服务', value: 40 },
    { name: '医疗护理', value: 50 }
  ],
  poiData: [],
  Park: [
    {
      id: 1,
      name: '世纪公园',
      lon: 116.401,
      lat: 39.921,
      uploader: '张三',
      community: '新华街道',
      time: '2022-12-12 12:12:12'
    },
    {
      id: 2,
      name: '长风公园',
      lon: 116.401,
      lat: 39.921,
      uploader: 'ldc',
      community: '大宁路街道',
      time: '2022-12-12 12:12:12'
    },
    {
      id: 3,
      name: '顾村公园',
      lon: 116.401,
      lat: 39.921,
      uploader: '李四',
      community: '四平街道',
      time: '2022-12-12 12:12:12'
    },
    {
      id: 4,
      name: '月湖雕塑公园',
      lon: 116.401,
      lat: 39.921,
      uploader: '王五',
      community: '临汾社区',
      time: '2022-12-12 12:12:12'
    },
    {
      id: 5,
      name: '闵行体育公园',
      lon: 116.401,
      lat: 39.921,
      uploader: '钱六',
      community: '仙霞新村',
      time: '2022-12-12 12:12:12'
    }
  ],
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  pageTotal: 500,
  currentPage: 1
})
const importPop = ref(null)

const emits = defineEmits(['dmLeave'])
const click = () => {
  data.show = true
}
onMounted(() => {
  getList()
  selectChange()
})
const getList = () => {}

const selectChange = () => {
  data.poiData.length = 0
  if (data.currentSelectItem == '娱乐服务') {
    data.Park.forEach((item) => {
      data.poiData.push(item)
    })
  }
}
// 搜索
const handleQuery = () => {
  if (data.queryParams.name) {
    data.poiData = data.poiData.filter((item) => {
      if (item.name == data.queryParams.name) {
        return item
      }
    })
  }
}
const closePop = () => {
  emits('dmLeave', 'dmShow')
}

// 重置
const handleRest = () => {
  data.queryParams.name = null
  selectChange()
}
const handleFileAdd = () => {
  importPop.value.handleFileAdd()
}
const handleRowAdd = () => {
  importPop.value.handleRowAdd()
}
</script>

<style scoped>
@import '@/assets/workPlatform.css';
@import '@/assets/table.css';
.dmheader {
  padding-bottom: 20px;
}
.table-operator {
  display: flex;
  padding: 5px 0 10px 0;
}
.table-operator-input {
  width: 220px;
  padding-right: 10px;
}
.demo-pagination-block {
  display: flex;
  justify-content: center;
  /* margin-top: 1rem; */
}
.dmtable-rows {
  line-height: 2rem;
}
</style>
