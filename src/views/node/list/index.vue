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
          <span>{{ filterNodeServers(row.nodeServerId) }}</span>
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
          <span>{{ filterNodeTypes(row.nodeTypeId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.nodeStatus')"
        width="100"
        align="center"
        v-if="checkPermission(['sysadmin', 'admin'])"
      >
        <template slot-scope="{ row }">
          <el-tag :type="handleStatus(row.status)">
            <span>{{
              row.status === 1
                ? $t('table.nodeStatusSuccess')
                : row.status === 0
                ? $t('table.nodeStatusError')
                : $t('table.nodeStatusTimeout')
            }}</span>
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

    <pagination
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
          v-show="isXray"
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
          v-show="isXrayWs"
        >
          <el-input v-model="temp.xrayStreamSettingsEntity.wsSettings.path" />
        </el-form-item>
        <el-form-item
          :label="$t('table.xrayStreamSettingsSecurity')"
          prop="xrayStreamSettingsEntity.security"
          v-show="isXray"
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

    <el-dialog
      :title="$t('table.nodeQRCode')"
      :visible.sync="dialogQRCodeVisible"
    >
      <el-image style="width: 256px; height: 256px" :src="qrCodeSrc"></el-image>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogQRCodeVisible = false">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { Message, MessageBox } from 'element-ui'
import {
  createNode,
  deleteNodeById,
  nodeQRCode,
  nodeURL,
  selectNodeById,
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
  components: { Pagination },
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
    }
  },
  computed: {
    isXray: function () {
      return getNodeTypeName(this.temp.nodeTypeId) === 'xray'
    },
    isXrayWs: function () {
      return this.isXray && this.temp.xrayStreamSettingsEntity.network === 'ws'
    },
    isTrojanGo: function () {
      return getNodeTypeName(this.temp.nodeTypeId) === 'trojan-go'
    },
    isTrojanGoEnableWebsocket: function () {
      return this.isTrojanGo && this.temp.trojanGoWebsocketEnable === 1
    },
    isTrojanGoEnableSs: function () {
      return this.isTrojanGo && this.temp.trojanGoSsEnable === 1
    },
    isHysteria: function () {
      return getNodeTypeName(this.temp.nodeTypeId) === 'hysteria'
    },
    isNaiveProxy: function () {
      return getNodeTypeName(this.temp.nodeTypeId) === 'naiveproxy'
    },
    xrayStreamSettingsSecuritys: function () {
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
        xraySettings: '',
        xraySettingsEntity: {
          fallbacks: [
            {
              dest: 80
            }
          ]
        },
        xrayStreamSettings: '',
        xrayStreamSettingsEntity: {
          network: 'tcp',
          security: 'xtls',
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
      dialogQRCodeVisible: false,
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
            message: this.$t('valid.nodeIp'),
            trigger: 'change'
          },
          {
            min: 4,
            max: 64,
            message: this.$t('valid.nodeIpRange'),
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
      xrayProtocols: [
        // 'dokodemo-door',
        // 'http',
        // 'socks',
        'vless',
        'vmess',
        'trojan'
        // 'shadowsocks'
      ],
      trojanGoSsMethods: [
        'AES-128-GCM',
        'AES-256-GCM',
        'CHACHA20-IETF-POLY1305'
      ],
      qrCodeSrc: '',
      hysteriaProtocols: ['udp', 'faketcp']
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
        xraySettings: '',
        xraySettingsEntity: {
          fallbacks: [
            {
              dest: 80
            }
          ]
        },
        xrayStreamSettings: '',
        xrayStreamSettingsEntity: {
          network: 'tcp',
          security: 'xtls',
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
              message: this.$t('valid.createSuccess'),
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
    filterNodeTypes(nodeTypeId) {
      return this.nodeTypes.find((item) => item.id === nodeTypeId).name
    },
    filterNodeServers(nodeServerId) {
      return this.nodeServers.find((item) => item.id === nodeServerId).name
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
    },
    handleStatus(status) {
      return status > 0 ? 'success' : 'danger'
    }
  }
}
</script>

<style scoped>
.el-button {
  margin-left: 10px;
}
</style>