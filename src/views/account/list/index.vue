<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        :placeholder="$t('table.username')"
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
      <el-table-column :label="$t('table.username')" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.role')" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ roleFilter(row.roleId) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.quota')" width="110" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.quota < 0 ? '无限' : getFlow(row.quota * 1024 * 1024)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.download')" width="110" align="center">
        <template slot-scope="{ row }">
          <span>{{ getFlow(row.download * 1024 * 1024) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.upload')" width="110" align="center">
        <template slot-scope="{ row }">
          <span>{{ getFlow(row.upload * 1024 * 1024) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.flow')" width="110" align="center">
        <template slot-scope="{ row }">
          <span
            :style="
              row.quota >= 0 &&
              row.quota * 1024 * 1024 - row.upload - row.download <= 0
                ? 'color: #FF0000;'
                : ''
            "
            >{{
              row.quota < 0
                ? '无限'
                : getFlow(row.quota * 1024 * 1024 - row.upload - row.download)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" width="80" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.deleted | deletedFilter">
            {{ row.deleted === 1 ? $t('table.disable') : $t('table.enable') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.expireDate')"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <span
            :style="
              row.expireTime <= new Date().getTime() ? 'color: #FF0000;' : ''
            "
            >{{ timeStampToDate(row.expireTime, false) }}
          </span>
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
        <el-form-item
          v-if="dialogStatus === 'create'"
          :label="$t('table.username')"
          prop="username"
          clearable
        >
          <el-input
            v-model="temp.username"
            :placeholder="$t('table.username')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.pass')" prop="pass" clearable>
          <el-input
            v-model="temp.pass"
            type="password"
            :placeholder="$t('table.pass')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.editQuota')" prop="quota">
          <el-input-number
            v-model.number="temp.quota"
            controls-position="right"
            type="number"
          />
        </el-form-item>
        <el-form-item :label="$t('table.email')" prop="email" clearable>
          <el-input v-model="temp.email" :placeholder="$t('table.email')" />
        </el-form-item>
        <el-form-item :label="$t('table.status')" prop="deleted">
          <el-switch
            v-model="temp.deleted"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$t('table.enable')"
            :inactive-text="$t('table.disable')"
            :active-value="0"
            :inactive-value="1"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('table.expireDate')" prop="expireTime">
          <el-date-picker
            v-model="temp.expireTime"
            type="datetime"
            value-format="timestamp"
            :placeholder="$t('table.expireDate')"
          />
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
import {
  createAccount,
  deleteAccountById,
  selectAccountPage,
  updateAccountById
} from '@/api/account'
import Pagination from '@/components/Pagination'
import { MessageBox } from 'element-ui'
import { timeStampToDate } from '@/utils'
import { getFlow } from '@/utils/account'
import { selectRoleList } from '@/api/role'
import checkPermission from '@/utils/permission'
import { setting } from '@/api/system'

export default {
  name: 'List',
  filters: {
    deletedFilter(deleted) {
      const deletedMap = {
        0: 'success',
        1: 'danger'
      }
      return deletedMap[deleted]
    }
  },
  components: { Pagination },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (this.temp.username.trim().indexOf('admin') >= 0) {
        callback(new Error('用户名不能包含admin'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        username: undefined
      },
      temp: {
        id: undefined,
        quota: 0,
        download: 0,
        upload: 0,
        username: undefined,
        pass: undefined,
        email: undefined,
        roleId: 3,
        deleted: 0,
        expireTime: new Date().getTime(),
        createTime: new Date()
      },
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      createRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: '名称的范围在6-20字符之间',
            trigger: 'change'
          },
          {
            pattern: /^[A-Za-z0-9]+$/,
            message: '用户名必须是字母和数字的组合',
            trigger: 'change'
          },
          {
            validator: validateUsername,
            trigger: 'change'
          }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: '密码的范围在6-20字符之间',
            trigger: 'change'
          },
          {
            pattern: /^[A-Za-z0-9]+$/,
            message: '密码必须是字母和数字的组合',
            trigger: 'change'
          }
        ],
        quota: [
          { required: true, message: '请输入总流量', trigger: 'change' },
          {
            type: 'number',
            min: -1,
            max: 1024000,
            message: '总流量的范围在-1-1024000之间的整数',
            trigger: 'change'
          }
        ],
        email: [
          {
            min: 4,
            max: 64,
            message: '邮箱的范围在4-64字符之间',
            trigger: 'change'
          },
          {
            pattern:
              /^([A-Za-z0-9_\-\.])+\@(163.com|126.com|qq.com|gmail.com)$/,
            message: '请输入正确的邮箱格式(只支持163 126 qq gmail)',
            trigger: 'change'
          }
        ],
        deleted: [{ required: true, message: '请输入状态', trigger: 'change' }],
        expireTime: [
          { required: true, message: '请输入到期时间', trigger: 'change' }
        ]
      },
      updateRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: '名称的范围在6-20字符之间',
            trigger: 'change'
          },
          {
            pattern: /^[A-Za-z0-9]+$/,
            message: '用户名必须是字母和数字的组合',
            trigger: 'change'
          },
          {
            validator: validateUsername,
            trigger: 'change'
          }
        ],
        pass: [
          {
            min: 6,
            max: 20,
            message: '密码的范围在6-20字符之间',
            trigger: 'change'
          },
          {
            pattern: /^[A-Za-z0-9]+$/,
            message: '密码必须是字母和数字的组合',
            trigger: 'change'
          }
        ],
        quota: [
          { required: true, message: '请输入总流量', trigger: 'change' },
          {
            type: 'number',
            min: -1,
            max: 1024000,
            message: '总流量的范围在-1-1024000之间的整数',
            trigger: 'change'
          }
        ],
        email: [
          {
            min: 4,
            max: 64,
            message: '邮箱的范围在4-64字符之间',
            trigger: 'change'
          },
          {
            pattern:
              /^([A-Za-z0-9_\-\.])+\@(163.com|126.com|qq.com|gmail.com)$/,
            message: '请输入正确的邮箱格式(只支持163 126 qq gmail)',
            trigger: 'change'
          }
        ],
        deleted: [{ required: true, message: '请输入状态', trigger: 'change' }],
        expireTime: [
          { required: true, message: '请输入到期时间', trigger: 'change' }
        ]
      },
      dialogStatus: '',
      roleList: []
    }
  },
  created() {
    this.setRoleList()
    this.getList()
  },
  methods: {
    checkPermission,
    getFlow,
    timeStampToDate,
    setRoleList() {
      selectRoleList().then((response) => {
        const { data } = response
        this.roleList = data
      })
    },
    getList() {
      this.listLoading = true
      selectAccountPage(this.listQuery).then((response) => {
        this.list = response.data.users
        this.total = response.data.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        quota: 0,
        download: 0,
        upload: 0,
        username: undefined,
        pass: undefined,
        email: undefined,
        roleId: 3,
        deleted: 0,
        expireTime: new Date().getTime(),
        createTime: new Date()
      }
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      setting().then((response) => {
        if (response.data.openRegister === 1) {
          this.temp.quota = response.data.registerQuota
          this.temp.expireTime =
            new Date().getTime() + response.data.registerExpireDays * 86400000
        }
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      MessageBox.confirm('确认删除该用户？', '警告', {
        confirmButtonText: '是',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempData = Object.assign({}, row)
        deleteAccountById(tempData).then(() => {
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
          createAccount(this.temp).then(() => {
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
          updateAccountById(tempData).then(() => {
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
    roleFilter(roleId) {
      return this.roleList.find((item) => item.id === roleId).desc
    }
  }
}
</script>

<style scoped></style>