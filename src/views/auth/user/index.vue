<template>
  <div>
    <!-- <el-table v-loading="tableLoading" :data="tableList">
      <el-table-column align="center" label="账号" prop="userName"></el-table-column>
      <el-table-column align="center" label="角色" prop="roleName"></el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template #default="{row}">{{ row.status == 1 ? '已启用' : '已停用' }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建人" prop="createId"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
      <el-table-column align="center" label="更新人" prop="updateId"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column align="center" label="操作" prop="action"></el-table-column>
    </el-table> -->
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #status="{row}">{{ row.status == 1 ? '已启用' : '已停用' }}</template>
    </MyTable>
  </div>
</template>
<script>
import { userList, userDetail, userSave, userOper } from '@/api/auth'
import MyTable from '@/components/MyTable/index.vue'
export default {
  components: {
    MyTable
  },
  data() {
    return {
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '账号', prop: 'userName'},
        {label: '角色', prop: 'roleName'},
        { slot: 'status', label: '状态', prop: 'status'},
        {label: '创建人', prop: 'createId'},
        {label: '创建时间', prop: 'createTime'},
        {label: '更新人', prop: 'updateId'},
        {label: '更新时间', prop: 'updateTime'},
        { slot: 'status', label: '操作', prop: 'action'},
      ]
    }
  },
  created() {
    this.apiUserList()
  },
  methods: {
    // 列表接口
    apiUserList(){
      userList({pageNo:1, pageSize: 20}).then(res => {
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