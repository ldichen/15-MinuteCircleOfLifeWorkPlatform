<template>
  <div class="mid-container">
    <div class="rmheader">
      <el-row :gutter="20">
        <el-col :span="23">
          <div class="mid-header">
            <span class="mid-title">权限管理</span>
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
            <el-button type="primary" size="mini" @click="handleRowAdd">新增用户</el-button>
            <el-button type="primary" size="mini" :disabled="false" @click="handleDelete"
              >批量删除</el-button
            >
            <el-select
              v-model="data.currentSelectItem"
              placeholder="权限类型选择"
              style="width: 10rem; padding-left: 15px"
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
              placeholder="请输入用户名称"
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
          :data="data.userData"
          size="large"
          height="29rem"
          max-height="29rem"
          style="width: 100%"
          row-class-name="rmtable-rows"
          @selection-change="handleSelectionChange"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{
            textAlign: 'center'
          }"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="id" label="序号" width="50" />
          <el-table-column prop="userName" label="用户名称" width="100" />
          <el-table-column prop="userEmail" label="注册邮箱" width="100" />
          <el-table-column prop="rightsType" label="用户权限" width="80" />
          <el-table-column prop="registerTime" sortable label="注册时间" width="120" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <div style="display: flex; justify-content: center; align-items: center">
                <el-select
                  v-model="scope.row.rightsType"
                  placeholder="权限"
                  style="width: 8rem; padding-right: 15px"
                  @change="selectChange"
                  size="default"
                >
                  <el-option
                    v-for="item in data.userRightselectItem"
                    :key="item"
                    :label="item.type"
                    :value="item.type"
                    style="font-size: 1rem"
                  />
                </el-select>
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
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'

const data = reactive({
  currentSelectItem: 'ALL',
  selectItem: [{ type: 'ALL' }, { type: 'ADMIN' }, { type: 'USER' }, { type: 'ROOT' }],
  currentUserRightSelectItem: '',
  userRightselectItem: [{ type: 'ADMIN' }, { type: 'USER' }, { type: 'ROOT' }],
  queryParams: {
    name: null
  },
  userData: [
    {
      id: 1,
      userName: 'zfy',
      userEmail: 'zfy@qq.com',
      rightsType: 'USER',
      registerTime: '2022-12-12 12:12:12'
    },
    {
      id: 2,
      userName: 'cqb',
      userEmail: 'cqb@qq.com',
      rightsType: 'ADMIN',
      registerTime: '2022-12-12 12:12:12'
    },
    {
      id: 3,
      userName: 'yjj',
      userEmail: 'yjj@qq.com',
      rightsType: 'ADMIN',
      registerTime: '2022-12-12 12:12:12'
    },
    {
      id: 4,
      userName: 'zzz',
      userEmail: 'zzz@qq.com',
      rightsType: 'USER',
      registerTime: '2022-12-12 12:12:12'
    },
    {
      id: 5,
      userName: 'zym',
      userEmail: 'zym@qq.com',
      rightsType: 'USER',
      registerTime: '2022-12-12 12:12:12'
    },
    {
      id: 6,
      userName: 'wyj',
      userEmail: 'wyj@qq.com',
      rightsType: 'ADMIN',
      registerTime: '2022-12-12 12:12:12'
    },
    {
      id: 7,
      userName: 'lwh',
      userEmail: 'lwh@qq.com',
      rightsType: 'USER',
      registerTime: '2022-12-12 12:12:12'
    }
  ],
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  pageTotal: 500,
  currentPage: 1
})
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
.rmtable-rows {
  line-height: 2rem;
}
</style>
