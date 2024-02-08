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

    <el-form-item
      :label="$t('table.xrayStreamSettingsSecurity').toString()"
      prop="xrayStreamSettingsEntity.security"
      v-if="!isXrayShadowsocks(nodeProps)"
    >
      <el-select
        v-model="nodeProps.xrayStreamSettingsEntity.security"
        controls-position="right"
        @change="xrayStreamSettingsSecurityChange"
      >
        <el-option
          :label="item"
          :value="item"
          :key="item"
          v-for="item in xrayStreamSettingsSecuritys"
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
import XrayFormWebSocket from '@/views/node/list/components/XrayFormWebSocket.vue'
import XrayFormTcp from '@/views/node/list/components/XrayFormTcp.vue'
import {
  isXrayShadowsocks,
  isXrayTcp,
  isXrayTrojan,
  isXrayVless,
  isXrayWs
} from '@/utils/node'

export default {
  name: 'XrayFormStreamSettings',
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
  computed: {
    xrayStreamSettingsSecuritys() {
      let securitys = ['none', 'tls']
      if (isXrayVless(this.nodeProps)) {
        securitys.push('reality')
      }
      if (isXrayTrojan(this.nodeProps)) {
        for (let i = 0; i < securitys.length; i++) {
          if (securitys[i] === 'none') {
            securitys.splice(i, 1)
          }
        }
      }
      return securitys
    }
  },
  methods: {
    isXrayShadowsocks,
    isXrayTcp,
    isXrayWs,
    xrayStreamSettingsNetworkChange() {
      if (this.nodeProps.xrayStreamSettingsEntity.network === 'ws') {
        this.nodeProps.xrayStreamSettingsEntity.security = 'tls'
      }
    },
    xrayStreamSettingsSecurityChange() {
      if (
        isXrayVless(this.nodeProps) &&
        (this.nodeProps.xrayStreamSettingsEntity.security === 'tls' ||
          this.nodeProps.xrayStreamSettingsEntity.security === 'reality')
      ) {
        this.nodeProps.xrayFlow = 'xtls-rprx-vision'
      } else {
        this.nodeProps.xrayFlow = 'none'
      }
    }
  }
}
</script>

<style scoped></style>
