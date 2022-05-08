<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('config.configRegister')" name="config-register">
        <register />
      </el-tab-pane>
      <el-tab-pane :label="$t('config.configWebFile')" name="config-web-file">
        <web-file />
      </el-tab-pane>
      <el-tab-pane :label="$t('config.configEmail')" name="config-email">
        <email />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Register from './components/register'
import WebFile from './components/web-file'
import Email from './components/email'

export default {
  name: 'index',
  components: { Register, WebFile, Email },
  data() {
    return {
      activeName: 'config-register'
    }
  },
  methods: {}
}
</script>

<style scoped></style>