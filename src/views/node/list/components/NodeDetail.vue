<template>
  <div>
    <el-dialog
      :title="$t('table.detail').toString()"
      :visible="dialogVisibleProps"
      @close="$emit('update:dialogVisibleProps', false)"
    >
      <el-form :model="nodeInfoProps" label-position="left">
        <el-form-item :label="$t('table.nodeName').toString()">
          <el-tag>{{ nodeInfoProps.name }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodeServer').toString()">
          <el-tag>{{ nodeServerComputed(nodeInfoProps.nodeServerId) }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodeDomain').toString()">
          <el-tag>{{ nodeInfoProps.domain }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodePort').toString()">
          <el-tag>{{ nodeInfoProps.port }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodeType').toString()">
          <el-tag>
            {{ nodeTypeComputed(nodeInfoProps.nodeTypeId) }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.password').toString()">
          <el-tag>{{ nodeInfoProps.password }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.uuid').toString()" v-show="showUUID">
          <el-tag>{{ nodeInfoProps.uuid }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.alterId').toString()"
          v-show="showAlterId"
        >
          <el-tag>{{ nodeInfoProps.alterId }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayProtocol').toString()"
          v-show="isXrayProps"
        >
          <el-tag>{{ nodeInfoProps.xrayProtocol }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsNetwork').toString()"
          v-show="isXrayProps && !isXrayShadowsocksProps"
        >
          <el-tag>
            {{ nodeInfoProps.xrayStreamSettingsEntity.network }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsWsSettingsPath').toString()"
          v-show="isXrayWsProps && !isXrayShadowsocksProps"
        >
          <el-tag
            >{{ nodeInfoProps.xrayStreamSettingsEntity.wsSettings.path }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsSecurity').toString()"
          v-show="isXrayProps && !isXrayShadowsocksProps"
        >
          <el-tag>{{ nodeInfoProps.xrayStreamSettingsEntity.security }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayFlow').toString()"
          v-show="showXrayFlowProps"
        >
          <el-tag>{{ nodeInfoProps.xrayFlow }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xraySSMethod').toString()"
          v-show="isXrayShadowsocksProps"
        >
          <el-tag>{{ nodeInfoProps.xraySSMethod }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xraySSNetwork').toString()"
          v-show="isXrayShadowsocksProps"
        >
          <el-tag>{{ nodeInfoProps.xraySettingsEntity.network }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayFallbacks').toString()"
          v-show="showFallbackProps"
        >
          <el-tag
            v-for="(item, index) in nodeInfoProps.xraySettingsEntity.fallbacks"
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
        <el-form-item
          :label="$t('table.trojanGoSni').toString()"
          v-show="isTrojanGoProps"
        >
          <el-tag>{{ nodeInfoProps.trojanGoSni }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoMuxEnable').toString()"
          v-show="isTrojanGoProps"
        >
          <el-tag>
            {{ trojanGoMuxEnableComputed(nodeInfoProps.trojanGoMuxEnable) }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketEnable').toString()"
          v-show="isTrojanGoProps"
        >
          <el-tag>
            {{
              trojanGoWebsocketEnableComputed(
                nodeInfoProps.trojanGoWebsocketEnable
              )
            }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketPath').toString()"
          v-show="isTrojanGoEnableWebsocketProps"
        >
          <el-tag>{{ nodeInfoProps.trojanGoWebsocketPath }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketHost').toString()"
          v-show="isTrojanGoEnableWebsocketProps"
        >
          <el-tag>{{ nodeInfoProps.trojanGoWebsocketHost }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsEnable').toString()"
          v-show="isTrojanGoEnableWebsocketProps"
        >
          <el-tag
            >{{ trojanGoSsEnableComputed(nodeInfoProps.trojanGoSsEnable) }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsMethod').toString()"
          v-show="isTrojanGoEnableWebsocketProps && isTrojanGoEnableSsProps"
        >
          <el-tag>{{ nodeInfoProps.trojanGoSsMethod }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsPassword').toString()"
          v-show="isTrojanGoEnableWebsocketProps && isTrojanGoEnableSsProps"
        >
          <el-tag>{{ nodeInfoProps.trojanGoSsPassword }}</el-tag>
        </el-form-item>

        <el-form-item
          :label="$t('table.hysteriaProtocol').toString()"
          v-show="isHysteriaProps"
        >
          <el-tag>{{ nodeInfoProps.hysteriaProtocol }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.hysteriaUpMbps').toString()"
          v-show="isHysteriaProps"
        >
          <el-tag>{{ nodeInfoProps.hysteriaUpMbps }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.hysteriaDownMbps').toString()"
          v-show="isHysteriaProps"
        >
          <el-tag>{{ nodeInfoProps.hysteriaDownMbps }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.naiveProxyUsername').toString()"
          v-show="isNaiveProxyProps"
        >
          <el-tag>{{ nodeInfoProps.naiveProxyUsername }}</el-tag>
        </el-form-item>
        <el-form-item v-show="isHysteriaProps">
          <aside>
            {{ $t('table.hysteriaTip') }}
          </aside>
        </el-form-item>
        <el-form-item v-show="isNaiveProxyProps">
          <aside>
            {{ $t('table.naiveproxyTip') }}
          </aside>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="$emit('update:dialogVisibleProps', false)"
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
    dialogVisibleProps: {
      type: Boolean,
      required: true
    },
    nodeInfoProps: {
      type: Object,
      required: true
    },
    isXrayProps: {
      type: Boolean,
      required: true
    },
    isXrayShadowsocksProps: {
      type: Boolean,
      required: true
    },
    showXrayFlowProps: {
      type: Boolean,
      required: true
    },
    showFallbackProps: {
      type: Boolean,
      required: true
    },
    isTrojanGoProps: {
      type: Boolean,
      required: true
    },
    isHysteriaProps: {
      type: Boolean,
      required: true
    },
    isNaiveProxyProps: {
      type: Boolean,
      required: true
    },
    isXrayWsProps: {
      type: Boolean,
      required: true
    },
    isTrojanGoEnableSsProps: {
      type: Boolean,
      required: true
    },
    isTrojanGoEnableWebsocketProps: {
      type: Boolean,
      required: true
    },
    nodeServersProps: {
      type: Array,
      required: true
    },
    nodeTypesProps: {
      type: Array,
      required: true
    }
  },
  computed: {
    showUUID() {
      return (
        this.isXray &&
        (this.nodeInfoProps.xrayProtocol === 'vless' ||
          this.nodeInfoProps.xrayProtocol === 'vmess')
      )
    },
    showAlterId() {
      return (
        this.isXray &&
        (this.nodeInfoProps.xrayProtocol === 'vless' ||
          this.nodeInfoProps.xrayProtocol === 'vmess')
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
        let nodeType = this.nodeTypesProps.find(
          (item) => item.id === nodeTypeId
        )
        if (nodeType && nodeType.name) {
          return nodeType.name
        } else {
          return ''
        }
      }
    },
    nodeServerComputed() {
      return function (nodeServerId) {
        let nodeServer = this.nodeServersProps.find(
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
