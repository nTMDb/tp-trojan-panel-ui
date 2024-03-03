<template>
  <div v-if="formVisibleProps">
    <el-form-item
      label="WebSocketPath"
      prop="xrayStreamSettingsEntity.wsSettings.path"
    >
      <el-input v-model="nodeProps.xrayStreamSettingsEntity.wsSettings.path" />
    </el-form-item>

    <el-form-item
      label="WebSocketHeadersHost"
      prop="xrayStreamSettingsEntity.wsSettings.headers.Host"
    >
      <el-input
        v-model="nodeProps.xrayStreamSettingsEntity.wsSettings.headers.Host"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'XrayFormWebSocket',
  props: {
    nodeProps: {
      type: Object,
      require: true
    },
    formVisibleProps: {
      type: Boolean,
      require: true
    }
  }
}
</script>

<style scoped></style>
