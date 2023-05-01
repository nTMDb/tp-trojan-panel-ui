<template>
  <div v-show="formVisibleProps">
    <el-form-item
      label="dest"
      prop="xrayStreamSettingsEntity.realitySettings.dest"
    >
      <el-input
        v-model="nodeProps.xrayStreamSettingsEntity.realitySettings.dest"
      />
    </el-form-item>
    <el-form-item
      label="xver"
      prop="xrayStreamSettingsEntity.realitySettings.xver"
    >
      <el-input-number
        v-model="nodeProps.xrayStreamSettingsEntity.realitySettings.xver"
        controls-position="right"
        type="number"
      />
    </el-form-item>
    <el-form-item
      label="serverNames"
      prop="xrayStreamSettingsEntity.realitySettings.serverNames"
    >
      <EditTag
        :dynamic-tags-props="
          nodeProps.xrayStreamSettingsEntity.realitySettings.serverNames
        "
      />
    </el-form-item>
    <el-form-item label="publicKey" prop="realityPbk">
      <el-input v-model="nodeProps.realityPbk" />
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
      <EditTag
        :dynamic-tags-props="
          nodeProps.xrayStreamSettingsEntity.realitySettings.shortIds
        "
        :value-can-empty="true"
      />
    </el-form-item>
  </div>
</template>

<script>
import EditTag from '@/components/EditTag'

export default {
  name: 'XrayFormReality',
  components: {
    EditTag
  },
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