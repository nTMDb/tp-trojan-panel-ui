<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="新用户设置" name="config-register">
        <register />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import register from './components/register'

export default {
  name: 'index',
  components: { register },
  data() {
    return {
      activeName: 'config-register'
    }
  },
  methods: {}
}
</script>

<style scoped></style>
