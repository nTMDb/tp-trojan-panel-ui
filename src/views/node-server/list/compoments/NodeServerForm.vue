<template>
  <el-dialog
    :title="textMap[dialogStatus]"
    :visible.sync="dialogFormVisible"
    @close="$emit('update:dialogFormVisible', false)"
  >
    <el-form
      ref="dataForm"
      :rules="dialogStatus === 'create' ? createRules : updateRules"
      :model="nodeServer"
      label-position="left"
    >
      <el-form-item :label="$t('table.nodeServerIp')" prop="ip" clearable>
        <el-input v-model="nodeServer.ip" />
      </el-form-item>
      <el-form-item :label="$t('table.nodeServerName')" prop="name" clearable>
        <el-input v-model="nodeServer.name" />
      </el-form-item>
      <el-form-item
        :label="$t('table.nodeServerGrpcPort')"
        prop="grpcPort"
        clearable
      >
        <el-input v-model="nodeServer.grpcPort" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogFormVisible', false)"
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
</template>

<script>
import { createNodeServer, updateNodeServerById } from '@/api/node-server'

export default {
  name: 'NodeServerForm',
  props: {
    nodeServer: {
      type: Object,
      required: true
    },
    dialogStatus: {
      type: String,
      required: true
    },
    dialogFormVisible: {
      type: Boolean,
      required: true
    },
    textMap: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
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
        ]
      }
    }
  },
  methods: {
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
    }
  }
}
</script>

<style scoped></style>
