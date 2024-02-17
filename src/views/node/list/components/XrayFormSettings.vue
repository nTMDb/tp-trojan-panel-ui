<template>
  <div>
    <el-form-item
      :label="$t('table.xrayFlow').toString()"
      prop="xrayFlow"
      v-if="showXrayFlow(nodeProps)"
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
      :label="$t('table.xrayFallbacks').toString()"
      prop="xraySettingsEntity.fallbacks"
      v-if="showFallback(nodeProps)"
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

    <el-form-item
      :label="$t('table.xraySSMethod').toString()"
      prop="xraySSMethod"
      v-if="
        isXrayShadowsocks(nodeProps) ||
        isXrayShadowsocksAEAD(nodeProps) ||
        isXrayShadowsocks2022(nodeProps)
      "
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
      v-if="
        isXrayShadowsocksAEAD(nodeProps) || isXrayShadowsocks2022(nodeProps)
      "
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
      :label="$t('table.xraySocksUser').toString()"
      prop="xraySettingsEntity.accounts[0].user"
      v-if="isXraySocks(nodeProps)"
    >
      <el-input v-model="nodeProps.xraySettingsEntity.accounts[0].user" />
    </el-form-item>

    <el-form-item
      :label="$t('table.xraySocksPass').toString()"
      prop="xraySettingsEntity.accounts[0].pass"
      v-if="isXraySocks(nodeProps)"
    >
      <el-input v-model="nodeProps.xraySettingsEntity.accounts[0].pass" />
    </el-form-item>

    <el-form-item
      :label="$t('table.xraySocksUdp').toString()"
      prop="xraySettingsEntity.udp"
      v-if="isXraySocks(nodeProps)"
    >
      <el-switch
        v-model="nodeProps.xraySettingsEntity.udp"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-text="$t('table.enable').toString()"
        :inactive-text="$t('table.disable').toString()"
        :active-value="true"
        :inactive-value="false"
      >
      </el-switch>
    </el-form-item>
  </div>
</template>

<script>
import {
  isXrayShadowsocks,
  isXrayShadowsocks2022,
  isXrayShadowsocksAEAD,
  isXraySocks,
  showFallback,
  showXrayFlow
} from '@/utils/node'

export default {
  name: 'XrayFormSettings',
  props: {
    nodeProps: {
      type: Object,
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
  computed: {
    xrayFlows() {
      return ['none', 'xtls-rprx-vision']
    }
  },
  data() {
    return {
      xraySettingsNetworks: ['tcp', 'udp', 'tcp,udp'],
      xraySSMethods: [
        'none',
        'aes-128-gcm',
        'aes-256-gcm',
        'chacha20-ietf-poly1305',
        'xchacha20-ietf-poly1305'
      ]
    }
  },
  methods: {
    isXraySocks,
    isXrayShadowsocks,
    isXrayShadowsocksAEAD,
    isXrayShadowsocks2022,
    showFallback,
    showXrayFlow
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.el-button {
  margin-left: 10px;
}
</style>
