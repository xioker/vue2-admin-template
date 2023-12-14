<template >
  <el-card class="sysSetting" v-loading="loading">
    <el-form :model="sysConfig" label-position="top" >
      <el-form-item label="在线人数" prop="onlineUsers">
        <el-input placeholder="请输入在线人数" v-model="sysConfig.onlineUsers" clearable></el-input>
      </el-form-item>
      <el-form-item label="每分钟获得金币数" prop="gold">
        <el-input placeholder="请输入每分钟获得金币数" v-model="sysConfig.gold" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSave">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { sysConfigSave, findSysConfig } from '@/api/common'
export default {
  data() {
    return {
      loading: true,
      sysConfig : {
        configId: '',
        gold: 0,
        onlineUsers: 0
      },
    }
  },
  created() {
    this.apiFindSysConfig()
  },
  methods: {
    // 获取系统配置
    apiFindSysConfig() {
      findSysConfig().then((res) => {
        const { configId, gold, onlineUsers } = res || {}
        this.sysConfig.configId = configId
        this.sysConfig.gold = Number(gold || 0)
        this.sysConfig.onlineUsers = Number(onlineUsers || 0)
      }).finally(()=>this.loading = false)
    },
    // 系统配置保存
    onSave() {
      if(this.loading === false) this.loading = true
      sysConfigSave(this.sysConfig).then(() => {
        this.$message.success('保存成功')
      }).finally(()=>this.loading = false)
    },
  },
}
</script>
<style lang="scss" scoped>
.sysSetting{
  .el-form{
    width: 90%;
    margin: auto;
  }
}
</style>