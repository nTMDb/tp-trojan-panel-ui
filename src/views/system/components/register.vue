<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="updateRules"
      :model="temp"
      label-position="left"
    >
      <el-form-item
        :label="$t('config.RegisterEnable')"
        prop="openRegister"
        clearable
      >
        <el-switch
          v-model="temp.openRegister"
          :active-value="1"
          :inactive-value="0"
          class="ml-2"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item :label="$t('config.RegisterQuota')" prop="registerQuota">
        <el-input-number
          v-model.number="temp.registerQuota"
          controls-position="right"
          type="number"
          :disabled="temp.openRegister === 0"
        />
      </el-form-item>
      <el-form-item
        :label="$t('config.RegisterExpireDays')"
        prop="registerExpireDays"
      >
        <el-input-number
          v-model.number="temp.registerExpireDays"
          controls-position="right"
          type="number"
          :disabled="temp.openRegister === 0"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateData()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { selectSystemByName, updateSystemById } from '@/api/system'

export default {
  name: 'register',
  data() {
    return {
      temp: {
        openRegister: 1,
        registerQuota: 0,
        registerExpireDays: 0
      },
      updateRules: {
        openRegister: [
          { required: true, message: '请输入是否开放注册', trigger: 'change' }
        ],
        registerQuota: [
          {
            required: true,
            message: '请输入新用户默认流量',
            trigger: 'change'
          },
          {
            type: 'number',
            min: 0,
            max: 1024000,
            message: '流量在0-1024000之间',
            trigger: 'change'
          }
        ],
        registerExpireDays: [
          {
            required: true,
            message: '请输入新用户默认到期天数',
            trigger: 'change'
          },
          {
            type: 'number',
            min: 0,
            max: 365,
            message: '天数在0-365之间',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.selectDate()
  },
  methods: {
    selectDate() {
      selectSystemByName().then((response) => {
        this.temp = response.data
      })
    },
    resetTemp() {
      this.temp = {
        openRegister: 1,
        registerQuota: 0,
        registerExpireDays: 0
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateSystemById(tempData).then(() => {
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
            this.$notify({
              title: 'Success',
              message: '修改成功',
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