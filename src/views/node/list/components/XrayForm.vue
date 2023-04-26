<template>
  <div v-show="formVisibleProps">
    <el-form-item
      :label="$t('table.xrayProtocol').toString()"
      prop="xrayProtocol"
    >
      <el-select v-model="nodeProps.xrayProtocol" controls-position="right">
        <el-option
          :label="item"
          :value="item"
          :key="index"
          v-for="(item, index) in xrayProtocols"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('table.xrayStreamSettingsNetwork').toString()"
      prop="xrayStreamSettingsEntity.network"
      v-show="!isXrayShadowsocks(nodeProps)"
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
      :label="$t('table.xrayStreamSettingsWsSettingsPath').toString()"
      prop="xrayStreamSettingsEntity.wsSettings.path"
      v-show="isXrayWs(nodeProps) && !isXrayShadowsocks(nodeProps)"
    >
      <el-input v-model="nodeProps.xrayStreamSettingsEntity.wsSettings.path" />
    </el-form-item>
    <el-form-item
      :label="$t('table.xrayStreamSettingsSecurity').toString()"
      prop="xrayStreamSettingsEntity.security"
      v-show="!isXrayShadowsocks(nodeProps)"
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
    <el-form-item
      :label="$t('table.xrayFlow').toString()"
      prop="xrayFlow"
      v-show="showXrayFlow(nodeProps)"
    >
      <el-select v-model="nodeProps.xrayFlow" controls-position="right">
        <el-option
          :label="item"
          :value="item"
          :key="index"
          v-for="(item, index) in xrayFlows"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('table.xraySSMethod').toString()"
      prop="xraySSMethod"
      v-show="isXrayShadowsocks(nodeProps)"
    >
      <el-select v-model="nodeProps.xraySSMethod" controls-position="right">
        <el-option
          :label="item"
          :value="item"
          :key="index"
          v-for="(item, index) in xraySSMethods"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('table.xraySSNetwork').toString()"
      prop="xraySettingsEntity.network"
      v-show="isXrayShadowsocks(nodeProps)"
    >
      <el-select
        v-model="nodeProps.xraySettingsEntity.network"
        controls-position="right"
      >
        <el-option
          :label="item"
          :value="item"
          :key="index"
          v-for="(item, index) in xraySettingsNetworks"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('table.xrayFallbacks').toString()"
      prop="xraySettingsEntity.fallbacks"
      v-show="showFallback(nodeProps)"
    >
      <el-tag
        v-for="(item, index) in nodeProps.xraySettingsEntity.fallbacks"
        :key="index"
        :disable-transitions="true"
        type="success"
        @close="deleteFallbackProps(item)"
        effect="dark"
        size="medium"
        closable
        @click="handleFallbackDetailProps(item)"
      >
        {{ item.dest }}
      </el-tag>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click="handleCreateFallbackProps"
      ></el-button>
    </el-form-item>
  </div>
</template>

<script>
import FallbackInfo from '@/views/node/list/components/FallbackInfo'
import FallbackForm from '@/views/node/list/components/FallbackForm'

import {
  isXrayShadowsocks,
  isXrayWs,
  showFallback,
  showXrayFlow
} from '@/utils/node.js'

export default {
  name: 'XrayForm',
  components: { FallbackInfo, FallbackForm },
  props: {
    nodeProps: {
      type: Object,
      require: true
    },
    formVisibleProps: {
      type: Boolean,
      require: true
    },
    getListProps: {
      type: Function,
      required: true
    },
    handleCreateFallbackProps: {
      type: Function,
      required: true
    },
    handleFallbackDetailProps: {
      type: Function,
      required: true
    },
    deleteFallbackProps: {
      type: Function,
      required: true
    }
  },
  computed: {
    xrayStreamSettingsSecuritys() {
      let securitys = ['none', 'tls']
      if (this.isXrayVlessProps(this.nodeProps)) {
        securitys.push('reality')
      }
      return securitys
    },
    xrayFlows() {
      return ['none', 'xtls-rprx-vision']
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
      ],
      xraySettingsNetworks: ['tcp', 'udp', 'tcp,udp'],
      xraySSMethods: [
        'none',
        'aes-128-gcm',
        'aes-256-gcm',
        'chacha20-poly1305',
        'xchacha20-poly1305'
      ],
      xrayProtocols: [
        // 'dokodemo-door',
        // 'http',
        // 'socks',
        'vless',
        'vmess',
        'trojan',
        'shadowsocks'
      ]
    }
  },
  methods: {
    isXrayShadowsocks,
    showFallback,
    showXrayFlow,
    isXrayWs,
    xrayStreamSettingsNetworkChange() {
      if (this.nodeProps.xrayStreamSettingsEntity.network === 'ws') {
        this.nodeProps.xrayStreamSettingsEntity.security = 'tls'
      }
    },
    xrayStreamSettingsSecurityChange() {
      if (
        this.isXrayVlessProps(this.nodeProps) &&
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

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
