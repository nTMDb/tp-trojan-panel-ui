<template>
  <div>
    <el-form-item
      :label="$t('table.xrayStreamSettingsNetwork').toString()"
      prop="xrayStreamSettingsEntity.network"
    >
      <el-select
        v-model="nodeProps.xrayStreamSettingsEntity.network"
        controls-position="right"
        @change="xrayStreamSettingsNetworkChange"
      >
        <el-option
          :label="item"
          :value="item"
          :key="item"
          v-for="item in xrayStreamSettingsNetworks"
        ></el-option>
      </el-select>
    </el-form-item>

    <XrayFormTcp
      :form-visible-props="isXrayTcp(nodeProps)"
      :node-props="nodeProps"
    />

    <XrayFormWebSocket
      :form-visible-props="isXrayWs(nodeProps)"
      :node-props="nodeProps"
    />
  </div>
</template>

<script>
import XrayFormTcp from '@/views/node/list/components/XrayFormTcp.vue'
import XrayFormWebSocket from '@/views/node/list/components/XrayFormWebSocket.vue'
import { isXrayTcp, isXrayWs } from '@/utils/node'

export default {
  name: 'XrayFormNetwork',
  components: { XrayFormWebSocket, XrayFormTcp },
  props: {
    nodeProps: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      xrayStreamSettingsNetworks: [
        'tcp',
        // 'kcp',
        'ws'
        // 'http',
        // 'domainsocket',
        // 'quic',
        // 'grpc'
      ]
    }
  },
  methods: {
    isXrayTcp,
    isXrayWs,
    xrayStreamSettingsNetworkChange() {
      if (this.nodeProps.xrayStreamSettingsEntity.network === 'ws') {
        this.nodeProps.xrayStreamSettingsEntity.security = 'tls'
      }
    }
  }
}
</script>

<style scoped></style>
