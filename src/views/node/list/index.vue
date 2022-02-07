<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入名称"
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
        v-show="checkAdmin"
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
        v-show="checkAdmin"
      />
      <el-table-column label="名称" width="180" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" width="180" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口" width="180" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="180" align="center">
        <template slot-scope="{ row }">
          <span>{{ filterNodeTypes(row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
            v-show="checkAdmin"
          >
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="handleQRCode(row)">
            生成二维码
          </el-button>
          <el-button type="success" size="mini" @click="handleCopyURL(row)">
            复制URL
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
            v-show="checkAdmin"
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
        <el-form-item label="名称" prop="name" clearable>
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="IP" prop="ip" clearable>
          <el-input v-model="temp.ip" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input-number
            v-model.number="temp.port"
            controls-position="right"
            type="number"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="temp.type"
            placeholder="请选择类型"
            controls-position="right"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in nodeTypes"
            ></el-option>
          </el-select>
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

    <el-dialog title="节点二维码" :visible.sync="dialogQRCodeVisible">
      <el-image style="width: 256px; height: 256px" :src="qrCodeSrc"></el-image>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogQRCodeVisible = false">
          确定
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
  selectNodePage,
  updateNodeById
} from '@/api/node'
import { selectNodeTypeList } from '@/api/node-type'
import { checkAdmin } from '@/utils/permission'

export default {
  name: 'List',
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
        name: ''
      },
      temp: {
        id: undefined,
        name: '',
        ip: '',
        port: 0,
        type: 1,
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
            min: 3,
            max: 20,
            message: '名称的范围在3-20字符之间',
            trigger: 'change'
          }
        ],
        ip: [
          { required: true, message: '请输入IP', trigger: 'change' },
          {
            pattern:
              /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g,
            message: '请输入合法的IP地址',
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
        type: [
          { required: true, message: '请输入端口', trigger: 'change' },
          {
            pattern: /^([1-9][0-9]?|100)$/,
            message: '请输入合法的类型',
            trigger: 'change'
          }
        ]
      },
      updateRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'change' },
          {
            min: 3,
            max: 20,
            message: '名称的范围在3-20字符之间',
            trigger: 'change'
          }
        ],
        ip: [
          { required: true, message: '请输入IP', trigger: 'change' },
          {
            pattern:
              /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g,
            message: '请输入合法的IP地址',
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
        type: [
          { required: true, message: '请输入端口', trigger: 'change' },
          {
            pattern: /^([1-9][0-9]?|100)$/,
            message: '请输入合法的类型',
            trigger: 'change'
          }
        ]
      },
      dialogStatus: '',
      nodeTypes: [],
      qrCodeSrc: '',
      checkAdmin: checkAdmin()
    }
  },
  created() {
    this.setNodeTypes()
    this.getList()
  },
  methods: {
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
        name: '',
        ip: '',
        port: 0,
        type: 1,
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
      this.temp = Object.assign({}, row)
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
    filterNodeTypes(type) {
      return this.nodeTypes.find((item) => item.id === type).name
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
