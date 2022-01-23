<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="请输入用户名"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
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
        label="ID"
        sortable="custom"
        align="center"
        width="80"
        type="index"
      />
      <el-table-column label="用户名" width="210" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="210" align="center">
        <template slot-scope="{ row }">
          <span>{{ roleFilter(row.roleId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总流量/MB" width="210" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.quota === -1 ? '无限' : row.quota }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余流量/MB" width="210" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.quota === -1 ? '无限' : row.quota - row.upload - row.download
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
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
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item
          v-if="dialogStatus === 'create'"
          label="用户名"
          prop="username"
          clearable
        >
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="pass" clearable>
          <el-input v-model="temp.pass" />
        </el-form-item>
        <el-form-item label="总流量/MB" prop="quota">
          <el-input-number
            v-model.number="temp.quota"
            controls-position="right"
            type="number"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createUser,
  deleteUserById,
  selectUserPage,
  updateUserById
} from '@/api/users'
import Pagination from '@/components/Pagination'
import { roleFilter } from '@/utils'
import { MessageBox } from 'element-ui'

export default {
  name: 'List',
  components: { Pagination },
  filters: {
    stateFilter(state) {
      const stateMap = {
        1: 'success',
        0: 'danger'
      }
      return stateMap[state]
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
        username: ''
      },
      temp: {
        id: undefined,
        quota: 0,
        download: 0,
        upload: 0,
        username: '',
        pass: '',
        createTime: new Date(),
        roleId: 3
      },
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      createRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 6, message: '用户名不能少于6位', trigger: 'change' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, message: '密码不能少于6位', trigger: 'change' }
        ]
      },
      updateRules: {
        pass: [{ min: 6, message: '密码不能少于6位', trigger: 'change' }]
      },
      dialogStatus: '',
      roles: [] // 角色
    }
  },
  created() {
    this.getList()
  },
  methods: {
    roleFilter,
    getList() {
      this.listLoading = true
      selectUserPage(this.listQuery).then((response) => {
        this.list = response.data.users
        this.total = response.data.total

        // Just to simulate the time of the request
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
        username: '',
        pass: '',
        roleId: 3,
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
      this.temp = Object.assign({}, row) // copy obj
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
        deleteUserById(tempData).then(() => {
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
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)
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
          updateUserById(tempData).then(() => {
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
    stateSelect(state) {
      const stateMap = {
        1: '正常',
        0: '禁用'
      }
      return stateMap[state]
    }
  }
}
</script>

<style scoped></style>
