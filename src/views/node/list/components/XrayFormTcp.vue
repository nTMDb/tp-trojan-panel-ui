<template>
  <div v-if="formVisibleProps">
    <el-form-item
      label="headerType"
      prop="xrayStreamSettingsEntity.tcpSettings.header.type"
    >
      <el-select
        v-model="nodeProps.xrayStreamSettingsEntity.tcpSettings.header.type"
        controls-position="right"
      >
        <el-option
          :label="item"
          :value="item"
          :key="index"
          v-for="(item, index) in headerTypes"
        ></el-option>
      </el-select>
    </el-form-item>
    <div v-if="showTcpSettingsHeaderTypeHttp(nodeProps)">
      <el-form-item
        label="requestPath"
        prop="xrayStreamSettingsEntity.tcpSettings.request.path"
      >
        <EditTag
          :dynamic-tags-props="
            nodeProps.xrayStreamSettingsEntity.tcpSettings.request.path
          "
        />
      </el-form-item>
      <el-form-item
        label="requestHeadersHost"
        prop="xrayStreamSettingsEntity.tcpSettings.request.headers.Host"
      >
        <EditTag
          :dynamic-tags-props="
            nodeProps.xrayStreamSettingsEntity.tcpSettings.request.headers.Host
          "
        />
      </el-form-item>
    </div>
  </div>
</template>

<script>
import EditTag from '@/components/EditTag/index.vue'
import { showTcpSettingsHeaderTypeHttp } from '@/utils/node'

export default {
  name: 'XrayFormTcp',
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
  },
  data() {
    return {
      headerTypes: ['none', 'http']
    }
  },
  methods: { showTcpSettingsHeaderTypeHttp }
}
</script>

<style scoped></style>
