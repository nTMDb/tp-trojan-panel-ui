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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="dialogStatus === 'create' ? createRules : updateRules"
        :model="temp"
        label-position="left"
      >
        <el-form-item :label="$t('table.nodeServerIp')" prop="ip" clearable>
          <el-input v-model="temp.ip" />
        </el-form-item>
        <el-form-item :label="$t('table.nodeServerName')" prop="name" clearable>
          <el-input v-model="temp.name" />
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
  </div>
</template>

<script>
import { timeStampToDate } from '@/utils'
import Pagination from '@/components/Pagination'
import { MessageBox } from 'element-ui'
import checkPermission from '@/utils/permission'
import {
  createNodeServer,
  deleteNodeServerById,
  selectNodeServerPage,
  updateNodeServerById
} from '@/api/node-server'

export default {
  name: 'NodeServer',
  components: { Pagination },
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
        createTime: new Date()
      },
      dialogFormVisible: false,
      textMap: {
        update: this.$t('table.edit'),
        create: this.$t('table.add')
      },
      createRules: {
        ip: [
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
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('valid.nodeServerName'),
            trigger: 'change'
          },
          {
            min: 2,
            max: 20,
            message: this.$t('valid.nodeServerNameRange'),
            trigger: 'change'
          }
        ]
      },
      updateRules: {
        ip: [
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
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('valid.nodeServerName'),
            trigger: 'change'
          },
          {
            min: 2,
            max: 20,
            message: this.$t('valid.nodeServerNameRange'),
            trigger: 'change'
          }
        ]
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createNodeServer(this.temp).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign(this.temp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateNodeServerById(tempData).then(() => {
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
    handleDetail(row) {
      this.$router.push({
        name: 'serverDetail',
        params: {
          nodeServerId: row.id
        }
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
