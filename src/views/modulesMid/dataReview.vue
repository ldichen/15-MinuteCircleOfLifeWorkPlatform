<template>
  <div class="mid-container">这里是数据审核</div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'

const data = reactive({})
</script>

<style scoped>
.mid-container {
  position: absolute;
  width: calc(100% - 6.5rem);
  z-index: 5;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #1e8df9;
  animation: fade-in 0.5s linear forwards;
  top: 4.5rem;
  right: 0.5rem;
  height: calc(100% - 5rem);
}
</style>
