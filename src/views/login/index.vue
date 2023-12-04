<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">新海系统管理后台</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="locked" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item>
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              v-model="loginForm.verifyCode"
              placeholder="验证码"
              name="verifyCode"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10" @click="apiVerifyCode"><img :src="codeImg" alt="" style="height:50px;width:100%;cursor: pointer;"></el-col>
      </el-row>

      <el-button :loading="loading" type="default" style="width:100%;margin-bottom:30px;background-color:#5dd5c8;color:#fff;border:none" @click.native.prevent="handleLogin">登录</el-button>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { verifyCode } from '@/api/index'
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '111111',
        verifyCode: '',
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名必填' }],
        password: [{ required: true, trigger: 'blur', message: '验证码必填' }],
        verifyCode: [{ required: true, trigger: 'blur', message: '验证码必填' }],
      },
      codeImg : '',
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.apiVerifyCode()
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 获取验证码
    apiVerifyCode(){
      const uuid = uuidv4()
      this.loginForm.uuid = uuid
      verifyCode({uuid}).then((res) => {
        const img = btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ""));
        this.codeImg = `data:image/png;base64,${img}`
      })
    },
    handleLogin() {
      this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true
      //     this.$store.dispatch('user/login', this.loginForm)
      //       .then(() => {
      //         this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
      //         this.loading = false
      //       })
      //       .catch(() => {
      //         this.loading = false
      //       })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;

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
      height: 47px;
      color: #000;
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
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$main_color:#5dd5c8;
.login-container {
  min-height: 100%;
  width: 100%;
  background:$main_color  url('~@/assets/images/login-bg.png') bottom no-repeat;
  overflow: hidden;

  .login-form {
    background-color: #fff;
    width: 450px;
    padding: 35px;
    margin: 0 auto;
    box-shadow: 0 0 4px rgba(255,255,255,.8);
    transform: translateY(50%);
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
      color: $main_color;
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

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
