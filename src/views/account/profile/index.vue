<template>
  <div class="app-container">
    <aside v-show="emailEnable === 1">
      {{ this.$t('remark.emailEnable') }}
    </aside>
    <el-form
      ref="dataForm"
      :rules="updateRules"
      :model="temp"
      label-position="left"
    >
      <el-form-item :label="$t('table.email')" prop="email" clearable>
        <el-input
          v-model="temp.email"
          type="password"
          :placeholder="$t('table.email')"
        />
      </el-form-item>
      <el-form-item :label="$t('table.oldPass')" prop="oldPass" clearable>
        <el-input
          v-model="temp.oldPass"
          type="password"
          :placeholder="$t('table.oldPass')"
        />
      </el-form-item>
      <el-form-item :label="$t('table.newPass')" prop="newPass" clearable>
        <el-input
          v-model="temp.newPassOne"
          type="password"
          :placeholder="$t('table.newPass')"
        />
      </el-form-item>
      <el-form-item :label="$t('table.newPass')" prop="newPass" clearable>
        <el-input
          v-model="temp.newPass"
          type="password"
          :placeholder="$t('table.newPass')"
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
import { updateAccountProfile } from '@/api/account'
import { setting } from '@/api/system'

export default {
  name: 'Modify',
  data() {
    const validatePass = (rule, value, callback) => {
      if (this.temp.newPassOne !== this.temp.newPass) {
        callback(new Error(this.$t('valid.passNotSame')))
      } else {
        callback()
      }
    }
    return {
      temp: {
        username: this.$store.getters.username,
        email: undefined,
        oldPass: '',
        newPassOne: '',
        newPass: ''
      },
      emailEnable: 0,
      updateRules: {
        email: [
          {
            min: 4,
            max: 64,
            message: this.$t('valid.emailRange'),
            trigger: 'change'
          },
          {
            pattern:
              /^([A-Za-z0-9_\-\.])+\@(163.com|126.com|qq.com|gmail.com)$/,
            message: this.$t('valid.emailElement'),
            trigger: 'change'
          }
        ],
        oldPass: [
          {
            required: true,
            message: this.$t('valid.passNew'),
            trigger: 'change'
          },
          {
            min: 6,
            max: 20,
            message: this.$t('valid.passRange'),
            trigger: 'change'
          },
          {
            pattern: /^[A-Za-z0-9]+$/,
            message: this.$t('valid.passElement'),
            trigger: 'change'
          }
        ],
        newPass: [
          {
            required: true,
            message: this.$t('valid.passNew'),
            trigger: 'change'
          },
          {
            min: 6,
            max: 20,
            message: this.$t('valid.passRange'),
            trigger: 'change'
          },
          {
            pattern: /^[A-Za-z0-9]+$/,
            message: this.$t('valid.passElement'),
            trigger: 'change'
          },
          {
            validator: validatePass,
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.setting()
  },
  methods: {
    resetTemp() {
      this.temp = {
        username: this.$store.getters.username,
        email: undefined,
        oldPass: '',
        newPassOne: '',
        newPass: ''
      }
    },
    setting() {
      setting().then((response) => {
        const { data } = response
        this.emailEnable = data.emailEnable
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateAccountProfile(tempData).then(() => {
            this.resetTemp()
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
            this.$notify({
              title: 'Success',
              message: this.$t('confirm.updateAccountProfile'),
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
