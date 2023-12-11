<template>
  <div>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #status="{row}">
        <el-tag :type="row.status == 1 ? 'success' : 'danger'">{{ row.status == 1 ? '已启用' : '已停用' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button size="mini" :type="row.status == 1 ? 'danger' : 'primary'">{{ row.status == 1 ? '禁用' : '启用' }}</el-button>
      </template>
    </MyTable>
  </div>
</template>
<script>
import { menuList,userDetail } from '@/api/auth'
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
        {label: '序号', prop: 'index'},
        {label: '菜单名', prop: 'menuName'},
        {slot: 'status', label: '状态', prop: 'status'},
        {label: '创建人', prop: 'createId'},
        {label: '创建时间', prop: 'createTime'},
        {label: '更新人', prop: 'updateId'},
        {label: '更新时间', prop: 'updateTime'},
        {label: '备注', prop: 'remark'},
        {slot: 'action', label: '操作', prop: 'action'},
      ]
    }
  },
  created() {
    this.apiMenuList()
  },
  methods: {
    // 列表接口
    apiMenuList(){
      menuList({pageNo:1, pageSize: 100}).then(res => {
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