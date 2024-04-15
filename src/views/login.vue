<template>
  <div class="login">
    <div class="login-left">
      <div class="login__title"><span>15分钟生活圈工作平台</span></div>
      <img src="~@/assets/images/login.png" alt="login" class="login-left__img" />
    </div>
    <div class="login-right">
      <el-form ref="form" :model="data.form" :rules="data.rules" class="login-box">
        <h3 class="login-title">欢迎登录</h3>
        <el-form-item label="" prop="username">
          <el-input
            prefix-icon="User"
            type="text"
            placeholder="请输入用户名"
            v-model="data.form.username"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="data.form.password"
            show-password
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中 ...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="login-footer">
      <span>Copyright © 2024 南京师范大学地理科学学院</span>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElNotification } from 'element-plus'
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const data = reactive({
  form: {
    username: 'admin',
    password: '123456'
  },
  rules: {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
    ]
  },
  loading: false
})
const form = ref(null)
const router = useRouter()
const submitForm = () => {
  form.value.validate((valid) => {
    if (valid) {
      data.loading = true
      //发送请求
      ElNotification({
        title: 'Success',
        message: '登录成功，欢迎回来！',
        type: 'success',
        duration: 3000,
        zIndex: 9999
      })
      router.push({ name: 'WorkPlatform' })
    } else {
      ElMessage.warning('用户名或密码错误!')
    }
    console.log('校验结果', valid)
  })
}
</script>

<style scoped>
.login {
  position: relative;
  padding: 0 9%;
  /* width: 100vw; */
  height: 100vh;
  background: url('../assets/images/background.png') no-repeat;
  background-size: cover;
}
.login__title {
  margin-bottom: 42px;
  font-size: 42px;
  display: flex;
  justify-content: center;
  font-weight: bolder;
  color: #409eff; /*#1fcac4; */
}
.login-title {
  text-align: center;
  color: #409eff;
}
.el-button {
  width: 100%;
  height: 35px;
}
.el-form-item {
  margin-bottom: 40px;
}
:deep(.el-input__icon) {
  color: #409eff;
}
:deep(.el-input__inner) {
  height: 40px !important;
}
.login-left {
  position: absolute;
  top: 50%;
  right: calc(9% + 430px);
  left: 9%;
  transform: translateY(-50%);
}
.login-left__img {
  display: block;
  max-width: 100%;
}
.login-right {
  position: absolute;
  top: 50%;
  right: 9%;
  overflow: hidden;
  margin-left: -190px;
  border-radius: 10px;
  padding: 50px 38px 60px;
  width: 310px;
  background: #fff;
  box-shadow: 11px 13px 30px 0 rgba(69, 122, 188, 0.16);
  transform: translateY(-50%);
}
.login-footer {
  position: fixed;
  bottom: 24px;
  left: 0;
  width: 100%;
  font-size: 14px;
  text-align: center;
  color: rgba(0, 0, 0, 0.4);
  line-height: 22px;
}
</style>
