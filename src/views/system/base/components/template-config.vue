<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="updateRules"
      :model="systemConfig"
      label-position="left"
    >
      <el-form-item
        :label="$t('config.systemName')"
        prop="systemName"
        clearable
      >
        <el-input v-model="systemConfig.systemName" />
      </el-form-item>
      <el-form-item :label="$t('config.clashRule')" prop="clashRule" clearable>
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          v-model="systemConfig.clashRule"
        />
      </el-form-item>
      <el-form-item :label="$t('config.xrayTemplate')" prop="xrayTemplate">
        <JsonEditorVue v-model="systemConfig.xrayTemplateEntity" mode="tree" />
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
import JsonEditorVue from 'json-editor-vue'

export default {
  name: 'templateConfig',
  components: { JsonEditorVue },
  props: {
    systemConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      updateRules: {
        systemName: [
          {
            required: true,
            message: this.$t('valid.systemName'),
            trigger: 'change'
          },
          {
            min: 2,
            max: 32,
            message: this.$t('valid.systemNameRange'),
            trigger: 'change'
          }
        ],
        clashRule: [
          {
            min: 0,
            max: 5000,
            message: this.$t('valid.clashRuleRange'),
            trigger: 'change'
          }
        ],
        xrayTemplate: [
          {
            min: 0,
            max: 5000,
            message: this.$t('valid.xrayTemplateRange'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    updateData() {
      this.systemConfig.xrayTemplate = JSON.stringify(
        this.systemConfig.xrayTemplateEntity
      )
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.systemConfig)
          updateSystemById(tempData).then(() => {
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
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
