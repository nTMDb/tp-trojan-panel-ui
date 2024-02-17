<template>
  <div v-if="formVisibleProps">
    <el-form-item
      :label="$t('table.xrayProtocol').toString()"
      prop="xrayProtocol"
    >
      <el-select
        v-model="nodeProps.xrayProtocol"
        controls-position="right"
        @change="xrayProtocolChange"
      >
        <el-option
          :label="item"
          :value="item"
          :key="index"
          v-for="(item, index) in xrayProtocols"
        ></el-option>
      </el-select>
    </el-form-item>

    <XrayFormStreamSettings :node-props="nodeProps" />

    <XrayFormSettings
      :node-props="nodeProps"
      :delete-fallback-props="deleteFallbackProps"
      :handle-create-fallback-props="handleCreateFallbackProps"
      :handle-fallback-detail-props="handleFallbackDetailProps"
    />
  </div>
</template>

<script>
import { isXrayShadowsocks, isXraySocks, isXrayVless } from '@/utils/node.js'
import XrayFormStreamSettings from '@/views/node/list/components/XrayFormStreamSettings.vue'
import XrayFormSettings from '@/views/node/list/components/XrayFormSettings.vue'

export default {
  name: 'XrayForm',
  components: {
    XrayFormSettings,
    XrayFormStreamSettings
  },
  props: {
    nodeProps: {
      type: Object,
      require: true
    },
    formVisibleProps: {
      type: Boolean,
      require: true
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
  data() {
    return {
      xrayProtocols: [
        // 'dokodemo-door',
        // 'http',
        'vless',
        'vmess',
        'trojan',
        'shadowsocks',
        'socks'
      ]
    }
  },
  methods: {
    xrayProtocolChange() {
      // 设置默认值
      if (isXrayVless(this.nodeProps)) {
        this.nodeProps.xrayStreamSettingsEntity.security = 'reality'
      } else if (
        isXrayShadowsocks(this.nodeProps) ||
        isXraySocks(this.nodeProps)
      ) {
        this.nodeProps.xrayStreamSettingsEntity.security = 'none'
      } else {
        this.nodeProps.xrayStreamSettingsEntity.security = 'tls'
      }
    }
  }
}
</script>

<style scoped></style>
