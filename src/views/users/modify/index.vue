<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="updateRules"
      :model="temp"
      label-position="left"
      label-width="100px"
      style="width: 400px; margin-left: 50px"
    >
      <el-form-item label="原密码" prop="oldPass" clearable>
        <el-input
          v-model="temp.oldPass"
          type="password"
          placeholder="请输入原密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPass" clearable>
        <el-input
          v-model="temp.newPassOne"
          type="password"
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPass" clearable>
        <el-input
          v-model="temp.newPass"
          type="password"
          placeholder="请再次输入新密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateData()"> 确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateUserPassByUsername } from '@/api/users'

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
        oldPass: '',
        newPassOne: '',
        newPass: ''
      },
      updateRules: {
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
  methods: {
    resetTemp() {
      this.temp = {
        username: this.$store.getters.username,
        oldPass: '',
        newPassOne: '',
        newPass: ''
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUserPassByUsername(tempData).then(() => {
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