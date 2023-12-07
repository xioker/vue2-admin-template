<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-plus">新增</el-button>
    </el-row>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #status="{row}">
        <el-tag :type="row.status == 1 ? 'success' : 'danger'">{{ row.status == 1 ? '已启用' : '已停用' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
        <el-popconfirm @confirm="onStatus(row)" :title="`确定${row.status == 1 ? '禁用' : '启用'}吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" :type="row.status == 1 ? 'danger' : 'primary'">{{ row.status == 1 ? '禁用' : '启用' }}</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
  </div>
</template>
<script>
import { roleList, roleDetail, roleSave, roleOper } from '@/api/auth'
import MyTable from '@/components/MyTable/index.vue'
export default {
  components: { MyTable },
  data() {
    return {
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '角色', prop: 'roleName'},
        {slot: 'status', label: '状态', prop: 'status'},
        {label: '创建人', prop: 'createId'},
        {label: '创建时间', prop: 'createTime'},
        {label: '更新人', prop: 'updateId'},
        {label: '更新时间', prop: 'updateTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ]
    }
  },
  created() {
    this.apiRoleList()
  },
  methods: {
    // 列表接口
    apiRoleList(){
      roleList({pageNo:1, pageSize: 20}).then(res => {
        this.tableList = res.list || []
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    // 详情数据接口
    apiUserDetail(id) {
      userDetail(id).then(res => {
        console.log(res)
      })
    },
    // 角色状态操作
    onStatus({roleId,status}){
      roleOper({roleId,type: status == '1' ? 0 : 1}).then(() => {
        this.apiRoleList()
        this.$message.success(`${status == '1' ? '禁用' : '启用'}成功`)
      })
    }
  },
}
</script>
<style lang="scss" scoped>
  
</style>