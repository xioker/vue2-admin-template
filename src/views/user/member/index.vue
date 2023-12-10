<template>
  <div class="container">
    <el-form inline>
      <el-form-item label="创建时间">
        <el-input placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input placeholder="创建时间"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { customer, opCustomer } from '@/api/user'
export default {
  data(){
    return {}
  },
  created(){
    this.apiCustomer()
  },
  methods: {
    apiCustomer(){
      customer({pageNo: 1, pageSize: 20}).then((res)=>{

      })
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
