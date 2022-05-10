<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('config.configRegister')" name="config-register">
        <register :system-config="systemConfig" />
      </el-tab-pane>
      <el-tab-pane :label="$t('config.configEmail')" name="config-email">
        <email :system-config="systemConfig" />
      </el-tab-pane>
      <el-tab-pane :label="$t('config.configWebFile')" name="config-web-file">
        <web-file />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Register from './components/register'
import WebFile from './components/web-file'
import Email from './components/email'
import { selectSystemByName } from '@/api/system'

export default {
  name: 'index',
  components: { Register, WebFile, Email },
  data() {
    return {
      activeName: 'config-register',
      systemConfig: {
        emailEnable: 0,
        emailHost: '',
        emailPassword: '',
        emailPort: 0,
        emailUsername: '',
        expireWarnDay: 0,
        expireWarnEnable: 0,
        id: 2,
        openRegister: 1,
        registerExpireDays: 0,
        registerQuota: 0
      }
    }
  },
  created() {
    this.selectDate()
  },
  methods: {
    selectDate() {
      selectSystemByName().then((response) => {
        this.systemConfig = response.data
      })
    }
  }
}
</script>

<style scoped></style>