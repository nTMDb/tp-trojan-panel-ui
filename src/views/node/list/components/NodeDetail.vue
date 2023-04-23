<template>
  <div>
    <el-dialog
      :title="$t('table.detail')"
      :visible="dialogVisible"
      @close="$emit('update:dialogVisible', false)"
    >
      <el-form :model="nodeInfo" label-position="left">
        <el-form-item :label="$t('table.nodeName')">
          <el-tag>{{ nodeInfo.name }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodeServer')">
          <el-tag>{{ nodeServerComputed(nodeInfo.nodeServerId) }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodeDomain')">
          <el-tag>{{ nodeInfo.domain }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodePort')">
          <el-tag>{{ nodeInfo.port }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodeType')">
          <el-tag>
            {{ nodeTypeComputed(nodeInfo.nodeTypeId) }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.password')">
          <el-tag>{{ nodeInfo.password }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.uuid')" v-show="showUUID">
          <el-tag>{{ nodeInfo.uuid }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.alterId')" v-show="showAlterId">
          <el-tag>{{ nodeInfo.alterId }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.xrayProtocol')" v-show="isXray">
          <el-tag>{{ nodeInfo.xrayProtocol }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsNetwork')"
          v-show="isXray && !isXrayShadowsocks"
        >
          <el-tag>
            {{ nodeInfo.xrayStreamSettingsEntity.network }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsWsSettingsPath')"
          v-show="isXrayWs && !isXrayShadowsocks"
        >
          <el-tag
            >{{ nodeInfo.xrayStreamSettingsEntity.wsSettings.path }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsSecurity')"
          v-show="isXray && !isXrayShadowsocks"
        >
          <el-tag>{{ nodeInfo.xrayStreamSettingsEntity.security }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.xrayFlow')" v-show="showXrayFlow">
          <el-tag>{{ nodeInfo.xrayFlow }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xraySSMethod')"
          v-show="isXrayShadowsocks"
        >
          <el-tag>{{ nodeInfo.xraySSMethod }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xraySSNetwork')"
          v-show="isXrayShadowsocks"
        >
          <el-tag>{{ nodeInfo.xraySettingsEntity.network }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.xrayFallbacks')" v-show="showFallback">
          <el-tag
            v-for="(item, index) in nodeInfo.xraySettingsEntity.fallbacks"
            :key="index"
            :disable-transitions="true"
            type="success"
            effect="dark"
            size="medium"
            @click="handleFallbackDetail(item)"
          >
            {{ item.dest }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.trojanGoSni')" v-show="isTrojanGo">
          <el-tag>{{ nodeInfo.trojanGoSni }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoMuxEnable')"
          v-show="isTrojanGo"
        >
          <el-tag>
            {{ trojanGoMuxEnableComputed(nodeInfo.trojanGoMuxEnable) }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketEnable')"
          v-show="isTrojanGo"
        >
          <el-tag>
            {{
              trojanGoWebsocketEnableComputed(nodeInfo.trojanGoWebsocketEnable)
            }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketPath')"
          v-show="isTrojanGoEnableWebsocket"
        >
          <el-tag>{{ nodeInfo.trojanGoWebsocketPath }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketHost')"
          v-show="isTrojanGoEnableWebsocket"
        >
          <el-tag>{{ nodeInfo.trojanGoWebsocketHost }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsEnable')"
          v-show="isTrojanGoEnableWebsocket"
        >
          <el-tag
            >{{ trojanGoSsEnableComputed(nodeInfo.trojanGoSsEnable) }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsMethod')"
          v-show="isTrojanGoEnableWebsocket && isTrojanGoEnableSs"
        >
          <el-tag>{{ nodeInfo.trojanGoSsMethod }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsPassword')"
          v-show="isTrojanGoEnableWebsocket && isTrojanGoEnableSs"
        >
          <el-tag>{{ nodeInfo.trojanGoSsPassword }}</el-tag>
        </el-form-item>

        <el-form-item :label="$t('table.hysteriaProtocol')" v-show="isHysteria">
          <el-tag>{{ nodeInfo.hysteriaProtocol }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.hysteriaUpMbps')" v-show="isHysteria">
          <el-tag>{{ nodeInfo.hysteriaUpMbps }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.hysteriaDownMbps')" v-show="isHysteria">
          <el-tag>{{ nodeInfo.hysteriaDownMbps }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.naiveProxyUsername')" v-show="isNaiveProxy">
          <el-tag>{{ nodeInfo.naiveProxyUsername }}</el-tag>
        </el-form-item>
        <el-form-item v-show="isHysteria">
          <aside>
            {{ $t('table.hysteriaTip') }}
          </aside>
        </el-form-item>
        <el-form-item v-show="isNaiveProxy">
          <aside>
            {{ $t('table.naiveproxyTip') }}
          </aside>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="$emit('update:dialogVisible', false)"
          >{{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <FallbackInfo
      :dialog-visible.sync="dialogDetailFallbackDetailVisible"
      :fallback="fallback"
    />

  </div>
</template>

<script>
import FallbackInfo from '@/views/node/list/components/FallbackInfo'

export default {
  name: 'NodeDetail',
  components: { FallbackInfo },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    nodeInfo: {
      type: Object,
      required: true
    },
    isXray: {
      type: Boolean,
      required: true
    },
    isXrayShadowsocks: {
      type: Boolean,
      required: true
    },
    showXrayFlow: {
      type: Boolean,
      required: true
    },
    showFallback: {
      type: Boolean,
      required: true
    },
    isTrojanGo: {
      type: Boolean,
      required: true
    },
    isHysteria: {
      type: Boolean,
      required: true
    },
    isNaiveProxy: {
      type: Boolean,
      required: true
    },
    isXrayWs: {
      type: Boolean,
      required: true
    },
    isTrojanGoEnableSs: {
      type: Boolean,
      required: true
    },
    isTrojanGoEnableWebsocket: {
      type: Boolean,
      required: true
    },
    nodeServers: {
      type: Array,
      required: true
    },
    nodeTypes: {
      type: Array,
      required: true
    }
  },
  computed: {
    showUUID() {
      return (
        this.isXray &&
        (this.nodeInfo.xrayProtocol === 'vless' ||
          this.nodeInfo.xrayProtocol === 'vmess')
      )
    },
    showAlterId() {
      return (
        this.isXray &&
        (this.nodeInfo.xrayProtocol === 'vless' ||
          this.nodeInfo.xrayProtocol === 'vmess')
      )
    },
    trojanGoMuxEnableComputed() {
      return function (trojanGoMuxEnable) {
        return trojanGoMuxEnable === 1
          ? this.$t('table.enable')
          : this.$t('table.disable')
      }
    },
    trojanGoWebsocketEnableComputed() {
      return function (trojanGoWebsocketEnable) {
        return trojanGoWebsocketEnable === 1
          ? this.$t('table.enable')
          : this.$t('table.disable')
      }
    },
    trojanGoSsEnableComputed() {
      return function (trojanGoSsEnable) {
        return trojanGoSsEnable === 1
          ? this.$t('table.enable')
          : this.$t('table.disable')
      }
    },
    nodeTypeComputed() {
      return function (nodeTypeId) {
        let nodeType = this.nodeTypes.find((item) => item.id === nodeTypeId)
        if (nodeType && nodeType.name) {
          return nodeType.name
        } else {
          return ''
        }
      }
    },
    nodeServerComputed() {
      return function (nodeServerId) {
        let nodeServer = this.nodeServers.find(
          (item) => item.id === nodeServerId
        )
        if (nodeServer && nodeServer.name) {
          return nodeServer.name
        } else {
          return ''
        }
      }
    }
  },
  data() {
    return {
      fallback: {
        name: '',
        alpn: '',
        path: undefined,
        dest: '80',
        xver: 0
      },
      dialogDetailFallbackDetailVisible: false
    }
  },
  methods: {
    handleFallbackDetail(fallback) {
      this.dialogDetailFallbackDetailVisible = true
      this.fallback = fallback
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>