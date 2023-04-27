<template>
  <div v-show="formVisibleProps">
    <el-form-item
      label="xver"
      prop="xrayStreamSettingsEntity.realitySettings.dest"
    >
      <el-input
        v-model="nodeProps.xrayStreamSettingsEntity.realitySettings.dest"
      />
    </el-form-item>
    <el-form-item
      label="serverNames"
      prop="xrayStreamSettingsEntity.realitySettings.xver"
    >
      <el-input
        v-model="nodeProps.xrayStreamSettingsEntity.realitySettings.xver"
      />
    </el-form-item>
    <el-form-item
      label="serverNames"
      prop="xrayStreamSettingsEntity.realitySettings.serverNames"
    >
      <el-input
        v-model="nodeProps.xrayStreamSettingsEntity.realitySettings.serverNames"
      />
    </el-form-item>
    <el-form-item
      label="privateKey"
      prop="xrayStreamSettingsEntity.realitySettings.privateKey"
    >
      <el-input
        v-model="nodeProps.xrayStreamSettingsEntity.realitySettings.privateKey"
      />
    </el-form-item>
    <el-form-item
      label="shortIds"
      prop="xrayStreamSettingsEntity.realitySettings.shortIds"
    >
      <el-input
        v-model="nodeProps.xrayStreamSettingsEntity.realitySettings.shortIds"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'XrayFormReality',
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
