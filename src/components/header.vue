<template>
  <el-header class="header">
    <div class="header-wrapper">
      <div id="header-title">
        <div>15分钟生活圈工作平台</div>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { reactive, toRefs } from 'vue'

const data = reactive({})
</script>
<!-- 62, 221, 139
112, 200, 156 -->
<style scoped>
.header {
  position: absolute;
  z-index: 999;
  width: 100%;
  opacity: 0.8;
}
.header-wrapper {
  height: 4rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: rgba(112, 200, 156, 1);
  background: url('../assets/images/title.png') no-repeat center center;
}

#header-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: bold;
  color: #fff;
}
</style>
