<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.ip"
        :placeholder="$t('table.nodeServerIp')"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('table.nodeServerName')"
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
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        v-if="checkPermission(['sysadmin'])"
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
      <el-table-column
        :label="$t('table.nodeServerIp')"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.nodeServerGrpcPort')"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.grpcPort }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.nodeServerName')"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
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
            v-if="checkPermission(['sysadmin'])"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            type="success"
            size="mini"
            :disabled="row.status | disabledFilter"
            @click="handleDetail(row)"
          >
            {{ $t('table.nodeDetail') }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
            v-if="checkPermission(['sysadmin'])"
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
    <NodeServerForm
      :node-server="temp"
      :dialog-status="dialogStatus"
      :dialog-form-visible="dialogFormVisible"
      :text-map="textMap"
    />
  </div>
</template>

<script>
import { timeStampToDate } from '@/utils'
import Pagination from '@/components/Pagination'
import { MessageBox } from 'element-ui'
import checkPermission from '@/utils/permission'
import { deleteNodeServerById, selectNodeServerPage } from '@/api/node-server'
import Cookies from 'js-cookie'
import NodeServerForm from '@/views/node-server/list/compoments/NodeServerForm'

export default {
  name: 'NodeServer',
  components: { NodeServerForm, Pagination },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        ip: undefined,
        name: undefined
      },
      temp: {
        id: undefined,
        ip: '',
        name: '',
        grpcPort: 8100,
        createTime: new Date()
      },
      dialogFormVisible: false,
      textMap: {
        update: this.$t('table.edit'),
        create: this.$t('table.add')
      },
      dialogStatus: ''
    }
  },
  created() {
    this.getList()
  },
  filters: {
    statusTypeFilter(status) {
      return status > 0 ? 'success' : 'danger'
    },
    disabledFilter(status) {
      return status !== 1
    }
  },
  methods: {
    checkPermission,
    timeStampToDate,
    getList() {
      this.listLoading = true
      selectNodeServerPage(this.listQuery).then((response) => {
        this.list = response.data.nodeServers
        this.total = response.data.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        ip: '',
        name: '',
        grpcPort: 8100,
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
    handleDelete(row, index) {
      MessageBox.confirm(
        this.$t('confirm.deleteNodeServer'),
        this.$t('confirm.warn'),
        {
          confirmButtonText: this.$t('confirm.yes'),
          cancelButtonText: this.$t('confirm.cancel'),
          type: 'warning'
        }
      ).then(() => {
        const tempData = Object.assign({}, row)
        deleteNodeServerById(tempData).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign(this.temp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDetail(row) {
      Cookies.set('nodeServerId', row.id)
      this.$router.push({ path: 'server-detail' })
    }
  }
}
</script>

<style scoped>
.el-button {
  margin-left: 10px;
}
</style>