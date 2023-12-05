<template>
  <div>
    <el-table v-loading="tableLoading" :data="tableList">
      <el-table-column align="center" label="菜单名" prop="menuName"></el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template #default="{row}">{{ row.status == 1 ? '已启用' : '已停用' }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建人" prop="createId"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
      <el-table-column align="center" label="更新人" prop="updateId"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column align="center" label="备注" prop="remark"></el-table-column>
      <el-table-column align="center" label="操作" prop="action"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { menuList } from '@/api/auth'
export default {
  data() {
    return {
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
    }
  },
  created() {
    this.apiMenuList()
  },
  methods: {
    // 列表接口
    apiMenuList(){
      menuList({pageNo:1, pageSize: 20}).then(res => {
        this.tableList = res.list || []
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    // 详情数据接口
    apiUserDetail(id) {
      userDetail(id).then(res => {
        console.log(res)
      })
    }
  },
}
</script>
<style lang="scss" scoped>
  
</style>