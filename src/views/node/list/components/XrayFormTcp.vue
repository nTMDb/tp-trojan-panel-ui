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
      label="path"
      prop="xrayStreamSettingsEntity.tcpSettings.request.path"
    >
      <el-tag
        v-for="item in nodeProps.xrayStreamSettingsEntity.tcpSettings.request
          .path"
        :key="item"
        type="info"
        closable
      >
        {{ item }}
      </el-tag>
      <el-input
        v-model="pathItem"
        @keyup.enter="
          nodeProps.xrayStreamSettingsEntity.tcpSettings.request.path.push(
            pathItem
          )
        "
        @blur="
          nodeProps.xrayStreamSettingsEntity.tcpSettings.request.path.push(
            pathItem
          )
        "
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
  },
  data() {
    return {
      pathItem: ''
    }
  }
}
</script>

<style scoped></style>
