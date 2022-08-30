<template>
  <div class="app-container">
    <aside v-show="emailEnable === 1">
      设置你的邮箱，可以接收到期提醒邮件。
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
        callback(new Error('两次新密码输入不一致'))
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
        oldPass: [
          { required: true, message: '请输入新密码', trigger: 'change' },
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
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'change' },
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
              message: '修改成功,下次登陆时生效',
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