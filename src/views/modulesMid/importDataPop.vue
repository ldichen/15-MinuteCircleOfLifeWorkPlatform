<template>
  <div>
    <el-dialog
      class="importPop"
      :title="data.title"
      v-model="data.visible"
      width="35%"
      :close-on-click-modal="false"
    >
      <el-form
        label-position="right"
        label-width="auto"
        :model="data.form"
        style="max-width: 600px"
      >
        <div v-if="data.title == '导入数据'">
          <el-form-item
            class="form"
            label="POI数据"
            style="justify-content: center; margin-top: 20px; margin-bottom: unset"
          >
            <el-upload
              class="upload-import"
              ref="fileUpload"
              action="none"
              :file-list="data.filelist"
              :limit="1"
              :on-change="handleChange"
              :auto-upload="false"
              accept=".csv,.xlsx,.xls"
            >
              <template #trigger>
                <el-button type="primary" size="large">选取文件</el-button>
              </template>
              <template #tip>
                <div class="el-upload__tip">请上传.csv,.xlsx,.xls文件</div>
              </template>
            </el-upload>
          </el-form-item>
        </div>
        <div v-if="data.title == '新增数据'">
          <el-form-item
            class="form"
            label="名称："
            style="justify-content: center; margin-top: 20px; margin-bottom: unset"
            ><el-input size="default" />
          </el-form-item>
          <el-form-item
            class="form"
            label="经度："
            style="justify-content: center; margin-top: 20px; margin-bottom: unset"
            ><el-input size="default" />
          </el-form-item>
          <el-form-item
            class="form"
            label="纬度："
            style="justify-content: center; margin-top: 20px; margin-bottom: unset"
            ><el-input size="default" />
          </el-form-item>
          <el-form-item
            class="form"
            label="所属社区："
            style="justify-content: center; margin-top: 20px; margin-bottom: unset"
            ><el-input size="default" />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSubmit" size="large" v-if="!data.isRow">
            立即导入
          </el-button>
          <el-button type="primary" @click="onSubmit" size="large" v-if="data.isRow">
            插入
          </el-button>
          <el-button @click="cancel" size="large">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'

const data = reactive({
  title: '',
  visible: false,
  form: {},
  isRow: false,
  filelist: []
})
const handleChange = (file, fileList) => {
  data.filelist.length = 0
  data.filelist = fileList
}
const handleFileAdd = async () => {
  reset()
  data.isRow = false
  data.visible = true
  data.title = '导入数据'
}
const handleRowAdd = async () => {
  reset()
  data.isRow = true
  data.visible = true
  data.title = '新增数据'
}
const reset = () => {
  //   this.form = {};
  //   this.fileList = [];
  //   //清空验证
  //   if (this.$refs["form"] != undefined) {
  //     // this.$refs['form'].resetFields();
  //     this.$refs["form"].clearValidate();
  //   }
}
defineExpose({ handleFileAdd, handleRowAdd })
</script>

<style scoped>
:deep(.importPop) {
  /* display: flex; */
  /* flex-direction: column; */
  /* margin: 0 !important; */
  /* position: absolute; */
  /* top: 50%; */
  /* left: 50%; */
  /* transform: translate(-50%, -50%); */
  /* max-height: calc(100% - 30px); */
  /* max-width: calc(100% - 30px); */
  /* background-color: rgba(255, 255, 255, 1); */
  border-radius: 6px;
}
:deep(.el-dialog__header) {
  text-align: center;
}
:deep(.form .el-form-item__content) {
  /* align-items: unset !important;
  flex-direction: column; */
  flex: unset;
}
.el-input {
  width: 10rem;
}
</style>
