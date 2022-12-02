<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="updateRules"
      :model="systemConfig"
      label-position="left"
    >
      <el-form-item
        :label="$t('config.registerEnable')"
        prop="registerEnable"
        clearable
      >
        <el-switch
          v-model="systemConfig.registerEnable"
          :active-value="1"
          :inactive-value="0"
          class="ml-2"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item :label="$t('config.registerQuota')" prop="registerQuota">
        <el-input-number
          v-model.number="systemConfig.registerQuota"
          controls-position="right"
          type="number"
          :disabled="registerDisable"
        />
      </el-form-item>
      <el-form-item
        :label="$t('config.registerExpireDays')"
        prop="registerExpireDays"
      >
        <el-input-number
          v-model.number="systemConfig.registerExpireDays"
          controls-position="right"
          type="number"
          :disabled="registerDisable"
        />
      </el-form-item>
      <el-form-item
        :label="$t('config.resetDownloadAndUploadMonth')"
        prop="resetDownloadAndUploadMonth"
        clearable
      >
        <el-switch
          v-model="systemConfig.resetDownloadAndUploadMonth"
          :active-value="1"
          :inactive-value="0"
          class="ml-2"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item
        :label="$t('config.trafficRankEnable')"
        prop="trafficRankEnable"
        clearable
      >
        <el-switch
          v-model="systemConfig.trafficRankEnable"
          :active-value="1"
          :inactive-value="0"
          class="ml-2"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateData()"
          >{{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateSystemById } from '@/api/system'

export default {
  name: 'account',
  props: {
    systemConfig: {
      type: Object,
      required: true
    }
  },
  computed: {
    registerDisable: function () {
      return this.systemConfig.registerEnable === 0
    }
  },
  data() {
    return {
      updateRules: {
        registerEnable: [
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
        ],
        resetDownloadAndUploadMonth: [
          {
            required: true,
            message: '请输入是否每月重设下载和上传流量',
            trigger: 'change'
          }
        ],
        trafficRankEnable: [
          {
            required: true,
            message: '请输入是否开启流量排行',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.systemConfig)
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