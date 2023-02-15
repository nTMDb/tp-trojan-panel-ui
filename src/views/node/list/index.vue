<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('table.nodeName')"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-select
        v-model="listQuery.nodeServerId"
        :placeholder="$t('table.nodeServerName')"
        class="filter-item"
        clearable
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          :label="item.name"
          :value="item.id"
          :key="item.id"
          v-for="item in nodeServers"
        ></el-option>
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        v-if="checkPermission(['sysadmin', 'admin'])"
      >
        {{ $t('table.add') }}
      </el-button>
      <el-button
        class="filter-item"
        type="success"
        icon="el-icon-link"
        @click="handleClashSubscribe"
      >
        {{ $t('table.clashSubscribe') }}
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        :label="$t('table.id')"
        sortable="custom"
        align="center"
        width="80"
        type="index"
      />
      <el-table-column :label="$t('table.nodeName')" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.nodeServerName')"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ nodeServerComputed(row.nodeServerId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.nodeDomain')"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.domain }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.nodePort')" width="80" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.nodeType')" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ nodeTypeComputed(row.nodeTypeId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.nodeStatus')"
        width="100"
        align="center"
        v-if="checkPermission(['sysadmin', 'admin'])"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusTypeFilter">
            <span>{{ statusComputed(row.status) }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createTime')"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ timeStampToDate(row.createTime, false) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
            v-if="checkPermission(['sysadmin', 'admin'])"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button type="primary" size="mini" @click="handleQRCode(row)">
            {{ $t('table.nodeQRCode') }}
          </el-button>
          <el-button type="success" size="mini" @click="handleCopyURL(row)">
            {{ $t('table.nodeURL') }}
          </el-button>
          <el-button type="success" size="mini" @click="handleDetail(row)">
            {{ $t('table.nodeDetail') }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
            v-if="checkPermission(['sysadmin', 'admin'])"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="dialogStatus === 'create' ? createRules : updateRules"
        :model="temp"
        label-position="left"
      >
        <el-form-item :label="$t('table.nodeName')" prop="name" clearable>
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('table.nodeServer')" prop="nodeServerId">
          <el-select v-model="temp.nodeServerId" controls-position="right">
            <el-option
              :label="item.name"
              :value="item.id"
              :key="item.id"
              v-for="item in nodeServers"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.nodeDomain')" prop="domain" clearable>
          <el-input v-model="temp.domain" />
        </el-form-item>
        <el-form-item :label="$t('table.nodePort')" prop="port">
          <el-input-number
            v-model.number="temp.port"
            controls-position="right"
            type="number"
          />
        </el-form-item>

        <el-form-item :label="$t('table.nodeType')" prop="nodeTypeId">
          <el-select v-model="temp.nodeTypeId" controls-position="right">
            <el-option
              :label="item.name"
              :value="item.id"
              :key="item.id"
              v-for="item in nodeTypes"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayProtocol')"
          prop="xrayProtocol"
          v-show="isXray"
        >
          <el-select v-model="temp.xrayProtocol" controls-position="right">
            <el-option
              :label="item"
              :value="item"
              :key="index"
              v-for="(item, index) in xrayProtocols"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsNetwork')"
          prop="xrayStreamSettingsEntity.network"
          v-show="isXray && !isXrayShadowsocks"
        >
          <el-select
            v-model="temp.xrayStreamSettingsEntity.network"
            controls-position="right"
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
          :label="$t('table.xrayStreamSettingsWsSettingsPath')"
          prop="xrayStreamSettingsEntity.wsSettings.path"
          v-show="isXrayWs && !isXrayShadowsocks"
        >
          <el-input v-model="temp.xrayStreamSettingsEntity.wsSettings.path" />
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsSecurity')"
          prop="xrayStreamSettingsEntity.security"
          v-show="isXray && !isXrayShadowsocks"
        >
          <el-select
            v-model="temp.xrayStreamSettingsEntity.security"
            controls-position="right"
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
          :label="$t('table.xrayFlow')"
          prop="xrayFlow"
          v-show="showXrayFlow"
        >
          <el-select v-model="temp.xrayFlow" controls-position="right">
            <el-option
              :label="item"
              :value="item"
              :key="index"
              v-for="(item, index) in xrayFlows"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.xraySSMethod')"
          prop="xraySSMethod"
          v-show="isXrayShadowsocks"
        >
          <el-select v-model="temp.xraySSMethod" controls-position="right">
            <el-option
              :label="item"
              :value="item"
              :key="index"
              v-for="(item, index) in xraySSMethods"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.xraySSNetwork')"
          prop="xraySettingsEntity.network"
          v-show="isXrayShadowsocks"
        >
          <el-select
            v-model="temp.xraySettingsEntity.network"
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
          :label="$t('table.trojanGoSni')"
          v-show="isTrojanGo"
          prop="trojanGoSni"
          clearable
        >
          <el-input v-model="temp.trojanGoSni" />
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoMuxEnable')"
          v-show="isTrojanGo"
          prop="trojanGoMuxEnable"
        >
          <el-switch
            v-model="temp.trojanGoMuxEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$t('table.enable')"
            :inactive-text="$t('table.disable')"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketEnable')"
          v-show="isTrojanGo"
          prop="trojanGoWebsocketEnable"
        >
          <el-switch
            v-model="temp.trojanGoWebsocketEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$t('table.enable')"
            :inactive-text="$t('table.disable')"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketPath')"
          prop="trojanGoWebsocketPath"
          clearable
          v-show="isTrojanGoEnableWebsocket"
        >
          <el-input v-model="temp.trojanGoWebsocketPath" />
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketHost')"
          prop="trojanGoWebsocketHost"
          clearable
          v-show="isTrojanGoEnableWebsocket"
        >
          <el-input v-model="temp.trojanGoWebsocketHost" />
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsEnable')"
          prop="trojanGoSsEnable"
          v-show="isTrojanGoEnableWebsocket"
        >
          <el-switch
            v-model="temp.trojanGoSsEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$t('table.enable')"
            :inactive-text="$t('table.disable')"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsMethod')"
          prop="trojanGoSsMethod"
          v-show="isTrojanGoEnableWebsocket && isTrojanGoEnableSs"
        >
          <el-select
            v-model="temp.trojanGoSsMethod"
            :placeholder="$t('table.trojanGoSsMethod')"
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
          :label="$t('table.trojanGoSsPassword')"
          prop="trojanGoSsPassword"
          clearable
          v-show="isTrojanGoEnableWebsocket && isTrojanGoEnableSs"
        >
          <el-input v-model="temp.trojanGoSsPassword" />
        </el-form-item>
        <el-form-item
          :label="$t('table.hysteriaProtocol')"
          prop="hysteriaProtocol"
          v-show="isHysteria"
        >
          <el-select
            v-model="temp.hysteriaProtocol"
            :placeholder="$t('table.hysteriaProtocol')"
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
          :label="$t('table.hysteriaUpMbps')"
          v-show="isHysteria"
          prop="hysteriaUpMbps"
        >
          <el-input-number
            v-model.number="temp.hysteriaUpMbps"
            controls-position="right"
            type="number"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.hysteriaDownMbps')"
          v-show="isHysteria"
          prop="hysteriaDownMbps"
        >
          <el-input-number
            v-model.number="temp.hysteriaDownMbps"
            controls-position="right"
            type="number"
          />
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
        <el-button @click="dialogFormVisible = false"
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

    <Detail
      :node-info="nodeDetail"
      :is-xray="isXray"
      :is-trojan-go="isTrojanGo"
      :is-hysteria="isHysteria"
      :is-naive-proxy="isNaiveProxy"
      :is-xray-ws="isXrayWs"
      :is-xray-shadowsocks="isXrayShadowsocks"
      :show-xray-flow="showXrayFlow"
      :is-trojan-go-enable-ss="isTrojanGoEnableSs"
      :is-trojan-go-enable-websocket="isTrojanGoEnableWebsocket"
      :node-servers="nodeServers"
      :nodeTypes="nodeTypes"
      :dialogInfoVisible.sync="dialogInfoVisible"
    />

    <Qrcode
      :qr-code-src="qrCodeSrc"
      :dialogQRCodeVisible.sync="dialogQRCodeVisible"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Detail from '@/views/node/list/components/Detail'
import Qrcode from '@/views/node/list/components/Qrcode'
import { Message, MessageBox } from 'element-ui'
import {
  createNode,
  deleteNodeById,
  nodeQRCode,
  nodeURL,
  selectNodeById,
  selectNodeInfo,
  selectNodePage,
  updateNodeById
} from '@/api/node'
import { selectNodeTypeList } from '@/api/node-type'
import { getNodeTypeName } from '@/utils/node'
import checkPermission from '@/utils/permission'
import { timeStampToDate } from '@/utils'
import { clashSubscribe } from '@/api/account'
import { selectNodeServerList } from '@/api/node-server'

export default {
  name: 'List',
  components: { Qrcode, Detail, Pagination },
  filters: {
    trojanGoWebsocketEnableFilter(trojanGoWebsocketEnable) {
      const deletedMap = {
        0: 'danger',
        1: 'success'
      }
      return deletedMap[trojanGoWebsocketEnable]
    },
    trojanGoSsEnableFilter(trojanGoSsEnable) {
      const deletedMap = {
        0: 'danger',
        1: 'success'
      }
      return deletedMap[trojanGoSsEnable]
    },
    statusTypeFilter(status) {
      return status > 0 ? 'success' : 'danger'
    }
  },
  computed: {
    isXray() {
      return getNodeTypeName(this.temp.nodeTypeId) === 'xray'
    },
    isXrayWs() {
      return this.isXray && this.temp.xrayStreamSettingsEntity.network === 'ws'
    },
    isXrayVless() {
      return this.isXray && this.temp.xrayProtocol === 'vless'
    },
    isXrayTrojan() {
      return this.isXray && this.temp.xrayProtocol === 'trojan'
    },
    isXrayShadowsocks() {
      return this.isXray && this.temp.xrayProtocol === 'shadowsocks'
    },
    showXrayFlow() {
      return (this.isXrayVless || this.isXrayTrojan) && this.temp.xrayStreamSettingsEntity.security === 'xtls'
    },
    isTrojanGo() {
      return getNodeTypeName(this.temp.nodeTypeId) === 'trojan-go'
    },
    isTrojanGoEnableWebsocket() {
      return this.isTrojanGo && this.temp.trojanGoWebsocketEnable === 1
    },
    isTrojanGoEnableSs() {
      return this.isTrojanGo && this.temp.trojanGoSsEnable === 1
    },
    isHysteria() {
      return getNodeTypeName(this.temp.nodeTypeId) === 'hysteria'
    },
    isNaiveProxy() {
      return getNodeTypeName(this.temp.nodeTypeId) === 'naiveproxy'
    },
    xrayStreamSettingsSecuritys() {
      // XTLS only supports TCP, mKCP and DomainSocket for now
      // vmess暂不支持xtls
      if (
        this.temp.xrayProtocol === 'vmess' ||
        this.temp.xrayStreamSettingsEntity.network !== 'tcp'
      ) {
        return ['none', 'tls']
      } else {
        return ['none', 'tls', 'xtls']
      }
    },
    statusComputed() {
      return function (status) {
        return status === 1
          ? this.$t('table.nodeStatusSuccess')
          : status === 0
          ? this.$t('table.nodeStatusError')
          : this.$t('table.nodeStatusTimeout')
      }
    },
    nodeTypeComputed() {
      return function (nodeTypeId) {
        let nodeType = this.nodeTypes.find((item) => item.id === nodeTypeId)
        if (nodeType && nodeType.name) {
          return nodeType.name
        }
        return ''
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
      tableKey: 0,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        name: undefined,
        nodeServerId: undefined
      },
      temp: {
        id: undefined,
        nodeServerId: undefined,
        nodeSubId: undefined,
        nodeTypeId: 1,
        name: '',
        domain: '',
        port: 443,

        xrayProtocol: 'vless',
        xrayFlow: 'xtls-rprx-vision',
        xraySSMethod: 'aes-256-gcm',
        xraySettings: '',
        xraySettingsEntity: {
          fallbacks: [
            {
              dest: 80
            }
          ],
          network: 'tcp'
        },
        xrayStreamSettings: '',
        xrayStreamSettingsEntity: {
          network: 'tcp',
          security: 'tls',
          tlsSettings: {},
          xtlsSettings: {},
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
      },
      nodeDetail: {
        id: undefined,
        nodeServerId: undefined,
        nodeSubId: undefined,
        nodeTypeId: 1,
        name: '',
        domain: '',
        port: 443,
        password: '',
        uuid: '',
        alterId: 0,

        xrayProtocol: 'vless',
        xrayFlow: 'xtls-rprx-vision',
        xraySSMethod: 'aes-256-gcm',
        xraySettings: '',
        xraySettingsEntity: {
          fallbacks: [
            {
              dest: 80
            }
          ],
          network: 'tcp'
        },
        xrayStreamSettings: '',
        xrayStreamSettingsEntity: {
          network: 'tcp',
          security: 'tls',
          tlsSettings: {},
          xtlsSettings: {},
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
      },
      dialogFormVisible: false,
      dialogInfoVisible: false,
      dialogQRCodeVisible: false,
      textMap: {
        update: this.$t('table.edit'),
        create: this.$t('table.add')
      },
      dialogStatus: '',
      nodeTypes: [],
      nodeServers: [],
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
      xrayFlows: [
        'none',
        'xtls-rprx-vision',
        'xtls-rprx-vision,none',
        'xtls-rprx-origin',
        'xtls-rprx-origin-udp443',
        'xtls-rprx-direct'
      ],
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
      qrCodeSrc: '',
      hysteriaProtocols: ['udp', 'faketcp'],
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
        xrayFlow: [
          {
            required: true,
            message: this.$t('valid.xrayFlow'),
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
        xraySSNetwork: [
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
        xrayFlow: [
          {
            required: true,
            message: this.$t('valid.xrayFlow'),
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
  created() {
    this.setNodeTypes()
    this.setNodeServers()
    this.getList()
  },
  methods: {
    timeStampToDate,
    checkPermission,
    handleQRCode(row) {
      this.qrCodeSrc = ''
      const tempData = Object.assign({}, row)
      nodeQRCode(tempData).then((response) => {
        this.qrCodeSrc = 'data:image/png;base64,' + response.data
      })
      this.dialogQRCodeVisible = true
    },
    setNodeTypes() {
      selectNodeTypeList().then((response) => {
        const { data } = response
        this.nodeTypes = data
      })
    },
    setNodeServers() {
      selectNodeServerList().then((response) => {
        const { data } = response
        this.nodeServers = data
      })
    },
    getList() {
      this.listLoading = true
      selectNodePage(this.listQuery).then((response) => {
        this.list = response.data.nodes
        this.total = response.data.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
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
        xrayFlow: 'xtls-rprx-vision',
        xraySSMethod: 'aes-256-gcm',
        xraySettings: '',
        xraySettingsEntity: {
          fallbacks: [
            {
              dest: 80
            }
          ],
          network: 'tcp'
        },
        xrayStreamSettings: '',
        xrayStreamSettingsEntity: {
          network: 'tcp',
          security: 'tls',
          tlsSettings: {},
          xtlsSettings: {},
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
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign(this.temp, row)
      selectNodeById({ id: row.id }).then((response) => {
        if (this.temp.nodeTypeId === 1) {
          this.temp.xrayProtocol = response.data.xrayProtocol
          this.temp.xraySettings = response.data.xraySettings
          this.temp.xrayStreamSettingsEntity =
            response.data.xrayStreamSettingsEntity
          this.temp.xrayTag = response.data.xrayTag
          this.temp.xraySniffing = response.data.xraySniffing
          this.temp.xrayAllocate = response.data.xrayAllocate
        }
        if (this.temp.nodeTypeId === 2) {
          this.temp.trojanGoSni = response.data.trojanGoSni
          this.temp.trojanGoMuxEnable = response.data.trojanGoMuxEnable
          this.temp.trojanGoWebsocketEnable =
            response.data.trojanGoWebsocketEnable
          this.temp.trojanGoWebsocketPath = response.data.trojanGoWebsocketPath
          this.temp.trojanGoWebsocketHost = response.data.trojanGoWebsocketHost
          this.temp.trojanGoSsEnable = response.data.trojanGoSsEnable
          this.temp.trojanGoSsMethod = response.data.trojanGoSsMethod
          this.temp.trojanGoSsPassword = response.data.trojanGoSsPassword
        }
        if (this.temp.nodeTypeId === 3) {
          this.temp.hysteriaProtocol = response.data.hysteriaProtocol
          this.temp.hysteriaUpMbps = response.data.hysteriaUpMbps
          this.temp.hysteriaDownMbps = response.data.hysteriaDownMbps
        }
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDetail(row) {
      this.nodeDetail = Object.assign(this.temp, row)
      selectNodeInfo({ id: row.id }).then((response) => {
        if (this.nodeDetail.nodeTypeId === 1) {
          this.nodeDetail.xrayProtocol = response.data.xrayProtocol
          this.nodeDetail.xraySettings = response.data.xraySettings
          this.nodeDetail.xrayStreamSettingsEntity =
            response.data.xrayStreamSettingsEntity
          this.nodeDetail.xrayTag = response.data.xrayTag
          this.nodeDetail.xraySniffing = response.data.xraySniffing
          this.nodeDetail.xrayAllocate = response.data.xrayAllocate
          this.nodeDetail.password = response.data.password
          this.nodeDetail.uuid = response.data.uuid
          this.nodeDetail.alterId = response.data.alterId
          this.nodeDetail.xrayFlow = response.data.xrayFlow
          this.nodeDetail.xraySSMethod = response.data.xraySSMethod
        }
        if (this.nodeDetail.nodeTypeId === 2) {
          this.nodeDetail.trojanGoSni = response.data.trojanGoSni
          this.nodeDetail.trojanGoMuxEnable = response.data.trojanGoMuxEnable
          this.nodeDetail.trojanGoWebsocketEnable =
            response.data.trojanGoWebsocketEnable
          this.nodeDetail.trojanGoWebsocketPath =
            response.data.trojanGoWebsocketPath
          this.nodeDetail.trojanGoWebsocketHost =
            response.data.trojanGoWebsocketHost
          this.nodeDetail.trojanGoSsEnable = response.data.trojanGoSsEnable
          this.nodeDetail.trojanGoSsMethod = response.data.trojanGoSsMethod
          this.nodeDetail.trojanGoSsPassword = response.data.trojanGoSsPassword
        }
        if (this.nodeDetail.nodeTypeId === 3) {
          this.nodeDetail.hysteriaProtocol = response.data.hysteriaProtocol
          this.nodeDetail.hysteriaUpMbps = response.data.hysteriaUpMbps
          this.nodeDetail.hysteriaDownMbps = response.data.hysteriaDownMbps
        }
      })
      this.dialogInfoVisible = true
    },
    handleDelete(row, index) {
      MessageBox.confirm(
        this.$t('confirm.deleteNode'),
        this.$t('confirm.warn'),
        {
          confirmButtonText: this.$t('confirm.yes'),
          cancelButtonText: this.$t('confirm.cancel'),
          type: 'warning'
        }
      ).then(() => {
        const tempData = Object.assign({}, row)
        deleteNodeById(tempData).then(() => {
          this.list.splice(index, 1)
          this.$notify({
            title: 'Success',
            message: this.$t('confirm.deleteSuccess'),
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.xrayStreamSettings.network !== 'none') {
            this.temp.xraySettingsEntity.decryption = 'none'
          }

          this.temp.xrayStreamSettings = JSON.stringify(
            this.temp.xrayStreamSettingsEntity
          )
          this.temp.xraySettings = JSON.stringify(this.temp.xraySettingsEntity)
          createNode(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: this.$t('confirm.createSuccess'),
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
          if (this.temp.xrayStreamSettings.network !== 'none') {
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
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: this.$t('confirm.modifySuccess'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleCopyURL(row) {
      nodeURL(row).then((response) => {
        this.$copyText(response.data).then(
          (e) => {
            Message({
              showClose: true,
              message: this.$t('confirm.urlCopySuccess'),
              type: 'success'
            })
          },
          (e) => {
            Message({
              showClose: true,
              message: this.$t('confirm.urlCopyFail'),
              type: 'error'
            })
          }
        )
      })
    },
    handleClashSubscribe() {
      clashSubscribe().then((response) => {
        this.$copyText(
          window.location.protocol + '//' + window.location.host + response.data
        ).then(
          (e) => {
            Message({
              showClose: true,
              message: this.$t('confirm.urlCopySuccess'),
              type: 'success'
            })
          },
          (e) => {
            Message({
              showClose: true,
              message: this.$t('confirm.urlCopyFail'),
              type: 'error'
            })
          }
        )
      })
    }
  }
}
</script>

<style scoped>
.el-button {
  margin-left: 10px;
}
</style>
