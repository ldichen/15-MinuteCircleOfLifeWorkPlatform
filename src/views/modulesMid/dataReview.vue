<template>
  <div class="mid-container">
    <div class="drheader">
      <el-row :gutter="20">
        <el-col :span="23">
          <div class="mid-header">
            <span class="mid-title">数据审核</span>
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
          :data="data.ReviewData"
          size="large"
          height="29rem"
          max-height="29rem"
          style="width: 100%"
          row-class-name="drtable-rows"
          @selection-change="handleSelectionChange"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{
            textAlign: 'center'
          }"
        >
          <el-table-column prop="id" label="序号" width="50" />
          <el-table-column prop="name" label="名称" width="100" />
          <el-table-column prop="lon" label="经度" width="80" />
          <el-table-column prop="lat" label="纬度" width="80" />
          <el-table-column prop="uploader" label="上传者" width="80" />
          <el-table-column prop="community" label="所属社区" width="100" />
          <el-table-column prop="time" sortable label="时间" width="120" />
          <el-table-column sortable label="状态" width="120"
            ><template #default="scope">
              <el-tag type="warning" size="large">{{
                scope.row.status == 1 ? '审核中···' : '已审核'
              }}</el-tag></template
            ></el-table-column
          >
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <div style="display: flex; justify-content: center; align-items: center">
                <el-button type="primary" size="default" plain>定位</el-button>
                <el-button
                  v-if="
                    store.state.userInfo.dataList[0].username == 'root' ||
                    store.state.userInfo.dataList[0].username == 'admin'
                  "
                  type="success"
                  size="default"
                  plain
                  @click="reviewClick(scope.row)"
                  >通过</el-button
                >
                <el-button type="danger" size="default" plain>{{
                  store.state.userInfo.dataList[0].username == 'root' ||
                  store.state.userInfo.dataList[0].username == 'admin'
                    ? '退回'
                    : '撤回'
                }}</el-button>
              </div>
              <!-- <div
                v-if="store.state.userInfo.dataList[0].username == 'user'"
                style="display: flex; justify-content: center; align-items: center"
              >
                <el-button type="danger" size="default" plain>撤回</el-button>
              </div> -->
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
    <!-- <el-drawer v-model="data.drawerShow" :direction="direction">
      <template #header>
        <span style="font-size: 1.5rem; font-weight: bold">审核</span>
      </template>
      <template #default>
        <div>
          <el-radio v-model="radio1" value="Option 1" size="large"> Option 1 </el-radio>
          <el-radio v-model="radio1" value="Option 2" size="large"> Option 2 </el-radio>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">cancel</el-button>
          <el-button type="primary" @click="confirmClick">confirm</el-button>
        </div>
      </template>
    </el-drawer> -->
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import store from '@/store'
const emits = defineEmits(['drLeave'])
const data = reactive({
  userType: ['ADMIN', 'ROOT', 'USER'],
  queryParams: {
    name: null
  },
  drawerShow: false,
  currentSelectItem: '娱乐服务',
  selectItem: [
    { type: '娱乐服务' },
    { type: '生活服务' },
    { type: '体育服务' },
    { type: '文化服务' },
    { type: '医疗服务' },
    { type: '交通服务' }
  ],
  ReviewData: [
    {
      id: 1,
      name: '世纪公园',
      lon: 116.401,
      lat: 39.921,
      uploader: '张三',
      community: '新华街道',
      time: '2022-12-12 12:12:12',
      status: 1
    },
    {
      id: 2,
      name: '长风公园',
      lon: 116.401,
      lat: 39.921,
      uploader: 'ldc',
      community: '大宁路街道',
      time: '2022-12-12 12:12:12',
      status: 1
    }
  ],
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  pageTotal: 500,
  currentPage: 1
})

//弹出审核页面
const reviewClick = (row) => {
  data.drawerShow = true
}
//退出审核页面
const closePop = () => {
  emits('drLeave', 'drShow')
}
</script>

<style scoped>
@import '@/assets/workPlatform.css';
@import '@/assets/table.css';
.drheader {
  padding-bottom: 20px;
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
:deep(.drtable-rows) {
  line-height: 2rem;
  color: black !important;
}
:deep(.el-drawer) {
  top: 4.5rem !important;
  right: 0.5rem !important;
  height: calc(100% - 5rem) !important;
  border-radius: 6px 6px 6px 6px !important;
  /* border: 1px solid #1e8df9 !important; */
}
:deep(.el-drawer__header) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3) !important;
  margin-bottom: unset !important;
  padding-bottom: 10px !important;
}
</style>
