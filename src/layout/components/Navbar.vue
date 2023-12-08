<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu ">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper flex-c-c">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          {{ name || '' }}<i class="el-icon-caret-bottom" ></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native.prevent="pwdShow = true">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 修改密码弹框 -->
    <el-dialog append-to-body title="修改密码" :visible.sync="pwdShow" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onCancle">
      <el-form ref="pwdForm" :model="pwdForm" :rules="rules" label-position="right" label-width="80px">
        <el-row>
          <el-form-item label="原密码" prop="oldPassWord">
            <el-input type="password" v-model="pwdForm.oldPassWord" placeholder="请输入原密码" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新密码" prop="newPassWord">
            <el-input type="password" v-model="pwdForm.newPassWord" placeholder="请输入新密码" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="确认密码" prop="surePassword">
            <el-input type="password" v-model="pwdForm.surePassword" placeholder="请输入确认密码" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancle">取 消</el-button>
        <el-button type="primary" @click="onSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import { updatePass } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name'
    ])
  },
  data(){
    let sPwassword = (rule, value, callback)=>{
      if(value != this.pwdForm.newPassWord){
        callback(new Error('两次输入密码不一致'));
      }else{
        callback();
      }
    }
    return {
      pwdShow: false,
      pwdForm: {
        oldPassWord: '',
        newPassWord: '',
        surePassword: ''
      },
      rules: {
        oldPassWord: [{required: true,trigger: 'change', message: '原密码必填'}],
        newPassWord: [{required: true,trigger: 'change', message: '新密码必填'}],
        surePassword: [{required: true,trigger: 'change', message: '确认密码必填'},{validator:sPwassword}],
      },
    }
  },
  methods: {
    // 修改密码取消 确认操作
    onCancle(){
      this.$refs.pwdForm.resetFields()
      this.pwdShow = false
    },
    onSure(){
      this.$refs.pwdForm.validate((valid)=>{
        if(valid){
          const { oldPassWord, newPassWord } = this.pwdForm
          updatePass({ oldPassWord, newPassWord }).then(()=>{
            this.$message.success('修改成功')
            this.$refs.pwdForm.resetFields()
            this.pwdShow = false
          })
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 10px;
      font-size: 16px;
      .avatar-wrapper {
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
