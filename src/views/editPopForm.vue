<template>
  <div class="editPopForm" id="editPopForm">
    <div v-if="data.mountType == 0" class="edit">
      <div class="editPopForm-title"><span>添加信息</span></div>
      <el-form
        ref="form"
        label-position="right"
        label-width="auto"
        :rules="data.rules"
        :model="data.form"
        style="max-width: 600px"
      >
        <div>
          <el-form-item
            class="form"
            label="名称："
            prop="name"
            style="justify-content: center; margin-top: 20px; margin-bottom: unset"
            ><el-input size="default" v-model="data.form.name" />
          </el-form-item>
          <el-form-item
            class="form"
            label="类别："
            prop="type"
            style="justify-content: center; margin-top: 20px; margin-bottom: unset"
          >
            <el-select
              v-model="data.form.type"
              placeholder="类型选择"
              style="width: 150px"
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
          </el-form-item>
          <el-form-item
            class="form"
            label="所属社区："
            prop="com"
            style="justify-content: center; margin-top: 20px; margin-bottom: unset"
            ><el-input size="default" v-model="data.form.com" />
          </el-form-item>
        </div>
      </el-form>
      <div class="popFooter">
        <el-button type="primary" @click="onSubmit" size="large"> 提交审核 </el-button>
        <el-button @click="onCancel" type="danger" size="large">删除</el-button>
      </div>
    </div>
    <div class="read" v-if="data.mountType == 1">
      <div class="editPopForm-title">
        <span>{{ props.editInfo.properties.name }}</span>
      </div>
      <el-descriptions column="1" class="infoDescriptions">
        <el-descriptions-item label="服务类型：">{{
          props.editInfo.properties.type
        }}</el-descriptions-item>
        <el-descriptions-item label="所属社区：">{{
          props.editInfo.properties.com
        }}</el-descriptions-item>
        <el-descriptions-item label="上传时间：">{{
          props.editInfo.properties.time
        }}</el-descriptions-item>
        <el-descriptions-item label="上传者：">{{
          props.editInfo.properties.uploader
        }}</el-descriptions-item>
        <el-descriptions-item label="坐标信息：">{{
          props.editInfo.geometry.coordinates[0].toFixed(4) +
          ' , ' +
          props.editInfo.geometry.coordinates[0].toFixed(4)
        }}</el-descriptions-item>
      </el-descriptions>
      <div class="popFooter">
        <span style="color: #95d475; font-size: 1rem; font-family: 'PingFang SC'"
          >审 核 中··· ···</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue'
import store from '@/store'
import { ElMessage, ElNotification } from 'element-plus'
// import { ElForm, ElFormItem, ElInput, ElButton, ElSelect, ElFooter, ElOption } from 'element-plus'
// import 'element-plus/dist/index.css'
const props = defineProps(['editInfo'])
const emits = defineEmits(['popCancel', 'popSubmit'])
onMounted(() => {
  console.log(props.editInfo)
  initData()
})
const data = reactive({
  selectItem: [
    { type: '娱乐服务' },
    { type: '生活服务' },
    { type: '体育服务' },
    { type: '文化服务' },
    { type: '医疗服务' },
    { type: '交通服务' }
  ],
  currentSelectItem: '',
  form: {
    id: '',
    name: '',
    type: '',
    featureType: 'Point',
    com: '',
    time: '',
    lon: null,
    lat: null,
    uploader: '',
    state: 0
  },
  rules: {
    name: [
      { required: true, message: '请输入地点名称', trigger: 'blur' }
      // { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请选择类型', trigger: 'change' }
      // { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    com: [
      { required: true, message: '请输入所属社区', trigger: 'blur' }
      // { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
    ]
  },
  mountType: 0
})
const form = ref(null)

// 初始化数据
const initData = () => {
  console.log('test')
  if (props.editInfo.state == 0) {
    data.form.name = ''
    data.form.type = ''
    data.form.com = ''
    data.form.id = props.editInfo.id
    data.form.time = props.editInfo.editTime
    data.form.lon = props.editInfo.editLngLat[0]
    data.form.lat = props.editInfo.editLngLat[1]
    data.form.uploader = ''
    data.form.state = 0
  } else {
    data.mountType = 1
  }
}

//提交表单
const onSubmit = () => {
  //验证表单
  form.value.validate((valid) => {
    if (valid) {
      //发送请求
      //临时存储
      console.log(data.form)
      store.commit('setAuditsCaptureListInfo', data.form)
      ElMessage({
        message: '提交成功，审核中...',
        type: 'success',
        offset: 100
      })
      emits('popSubmit')
    } else {
      ElMessage({
        message: '提交失败，请稍后重试!',
        type: 'warning',
        offset: 100
      })
    }
    console.log('校验结果', valid)
  })
  //提交
}
//取消并删除节点
const onCancel = () => {
  emits('popCancel')
  //清除表单信息
}
</script>

<style scoped>
.editPopForm {
  display: flex;
  flex-direction: column;
  margin: 1rem;
}
.editPopForm-title {
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
}
.infoDescriptions {
  max-width: 600px;
  margin: 10px;
}
.popFooter {
  display: flex;
  margin-top: 1rem;
  justify-content: center;
}
:deep(.form .el-form-item__content) {
  /* align-items: unset !important;
  flex-direction: column; */
  flex: unset;
}
:deep(.el-input) {
  width: 150px;
}
</style>
