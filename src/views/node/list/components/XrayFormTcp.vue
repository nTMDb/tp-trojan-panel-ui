<template>
  <div v-if="formVisibleProps">
    <el-form-item
      label="headerType"
      prop="xrayStreamSettingsEntity.tcpSettings.header.type"
    >
      <el-input
        v-model="nodeProps.xrayStreamSettingsEntity.tcpSettings.header.type"
      />
    </el-form-item>
    <el-form-item
      label="Host"
      prop="xrayStreamSettingsEntity.tcpSettings.request.headers.Host"
    >
      <el-input
        v-model="
          nodeProps.xrayStreamSettingsEntity.tcpSettings.request.headers.Host
        "
      />
    </el-form-item>
    <el-form-item
      label="path"
      prop="xrayStreamSettingsEntity.tcpSettings.request.path"
    >
      <el-input
        v-model="nodeProps.xrayStreamSettingsEntity.tcpSettings.request.path"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'XrayFormTcp',
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
