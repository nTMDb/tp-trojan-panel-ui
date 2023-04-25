<template>
  <div>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisibleProps"
    >
      <el-form
        ref="dataForm"
        :rules="dialogStatus === 'create' ? createRules : updateRules"
        :model="nodeProps"
        label-position="left"
      >
        <el-form-item :label="$t('table.nodeName').toString()" prop="name">
          <el-input v-model="nodeProps.name" clearable />
        </el-form-item>
        <el-form-item
          :label="$t('table.nodeServer').toString()"
          prop="nodeServerId"
        >
          <el-select v-model="nodeProps.nodeServerId" controls-position="right">
            <el-option
              :label="item.name"
              :value="item.id"
              :key="item.id"
              v-for="item in nodeServersProps"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="toAddNodeServer"
          ></el-button>
        </el-form-item>
        <el-form-item :label="$t('table.nodeDomain').toString()" prop="domain">
          <el-input v-model="nodeProps.domain" clearable />
        </el-form-item>
        <el-form-item :label="$t('table.nodePort').toString()" prop="port">
          <el-input-number
            v-model.number="nodeProps.port"
            controls-position="right"
            type="number"
          />
        </el-form-item>

        <el-form-item
          :label="$t('table.nodeType').toString()"
          prop="nodeTypeId"
        >
          <el-select v-model="nodeProps.nodeTypeId" controls-position="right">
            <el-option
              :label="item.name"
              :value="item.id"
              :key="item.id"
              v-for="item in nodeTypesProps"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayProtocol').toString()"
          prop="xrayProtocol"
          v-show="isXrayProps"
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
          v-show="isXrayProps && !isXrayShadowsocksProps"
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
          v-show="isXrayWsProps && !isXrayShadowsocksProps"
        >
          <el-input
            v-model="nodeProps.xrayStreamSettingsEntity.wsSettings.path"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsSecurity').toString()"
          prop="xrayStreamSettingsEntity.security"
          v-show="isXrayProps && !isXrayShadowsocksProps"
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
          v-show="showXrayFlowProps"
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
          v-show="isXrayShadowsocksProps"
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
          v-show="isXrayShadowsocksProps"
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
          v-show="showFallbackProps"
        >
          <el-tag
            v-for="(item, index) in nodeProps.xraySettingsEntity.fallbacks"
            :key="index"
            :disable-transitions="true"
            type="success"
            @close="deleteFallback(item)"
            effect="dark"
            size="medium"
            closable
            @click="handleFallbackDetail(item)"
          >
            {{ item.dest }}
          </el-tag>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleCreateFallback"
          ></el-button>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSni').toString()"
          v-show="isTrojanGoProps"
          prop="trojanGoSni"
        >
          <el-input v-model="nodeProps.trojanGoSni" clearable />
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoMuxEnable').toString()"
          v-show="isTrojanGoProps"
          prop="trojanGoMuxEnable"
        >
          <el-switch
            v-model="nodeProps.trojanGoMuxEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$t('table.enable').toString()"
            :inactive-text="$t('table.disable').toString()"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketEnable').toString()"
          v-show="isTrojanGoProps"
          prop="trojanGoWebsocketEnable"
        >
          <el-switch
            v-model="nodeProps.trojanGoWebsocketEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$t('table.enable').toString()"
            :inactive-text="$t('table.disable').toString()"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketPath').toString()"
          prop="trojanGoWebsocketPath"
          v-show="isTrojanGoEnableWebsocketProps"
        >
          <el-input v-model="nodeProps.trojanGoWebsocketPath" clearable />
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketHost').toString()"
          prop="trojanGoWebsocketHost"
          v-show="isTrojanGoEnableWebsocketProps"
        >
          <el-input v-model="nodeProps.trojanGoWebsocketHost" clearable />
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsEnable').toString()"
          prop="trojanGoSsEnable"
          v-show="isTrojanGoEnableWebsocketProps"
        >
          <el-switch
            v-model="nodeProps.trojanGoSsEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$t('table.enable').toString()"
            :inactive-text="$t('table.disable').toString()"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsMethod').toString()"
          prop="trojanGoSsMethod"
          v-show="isTrojanGoEnableWebsocketProps && isTrojanGoEnableSsProps"
        >
          <el-select
            v-model="nodeProps.trojanGoSsMethod"
            :placeholder="$t('table.trojanGoSsMethod').toString()"
            controls-position="right"
          >
            <el-option
              :label="item"
              :value="item"
              :key="item"
              v-for="item in trojanGoSsMethods"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsPassword').toString()"
          prop="trojanGoSsPassword"
          v-show="isTrojanGoEnableWebsocketProps && isTrojanGoEnableSsProps"
        >
          <el-input v-model="nodeProps.trojanGoSsPassword" clearable />
        </el-form-item>
        <el-form-item
          :label="$t('table.hysteriaProtocol').toString()"
          prop="hysteriaProtocol"
          v-show="isHysteriaProps"
        >
          <el-select
            v-model="nodeProps.hysteriaProtocol"
            :placeholder="$t('table.hysteriaProtocol').toString()"
            controls-position="right"
          >
            <el-option
              :label="item"
              :value="item"
              :key="item"
              v-for="item in hysteriaProtocols"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.hysteriaUpMbps').toString()"
          v-show="isHysteriaProps"
          prop="hysteriaUpMbps"
        >
          <el-input-number
            v-model.number="nodeProps.hysteriaUpMbps"
            controls-position="right"
            type="number"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.hysteriaDownMbps').toString()"
          v-show="isHysteriaProps"
          prop="hysteriaDownMbps"
        >
          <el-input-number
            v-model.number="nodeProps.hysteriaDownMbps"
            controls-position="right"
            type="number"
          />
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
        <el-button @click="$emit('update:dialogFormVisibleProps', false)"
          >{{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <FallbackInfo
      :dialog-visible.sync="dialogFallbackDetailVisible"
      :fallback="fallback"
    />

    <FallbackForm
      ref="fallbackForm"
      :create-fallback="createFallback"
      :dialog-visible.sync="dialogFallbackFormVisible"
    />
  </div>
</template>

<script>
import FallbackInfo from '@/views/node/list/components/FallbackInfo'
import FallbackForm from '@/views/node/list/components/FallbackForm'
import { createNode, updateNodeById } from '@/api/node'

export default {
  name: 'NodeForm',
  components: { FallbackInfo, FallbackForm },
  props: {
    dialogFormVisibleProps: {
      type: Boolean,
      required: true
    },
    nodeProps: {
      type: Object,
      required: true
    },
    dialogStatusProps: {
      type: String,
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
    xrayStreamSettingsSecuritys() {
      let securitys = ['none', 'tls']
      if (this.isXrayVless) {
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
      dialogStatus: this.dialogStatusProps,
      temp: this.nodeProps,
      fallback: {
        name: '',
        alpn: '',
        path: undefined,
        dest: '80',
        xver: 0
      },
      dialogFallbackFormVisible: false,
      dialogFallbackDetailVisible: false,
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
      ],
      trojanGoSsMethods: [
        'AES-128-GCM',
        'AES-256-GCM',
        'CHACHA20-IETF-POLY1305'
      ],
      hysteriaProtocols: ['udp', 'faketcp'],
      textMap: {
        update: this.$t('table.edit'),
        create: this.$t('table.add')
      },
      createRules: {
        name: [
          {
            required: true,
            message: this.$t('valid.nodeName'),
            trigger: 'change'
          },
          {
            min: 2,
            max: 20,
            message: this.$t('valid.nodeNameRange'),
            trigger: 'change'
          }
        ],
        nodeServerId: [
          {
            required: true,
            message: this.$t('valid.nodeServerId'),
            trigger: 'change'
          }
        ],
        domain: [
          {
            required: true,
            message: this.$t('valid.nodeDomain'),
            trigger: 'change'
          },
          {
            min: 4,
            max: 64,
            message: this.$t('valid.nodeDomainRange'),
            trigger: 'change'
          },
          {
            pattern:
              /^([a-zA-Z0-9]([a-zA-Z0-9-_]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,11}$/,
            message: this.$t('valid.nodeDomainFormat'),
            trigger: 'change'
          }
        ],
        port: [
          {
            required: true,
            message: this.$t('valid.nodePort'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('valid.nodePortRange'),
            trigger: 'change'
          }
        ],
        nodeTypeId: [
          {
            required: true,
            message: this.$t('valid.nodeType'),
            trigger: 'change'
          }
        ],
        xrayProtocol: [
          {
            required: true,
            message: this.$t('valid.xrayProtocol'),
            trigger: 'change'
          }
        ],
        xraySSMethod: [
          {
            required: true,
            message: this.$t('valid.xraySSMethod'),
            trigger: 'change'
          }
        ],
        'xraySettingsEntity.network': [
          {
            required: true,
            message: this.$t('valid.xraySSNetwork'),
            trigger: 'change'
          }
        ],
        'xrayStreamSettingsEntity.network': [
          {
            required: true,
            message: this.$t('valid.xrayNetwork'),
            trigger: 'change'
          }
        ],
        'xrayStreamSettingsEntity.security': [
          {
            required: true,
            message: this.$t('valid.xraySecurity'),
            trigger: 'change'
          }
        ],
        'xrayStreamSettingsEntity.wsSettings.path': [
          {
            min: 2,
            max: 64,
            message: this.$t('valid.xrayWsRange'),
            trigger: 'change'
          }
        ],
        trojanGoSni: [
          {
            min: 4,
            max: 64,
            message: this.$t('valid.trojanGoSni'),
            trigger: 'change'
          }
        ],
        trojanGoMuxEnable: [
          {
            required: true,
            message: this.$t('valid.trojanGoMux'),
            trigger: 'change'
          }
        ],
        trojanGoWebsocketEnable: [
          {
            required: true,
            message: this.$t('valid.trojanGoWs'),
            trigger: 'change'
          }
        ],
        trojanGoWebsocketPath: [
          {
            min: 2,
            max: 64,
            message: this.$t('valid.trojanGoWsRange'),
            trigger: 'change'
          }
        ],
        trojanGoWebsocketHost: [
          {
            min: 2,
            max: 64,
            message: this.$t('valid.trojanGoWsHostRange'),
            trigger: 'change'
          }
        ],
        trojanGoSsEnable: [
          {
            required: true,
            message: this.$t('valid.trojanGoSs'),
            trigger: 'change'
          }
        ],
        trojanGoSsMethod: [
          {
            required: true,
            message: this.$t('valid.trojanGoSsMethod'),
            trigger: 'change'
          }
        ],
        trojanGoSsPassword: [
          {
            min: 2,
            max: 32,
            message: this.$t('valid.trojanGoSsPasswordRange'),
            trigger: 'change'
          }
        ],
        hysteriaProtocol: [
          {
            required: true,
            message: this.$t('valid.hysteriaProtocol'),
            trigger: 'change'
          },
          {
            min: 2,
            max: 16,
            message: this.$t('valid.hysteriaProtocolRange'),
            trigger: 'change'
          }
        ],
        hysteriaUpMbps: [
          {
            required: true,
            message: this.$t('valid.hysteriaUpMbps'),
            trigger: 'change'
          },
          {
            type: 'number',
            min: 1,
            max: 9999999999,
            message: this.$t('valid.hysteriaUpMbpsRange'),
            trigger: 'change'
          }
        ],
        hysteriaDownMbps: [
          {
            required: true,
            message: this.$t('valid.hysteriaDownMbps'),
            trigger: 'change'
          },
          {
            type: 'number',
            min: 1,
            max: 9999999999,
            message: this.$t('valid.hysteriaDownMbpsRange'),
            trigger: 'change'
          }
        ]
      },
      updateRules: {
        name: [
          {
            required: true,
            message: this.$t('valid.nodeName'),
            trigger: 'change'
          },
          {
            min: 2,
            max: 20,
            message: this.$t('valid.nodeNameRange'),
            trigger: 'change'
          }
        ],
        nodeServerId: [
          {
            required: true,
            message: this.$t('valid.nodeServerId'),
            trigger: 'change'
          }
        ],
        domain: [
          {
            required: true,
            message: this.$t('valid.ip'),
            trigger: 'change'
          },
          {
            min: 4,
            max: 64,
            message: this.$t('valid.ipRange'),
            trigger: 'change'
          },
          {
            pattern:
              /^([a-zA-Z0-9]([a-zA-Z0-9-_]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,11}$/,
            message: this.$t('valid.nodeDomainFormat'),
            trigger: 'change'
          }
        ],
        port: [
          {
            required: true,
            message: this.$t('valid.nodePort'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('valid.nodePortRange'),
            trigger: 'change'
          }
        ],
        nodeTypeId: [
          {
            required: true,
            message: this.$t('valid.nodeType'),
            trigger: 'change'
          }
        ],
        xrayProtocol: [
          {
            required: true,
            message: this.$t('valid.xrayProtocol'),
            trigger: 'change'
          }
        ],
        xraySSMethod: [
          {
            required: true,
            message: this.$t('valid.xraySSMethod'),
            trigger: 'change'
          }
        ],
        'xraySettingsEntity.network': [
          {
            required: true,
            message: this.$t('valid.xraySSNetwork'),
            trigger: 'change'
          }
        ],
        'xrayStreamSettingsEntity.network': [
          {
            required: true,
            message: this.$t('valid.xrayNetwork'),
            trigger: 'change'
          }
        ],
        'xrayStreamSettingsEntity.security': [
          {
            required: true,
            message: this.$t('valid.xraySecurity'),
            trigger: 'change'
          }
        ],
        'xrayStreamSettingsEntity.wsSettings.path': [
          {
            min: 2,
            max: 64,
            message: this.$t('valid.xrayWsRange'),
            trigger: 'change'
          }
        ],
        trojanGoSni: [
          {
            min: 4,
            max: 64,
            message: this.$t('valid.trojanGoSni'),
            trigger: 'change'
          }
        ],
        trojanGoMuxEnable: [
          {
            required: true,
            message: this.$t('valid.trojanGoMux'),
            trigger: 'change'
          }
        ],
        trojanGoWebsocketEnable: [
          {
            required: true,
            message: this.$t('valid.trojanGoWs'),
            trigger: 'change'
          }
        ],
        trojanGoWebsocketPath: [
          {
            min: 2,
            max: 64,
            message: this.$t('valid.trojanGoWsRange'),
            trigger: 'change'
          }
        ],
        trojanGoWebsocketHost: [
          {
            min: 2,
            max: 64,
            message: this.$t('valid.trojanGoWsHostRange'),
            trigger: 'change'
          }
        ],
        trojanGoSsEnable: [
          {
            required: true,
            message: this.$t('valid.trojanGoSs'),
            trigger: 'change'
          }
        ],
        trojanGoSsMethod: [
          {
            required: true,
            message: this.$t('valid.trojanGoSsMethod'),
            trigger: 'change'
          }
        ],
        trojanGoSsPassword: [
          {
            min: 2,
            max: 32,
            message: this.$t('valid.trojanGoSsPasswordRange'),
            trigger: 'change'
          }
        ],
        hysteriaProtocol: [
          {
            required: true,
            message: this.$t('valid.hysteriaProtocol'),
            trigger: 'change'
          },
          {
            min: 2,
            max: 16,
            message: this.$t('valid.hysteriaProtocolRange'),
            trigger: 'change'
          }
        ],
        hysteriaUpMbps: [
          {
            required: true,
            message: this.$t('valid.hysteriaUpMbps'),
            trigger: 'change'
          },
          {
            type: 'number',
            min: 1,
            max: 9999999999,
            message: this.$t('valid.hysteriaUpMbpsRange'),
            trigger: 'change'
          }
        ],
        hysteriaDownMbps: [
          {
            required: true,
            message: this.$t('valid.hysteriaDownMbps'),
            trigger: 'change'
          },
          {
            type: 'number',
            min: 1,
            max: 9999999999,
            message: this.$t('valid.hysteriaDownMbpsRange'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    resetTemp() {
      this.temp = {
        id: undefined,
        nodeServerId: undefined,
        nodeSubId: undefined,
        nodeTypeId: 1,
        name: '',
        domain: '',
        port: 443,

        xrayProtocol: 'vless',
        xrayFlow: '',
        xraySSMethod: 'aes-256-gcm',
        xraySettings: '',
        xraySettingsEntity: {
          clients: [],
          fallbacks: [
            {
              name: '',
              alpn: '',
              path: undefined,
              dest: '80',
              xver: 0
            }
          ],
          network: 'tcp'
        },
        xrayStreamSettings: '',
        xrayStreamSettingsEntity: {
          network: 'tcp',
          security: 'none',
          tlsSettings: {},
          realitySettings: {},
          wsSettings: {
            path: '/trojan-panel-websocket-path'
          }
        },
        xrayTag: 'user',
        xraySniffing: '',
        xrayAllocate: '',

        trojanGoSni: '',
        trojanGoMuxEnable: 1,
        trojanGoWebsocketEnable: 0,
        trojanGoWebsocketPath: '/trojan-panel-websocket-path',
        trojanGoWebsocketHost: '',
        trojanGoSsEnable: 0,
        trojanGoSsMethod: 'AES-128-GCM',
        trojanGoSsPassword: '',

        hysteriaProtocol: 'udp',
        hysteriaUpMbps: 100,
        hysteriaDownMbps: 100,
        createTime: new Date()
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (
            this.temp.xrayProtocol === 'vless' &&
            this.temp.xrayStreamSettings.network !== 'none'
          ) {
            this.temp.xraySettingsEntity.decryption = 'none'
          }

          this.temp.xrayStreamSettings = JSON.stringify(
            this.temp.xrayStreamSettingsEntity
          )
          this.temp.xraySettings = JSON.stringify(this.temp.xraySettingsEntity)
          createNode(this.temp).then(() => {
            this.getList()
            this.$emit('update:dialogFormVisibleProps', false)
            this.$notify({
              title: 'Success',
              message: this.$t('confirm.createSuccess').toString(),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (
            this.temp.xrayProtocol === 'vless' &&
            this.temp.xrayStreamSettings.network !== 'none'
          ) {
            this.temp.xraySettingsEntity.decryption = 'none'
          }

          this.temp.xrayStreamSettings = JSON.stringify(
            this.temp.xrayStreamSettingsEntity
          )
          this.temp.xraySettings = JSON.stringify(this.temp.xraySettingsEntity)
          const tempData = Object.assign({}, this.temp)
          updateNodeById(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.$emit('update:dialogFormVisibleProps', false)
            this.$notify({
              title: 'Success',
              message: this.$t('confirm.modifySuccess').toString(),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleCreateFallback() {
      this.$refs.fallbackForm.resetTemp()
      this.dialogFallbackFormVisible = true
    },
    handleFallbackDetail(fallback) {
      this.dialogFallbackDetailVisible = true
      this.fallback = fallback
    },
    deleteFallback(fallback) {
      for (let i = 0; i < this.temp.xraySettingsEntity.fallbacks.length; i++) {
        let temp = this.temp.xraySettingsEntity.fallbacks[i]
        if (
          fallback.alpn === temp.alpn &&
          fallback.name === temp.name &&
          fallback.path === temp.path &&
          fallback.dest === temp.dest &&
          fallback.xver === temp.xver
        ) {
          this.temp.xraySettingsEntity.fallbacks.splice(i, 1)
        }
      }
    },
    createFallback(fallback) {
      this.temp.xraySettingsEntity.fallbacks.push(fallback)
    },
    xrayStreamSettingsNetworkChange() {
      if (this.temp.xrayStreamSettingsEntity.network === 'ws') {
        this.temp.xrayStreamSettingsEntity.security = 'tls'
      }
    },
    xrayStreamSettingsSecurityChange() {
      if (
        this.isXrayVless &&
        (this.temp.xrayStreamSettingsEntity.security === 'tls' ||
          this.temp.xrayStreamSettingsEntity.security === 'reality')
      ) {
        this.temp.xrayFlow = 'xtls-rprx-vision'
      } else {
        this.temp.xrayFlow = ''
      }
    },
    toAddNodeServer() {
      this.$router.push({ path: '/server-manage/server-list' })
    }
  }
}
</script>

<style scoped></style>