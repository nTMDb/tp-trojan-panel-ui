<template>
  <div class="login-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>

      <el-form-item prop="username" clearable>
        <span class="svg-container">
          <svg-icon icon-class="username" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="pass" clearable>
        <span class="svg-container">
          <svg-icon icon-class="pass" />
        </span>
        <el-input
          ref="pass"
          v-model="registerForm.passOne"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-form-item prop="pass" clearable>
        <span class="svg-container">
          <svg-icon icon-class="pass" />
        </span>
        <el-input
          ref="pass"
          v-model="registerForm.pass"
          :type="passwordType"
          placeholder="请再次输入密码"
          name="password"
          tabindex="3"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleRegister"
        >注册
      </el-button>
      <el-button type="primary" style="width: 100%; margin: 0">
        <router-link to="/login">我已有账号</router-link>
      </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    const validatePass = (rule, value, callback) => {
      if (this.registerForm.passOne !== this.registerForm.pass) {
        callback(new Error('两次新密码输入不一致'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (this.registerForm.username.trim().indexOf('admin') >= 0) {
        callback(new Error('用户名不能包含admin'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        passOne: '',
        pass: ''
      },
      registerRules: {
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
          },
          {
            validator: validatePass,
            trigger: 'change'
          }
        ]
      },
      loading: false,
      passwordType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.pass.focus()
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('users/register', this.registerForm)
            .then(() => {
              this.$router.push({ path: '/login' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
