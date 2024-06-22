<!--
 * @Author: DiChen
 * @Date: 2024-06-20 10:40:28
 * @LastEditors: DiChen
 * @LastEditTime: 2024-06-21 14:24:50
-->
<template>
  <div class="lonlat-container">
    <el-form
      ref="form"
      :model="data.form"
      :rules="data.rules"
      label-position="top"
      :hide-required-asterisk="true"
    >
      <!-- <span></span> -->
      <el-form-item label="经度" prop="lon" class="lonlat-input">
        <el-input type="number" placeholder="121.397428" v-model.number="data.form.lon"> </el-input>
      </el-form-item>
      <el-form-item label="维度" prop="lat" class="lonlat-input">
        <el-input type="number" placeholder="31.15923" v-model.number="data.form.lat"> </el-input>
      </el-form-item>
    </el-form>
  </div>
  <div class="routing-container">
    <div><span style="line-height: 2rem; margin-left: 1rem">模式选择</span></div>
    <el-radio-group v-model="data.radio">
      <el-radio :value="1">驾驶模式</el-radio>
      <el-radio :value="3">步行模式</el-radio>
      <el-radio :value="4">骑行模式</el-radio>
    </el-radio-group>
  </div>
  <div class="point-scores"></div>
</template>

<script setup>
import { reactive, toRefs, watch, onMounted } from 'vue'
const emits = defineEmits(['setMarkerLngLat'])
const props = defineProps(['lngLat'])
const data = reactive({
  form: {
    lon: 121.397428,
    lat: 31.15923
  },
  rules: {
    lon: [
      { required: true, message: '请输入经度值', trigger: 'change' },
      {
        pattern:
          /^[+-]?(?:180(?:\.0{1,7})?|(?:1[0-7]\d(?:\.\d{1,7})?)|(?:[1-9]?\d(?:\.\d{1,7})?)|(?:\d(?:\.\d{1,7})?))$/,
        message: '无效值',
        trigger: 'change'
      }
    ],
    lat: [
      { required: true, message: '请输入纬度值', trigger: 'change' },
      {
        pattern: /^[+-]?(?:90(?:\.0{1,7})?|(?:[1-8]?\d(?:\.\d{1,7})?)|(?:\d(?:\.\d{1,7})?))$/,
        message: '无效值',
        trigger: 'change'
      }
    ]
  },
  radio: 3
})
onMounted(() => {
  onLoad()
})

// const propsStatus = onComputed(() => {
//   if()
// })
const onLoad = () => {
  //经纬度输入框的变化监听，变化则发送给父组件
  watch([() => data.form.lon, () => data.form.lat], (newValue) => {
    // if (data.form.lon != props.lngLat[0] || data.form.lat != props.lngLat[1]) {
    emits('setMarkerLngLat', data.form, data.radio)
    // }
  })
  //父组件marker经纬度传递变化监听，变化则更新输入框
  watch([() => props.lngLat[0], () => props.lngLat[1]], (newValue, oldValue) => {
    // if (data.form.lon != props.lngLat[0] || data.form.lat != props.lngLat[1]) {
    data.form.lon = Number(newValue[0])
    data.form.lat = Number(newValue[1])
    // emits('setMarkerLngLat', data.form, data.radio)
    // }
  })
}
</script>

<style scoped>
.lonlat-container {
  margin: 0.5rem 1rem 0.5rem 1rem;
  height: 4rem;
  width: 18rem;
  /* background-color: antiquewhite; */
}
.el-form {
  display: flex;
  justify-content: center;
}
:deep(.el-form-item__label) {
  margin-bottom: unset !important;
}
.lonlat-input {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  width: 8rem;
}
:deep(.el-input__wrapper) {
  border: 1px solid #909399;
}
.routing-container {
  display: flex;
  flex-direction: column;
  height: 8rem;
  width: 18rem;
  margin: 0rem 1rem 0.5rem 1rem;
  /* background-color: antiquewhite; */
}
:deep(.el-radio-group) {
  flex-direction: column;
  align-items: unset !important;
}
:deep(.el-radio) {
  margin-right: unset !important;
  margin-left: 1rem;
}
:deep(.el-radio__inner) {
  border: 1px solid #909399;
}
.point-scores {
  height: 4rem;
  width: 18rem;
  /* background-color: antiquewhite; */
}
</style>
