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
          <el-tag
            >{{ nodeServerFind(nodeServersProps, nodeInfoProps.nodeServerId) }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodeDomain').toString()">
          <el-tag>{{ nodeInfoProps.domain }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodePort').toString()">
          <el-tag>{{ nodeInfoProps.port }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.nodeType').toString()">
          <el-tag>
            {{ nodeTypeFind(nodeTypesProps, nodeInfoProps.nodeTypeId) }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.password').toString()">
          <el-tag>{{ nodeInfoProps.password }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.uuid').toString()"
          v-show="showUUID(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.uuid }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.alterId').toString()"
          v-show="showAlterId(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.alterId }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayProtocol').toString()"
          v-show="isXray(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.xrayProtocol }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsNetwork').toString()"
          v-show="isXray(nodeInfoProps) && !isXrayShadowsocks(nodeInfoProps)"
        >
          <el-tag>
            {{ nodeInfoProps.xrayStreamSettingsEntity.network }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsWsSettingsPath').toString()"
          v-show="isXrayWs(nodeInfoProps) && !isXrayShadowsocks(nodeInfoProps)"
        >
          <el-tag
            >{{ nodeInfoProps.xrayStreamSettingsEntity.wsSettings.path }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsSecurity').toString()"
          v-show="isXray(nodeInfoProps) && !isXrayShadowsocks(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.xrayStreamSettingsEntity.security }}</el-tag>
        </el-form-item>
        <el-form-item
          label="dest"
          v-show="isXrayStreamSettingsSecurityReality(nodeInfoProps)"
        >
          <el-tag
            >{{ nodeInfoProps.xrayStreamSettingsEntity.realitySettings.dest }}
          </el-tag>
        </el-form-item>
        <el-form-item
          label="xver"
          v-show="isXrayStreamSettingsSecurityReality(nodeInfoProps)"
        >
          <el-tag
            >{{ nodeInfoProps.xrayStreamSettingsEntity.realitySettings.xver }}
          </el-tag>
        </el-form-item>

        <el-form-item
          label="serverNames"
          v-show="isXrayStreamSettingsSecurityReality(nodeInfoProps)"
        >
          <el-tag
            v-for="(item, index) in nodeInfoProps.xrayStreamSettingsEntity
              .realitySettings.serverNames"
            :key="index"
            :disable-transitions="true"
            type="success"
            effect="dark"
            size="medium"
          >
            {{ item }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.fingerprint').toString()"
          v-show="isXrayStreamSettingsSecurityReality(nodeInfoProps)"
        >
          <el-tag
            >{{
              nodeInfoProps.xrayStreamSettingsEntity.realitySettings.fingerprint
            }}
          </el-tag>
        </el-form-item>
        <el-form-item
          label="publicKey"
          v-show="isXrayStreamSettingsSecurityReality(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.realityPbk }}</el-tag>
        </el-form-item>
        <el-form-item
          label="privateKey"
          v-show="isXrayStreamSettingsSecurityReality(nodeInfoProps)"
        >
          <el-tag
            >{{
              nodeInfoProps.xrayStreamSettingsEntity.realitySettings.privateKey
            }}
          </el-tag>
        </el-form-item>
        <el-form-item
          label="serverNames"
          v-show="isXrayStreamSettingsSecurityReality(nodeInfoProps)"
        >
          <el-tag
            v-for="(item, index) in nodeInfoProps.xrayStreamSettingsEntity
              .realitySettings.shortIds"
            :key="index"
            :disable-transitions="true"
            type="success"
            effect="dark"
            size="medium"
          >
            {{ item }}
          </el-tag>
        </el-form-item>
        <el-form-item
          label="spiderX"
          v-show="isXrayStreamSettingsSecurityReality(nodeInfoProps)"
        >
          <el-tag
            >{{
              nodeInfoProps.xrayStreamSettingsEntity.realitySettings.spiderX
            }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayFlow').toString()"
          v-show="showXrayFlow(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.xrayFlow }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xraySSMethod').toString()"
          v-show="isXrayShadowsocks(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.xraySSMethod }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xraySSNetwork').toString()"
          v-show="isXrayShadowsocks(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.xraySettingsEntity.network }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayFallbacks').toString()"
          v-show="showFallback(nodeInfoProps)"
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
          v-show="isTrojanGo(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.trojanGoSni }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoMuxEnable').toString()"
          v-show="isTrojanGo(nodeInfoProps)"
        >
          <el-tag>
            {{ trojanGoMuxEnableComputed(nodeInfoProps.trojanGoMuxEnable) }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketEnable').toString()"
          v-show="isTrojanGo(nodeInfoProps)"
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
          v-show="isTrojanGoEnableWebsocket(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.trojanGoWebsocketPath }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketHost').toString()"
          v-show="isTrojanGoEnableWebsocket(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.trojanGoWebsocketHost }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsEnable').toString()"
          v-show="isTrojanGoEnableWebsocket(nodeInfoProps)"
        >
          <el-tag
            >{{ trojanGoSsEnableComputed(nodeInfoProps.trojanGoSsEnable) }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsMethod').toString()"
          v-show="
            isTrojanGoEnableWebsocket(nodeInfoProps) &&
            isTrojanGoEnableSs(nodeInfoProps)
          "
        >
          <el-tag>{{ nodeInfoProps.trojanGoSsMethod }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsPassword').toString()"
          v-show="
            isTrojanGoEnableWebsocket(nodeInfoProps) &&
            isTrojanGoEnableSs(nodeInfoProps)
          "
        >
          <el-tag>{{ nodeInfoProps.trojanGoSsPassword }}</el-tag>
        </el-form-item>

        <el-form-item
          :label="$t('table.hysteriaProtocol').toString()"
          v-show="isHysteria(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.hysteriaProtocol }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.hysteriaUpMbps').toString()"
          v-show="isHysteria(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.hysteriaUpMbps }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.hysteriaDownMbps').toString()"
          v-show="isHysteria(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.hysteriaDownMbps }}</el-tag>
        </el-form-item>
        <el-form-item
          :label="$t('table.naiveProxyUsername').toString()"
          v-show="isNaiveProxy(nodeInfoProps)"
        >
          <el-tag>{{ nodeInfoProps.naiveProxyUsername }}</el-tag>
        </el-form-item>
        <el-form-item v-show="isHysteria(nodeInfoProps)">
          <aside>
            {{ $t('table.hysteriaTip') }}
          </aside>
        </el-form-item>
        <el-form-item v-show="isNaiveProxy(nodeInfoProps)">
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
      :dialog-visible-props.sync="dialogDetailFallbackDetailVisible"
      :fallback-prpops="fallback"
    />
  </div>
</template>

<script>
import FallbackInfo from '@/views/node/list/components/FallbackInfo'
import {
  isHysteria,
  isNaiveProxy,
  isTrojanGo,
  isTrojanGoEnableSs,
  isTrojanGoEnableWebsocket,
  isXray,
  isXrayShadowsocks,
  isXrayStreamSettingsSecurityReality,
  isXrayWs,
  nodeServerFind,
  nodeTypeFind,
  showAlterId,
  showFallback,
  showUUID,
  showXrayFlow
} from '@/utils/node'

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
    isXray,
    isXrayShadowsocks,
    isXrayWs,
    showXrayFlow,
    showFallback,
    isTrojanGo,
    isTrojanGoEnableWebsocket,
    isTrojanGoEnableSs,
    isHysteria,
    isNaiveProxy,
    nodeServerFind,
    nodeTypeFind,
    isXrayStreamSettingsSecurityReality,
    showUUID,
    showAlterId,
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

.el-button {
  margin-left: 10px;
}
</style>
