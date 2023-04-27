<template>
  <div>
    <el-dialog
      :title="textMap[dialogStatusProps]"
      :visible="dialogFormVisibleProps"
      @close="$emit('update:dialogFormVisibleProps', false)"
    >
      <el-form
        ref="dataForm"
        :rules="dialogStatusProps === 'create' ? createRules : updateRules"
        :model="temp"
        label-position="left"
      >
        <el-form-item :label="$t('table.nodeName').toString()" prop="name">
          <el-input v-model="temp.name" clearable />
        </el-form-item>
        <el-form-item
          :label="$t('table.nodeServer').toString()"
          prop="nodeServerId"
        >
          <el-select v-model="temp.nodeServerId" controls-position="right">
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
          <el-input v-model="temp.domain" clearable />
        </el-form-item>
        <el-form-item :label="$t('table.nodePort').toString()" prop="port">
          <el-input-number
            v-model.number="temp.port"
            controls-position="right"
            type="number"
          />
        </el-form-item>

        <el-form-item
          :label="$t('table.nodeType').toString()"
          prop="nodeTypeId"
        >
          <el-select v-model="temp.nodeTypeId" controls-position="right">
            <el-option
              :label="item.name"
              :value="item.id"
              :key="item.id"
              v-for="item in nodeTypesProps"
            ></el-option>
          </el-select>
        </el-form-item>

        <XrayForm
          :node-props="temp"
          :form-visible-props="isXray(temp)"
          :handle-create-fallback-props="handleCreateFallback"
          :handle-fallback-detail-props="handleFallbackDetail"
          :delete-fallback-props="deleteFallback"
        />

        <TrojanGoForm
          :node-props="temp"
          :form-visible-props="isTrojanGo(temp)"
        />

        <HysteriaForm
          :node-props="temp"
          :form-visible-props="isHysteria(temp)"
        />

        <NaiveProxyForm :form-visible-props="isNaiveProxy(temp)" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:dialogFormVisibleProps', false)"
          >{{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatusProps === 'create' ? createData() : updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <FallbackInfo
      :dialog-visible-props.sync="dialogFallbackDetailVisible"
      :fallback-prpops="fallback"
    />

    <FallbackForm
      ref="fallbackForm"
      :create-fallback-props="createFallback"
      :dialog-visible-props.sync="dialogFallbackFormVisible"
    />
  </div>
</template>

<script>
import FallbackInfo from '@/views/node/list/components/FallbackInfo'
import FallbackForm from '@/views/node/list/components/FallbackForm'
import { createNode, updateNodeById } from '@/api/node'
import XrayForm from '@/views/node/list/components/XrayForm'
import TrojanGoForm from '@/views/node/list/components/TrojanGoForm'
import { isHysteria, isNaiveProxy, isTrojanGo, isXray } from '@/utils/node'
import HysteriaForm from '@/views/node/list/components/HysteriaForm'
import NaiveProxyForm from '@/views/node/list/components/NaiveProxyForm'

export default {
  name: 'NodeForm',
  components: {
    NaiveProxyForm,
    HysteriaForm,
    TrojanGoForm,
    XrayForm,
    FallbackInfo,
    FallbackForm
  },
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
    nodeServersProps: {
      type: Array,
      required: true
    },
    nodeTypesProps: {
      type: Array,
      required: true
    },
    getListProps: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
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
    isXray,
    isTrojanGo,
    isHysteria,
    isNaiveProxy,
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
            this.getListProps()
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
            this.getListProps()
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
    toAddNodeServer() {
      this.$router.push({ path: '/server-manage/server-list' })
    }
  }
}
</script>

<style scoped></style>