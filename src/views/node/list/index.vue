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
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        v-if="checkPermission(['sysadmin', 'admin'])"
      >
        {{ $t('table.add') }}
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
      <el-table-column :label="$t('table.nodeIp')" width="150" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ip }}</span>
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
      <el-table-column :label="$t('table.nodePing')" width="80" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.ping | pingFilter">
            <span>{{ row.ping }}ms</span>
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
        <el-form-item :label="$t('table.nodeIp')" prop="ip" clearable>
          <el-input v-model="temp.ip" />
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
          v-show="isTrojanGo"
        >
          <el-input
            :disabled="trojanGoWebsocketDisable"
            v-model="temp.trojanGoWebsocketPath"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoWebsocketHost')"
          prop="trojanGoWebsocketHost"
          clearable
          v-show="isTrojanGo"
        >
          <el-input
            :disabled="trojanGoWebsocketDisable"
            v-model="temp.trojanGoWebsocketHost"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsEnable')"
          prop="trojanGoSsEnable"
          v-show="isTrojanGo"
        >
          <el-switch
            v-model="temp.trojanGoSsEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$t('table.enable')"
            :inactive-text="$t('table.disable')"
            :active-value="1"
            :inactive-value="0"
            :disabled="trojanGoWebsocketDisable"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          :label="$t('table.trojanGoSsMethod')"
          prop="trojanGoSsMethod"
          v-show="isTrojanGo"
        >
          <el-select
            v-model="temp.trojanGoSsMethod"
            :placeholder="$t('table.trojanGoSsMethod')"
            controls-position="right"
            :disabled="trojanGoWebsocketDisable || trojanGoSsDisable"
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
          v-show="isTrojanGo"
        >
          <el-input
            :disabled="trojanGoWebsocketDisable || trojanGoSsDisable"
            v-model="temp.trojanGoSsPassword"
          />
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

    <el-dialog title="节点二维码" :visible.sync="dialogQRCodeVisible">
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
    },
    pingFilter(ping) {
      return ping < 0 ? 'danger' : 'success'
    }
  },
  computed: {
    trojanGoWebsocketDisable: function () {
      return this.temp.trojanGoWebsocketEnable === 0
    },
    trojanGoSsDisable: function () {
      return this.temp.trojanGoSsEnable === 0
    },
    isTrojanGo: function () {
      return getNodeTypeName(this.temp.nodeTypeId) === 'trojan-go'
    },
    isHysteria: function () {
      return getNodeTypeName(this.temp.nodeTypeId) === 'hysteria'
    },
    isXray: function () {
      return getNodeTypeName(this.temp.nodeTypeId) === 'xray'
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
        name: undefined
      },
      temp: {
        id: undefined,
        nodeSubId: undefined,
        nodeTypeId: 1,
        name: '',
        ip: '',
        port: 443,

        xrayProtocol: '',
        xraySettings: '',
        xrayStreamSettings: '',
        xrayTag: '',
        xraySniffing: '',
        xrayAllocate: '',

        trojanGoSni: '',
        trojanGoMuxEnable: 1,
        trojanGoWebsocketEnable: 0,
        trojanGoWebsocketPath: 'trojan-panel-websocket-path',
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
        update: '编辑',
        create: '创建'
      },
      createRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'change' },
          {
            min: 2,
            max: 20,
            message: '名称的范围在2-20字符之间',
            trigger: 'change'
          }
        ],
        ip: [
          { required: true, message: '请输入IP/域名', trigger: 'change' },
          {
            min: 4,
            max: 64,
            message: 'IP/域名的范围在4-64字符之间',
            trigger: 'change'
          }
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'change' },
          {
            pattern:
              /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: '请输入合法的端口',
            trigger: 'change'
          }
        ],

        trojanGoSni: [
          {
            min: 4,
            max: 64,
            message: 'sni在4-64字符之间',
            trigger: 'change'
          }
        ],
        trojanGoMuxEnable: [
          {
            required: true,
            message: '请输入是否开启多路复用',
            trigger: 'change'
          }
        ],
        trojanGoWebsocketEnable: [
          {
            required: true,
            message: '请输入是否开启Websocket',
            trigger: 'change'
          }
        ],
        trojanGoWebsocketPath: [
          {
            min: 2,
            max: 64,
            message: 'Websocket路径的范围在2-64字符之间',
            trigger: 'change'
          }
        ],
        trojanGoWebsocketHost: [
          {
            min: 2,
            max: 64,
            message: 'Websocket Host的范围在2-64字符之间',
            trigger: 'change'
          }
        ],
        trojanGoSsEnable: [
          {
            required: true,
            message: '请输入是否开启SS AEAD',
            trigger: 'change'
          }
        ],
        trojanGoSsMethod: [
          {
            required: true,
            message: '请输入SS AEAD加密方式',
            trigger: 'change'
          }
        ],
        trojanGoSsPassword: [
          {
            min: 2,
            max: 32,
            message: 'SS AEAD密码的范围在2-32字符之间',
            trigger: 'change'
          }
        ],
        hysteriaProtocol: [
          {
            required: true,
            message: '请输入模式',
            trigger: 'change'
          },
          {
            min: 2,
            max: 16,
            message: '模式的范围在2-16字符之间',
            trigger: 'change'
          }
        ],
        hysteriaUpMbps: [
          {
            required: true,
            message: '请输入单客户端最大上传速度/Mbps',
            trigger: 'change'
          },
          {
            type: 'number',
            min: 1,
            max: 999,
            message: '单客户端最大上传速度的范围在1-999之间的整数',
            trigger: 'change'
          }
        ],
        hysteriaDownMbps: [
          {
            required: true,
            message: '请输入单客户端最大下载速度/Mbps',
            trigger: 'change'
          },
          {
            type: 'number',
            min: 1,
            max: 999,
            message: '单客户端最大下载速度的范围在1-999之间的整数',
            trigger: 'change'
          }
        ]
      },
      updateRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'change' },
          {
            min: 2,
            max: 20,
            message: '名称的范围在2-20字符之间',
            trigger: 'change'
          }
        ],
        ip: [
          { required: true, message: '请输入IP/域名', trigger: 'change' },
          {
            min: 4,
            max: 64,
            message: 'IP/域名的范围在4-64字符之间',
            trigger: 'change'
          }
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'change' },
          {
            pattern:
              /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: '请输入合法的端口',
            trigger: 'change'
          }
        ],

        trojanGoSni: [
          {
            min: 4,
            max: 64,
            message: 'sni在4-64字符之间',
            trigger: 'change'
          }
        ],
        trojanGoMuxEnable: [
          {
            required: true,
            message: '请输入是否开启多路复用',
            trigger: 'change'
          }
        ],
        trojanGoWebsocketEnable: [
          {
            required: true,
            message: '请输入是否开启Websocket',
            trigger: 'change'
          }
        ],
        trojanGoWebsocketPath: [
          {
            min: 2,
            max: 64,
            message: 'Websocket路径的范围在2-64字符之间',
            trigger: 'change'
          }
        ],
        trojanGoWebsocketHost: [
          {
            min: 2,
            max: 64,
            message: 'Websocket Host的范围在2-64字符之间',
            trigger: 'change'
          }
        ],
        trojanGoSsEnable: [
          {
            required: true,
            message: '请输入是否开启SS AEAD',
            trigger: 'change'
          }
        ],
        trojanGoSsMethod: [
          {
            required: true,
            message: '请输入SS AEAD加密方式',
            trigger: 'change'
          }
        ],
        trojanGoSsPassword: [
          {
            min: 2,
            max: 32,
            message: 'SS AEAD密码的范围在2-32字符之间',
            trigger: 'change'
          }
        ],
        hysteriaProtocol: [
          {
            required: true,
            message: '请输入模式',
            trigger: 'change'
          },
          {
            min: 2,
            max: 16,
            message: '模式的范围在2-16字符之间',
            trigger: 'change'
          }
        ],
        hysteriaUpMbps: [
          {
            required: true,
            message: '请输入单客户端最大上传速度/Mbps',
            trigger: 'change'
          },
          {
            type: 'number',
            min: 1,
            max: 999,
            message: '单客户端最大上传速度的范围在1-999之间的整数',
            trigger: 'change'
          }
        ],
        hysteriaDownMbps: [
          {
            required: true,
            message: '请输入单客户端最大下载速度/Mbps',
            trigger: 'change'
          },
          {
            type: 'number',
            min: 1,
            max: 999,
            message: '单客户端最大下载速度的范围在1-999之间的整数',
            trigger: 'change'
          }
        ]
      },
      dialogStatus: '',
      nodeTypes: [],
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
    this.getList()
  },
  methods: {
    timeStampToDate,
    checkPermission,
    handleQRCode(row) {
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
        nodeSubId: undefined,
        nodeTypeId: 1,
        name: '',
        ip: '',
        port: 443,

        xrayProtocol: '',
        xraySettings: '',
        xrayStreamSettings: '',
        xrayTag: '',
        xraySniffing: '',
        xrayAllocate: '',

        trojanGoSni: '',
        trojanGoMuxEnable: 1,
        trojanGoWebsocketEnable: 0,
        trojanGoWebsocketPath: 'trojan-panel-websocket-path',
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
      // this.temp = Object.assign({}, row)
      selectNodeById({ id: row.id }).then((response) => {
        this.temp = response.data
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      MessageBox.confirm('确认删除该节点？', '警告', {
        confirmButtonText: '是',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempData = Object.assign({}, row)
        deleteNodeById(tempData).then(() => {
          this.list.splice(index, 1)
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createNode(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建成功',
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
          const tempData = Object.assign({}, this.temp)
          updateNodeById(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改成功',
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
    handleCopyURL(row) {
      nodeURL(row).then((response) => {
        this.$copyText(response.data).then(
          (e) => {
            Message({
              showClose: true,
              message: 'URL复制成功',
              type: 'success'
            })
          },
          (e) => {
            Message({
              showClose: true,
              message: 'URL复制失败!',
              type: 'error'
            })
          }
        )
      })
    }
  }
}
</script>

<style scoped></style>