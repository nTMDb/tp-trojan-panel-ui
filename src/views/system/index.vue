<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="新用户设置" name="config-register">
        <register />
      </el-tab-pane>
      <el-tab-pane label="自定义伪装网站" name="config-web-file">
        <web-file />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Register from './components/register'
import WebFile from './components/web-file'

export default {
  name: 'index',
  components: { Register, WebFile },
  data() {
    return {
      activeName: 'config-register'
    }
  },
  methods: {}
}
</script>

<style scoped></style>
