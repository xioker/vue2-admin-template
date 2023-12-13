<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </el-row>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #status="{row}">
        <el-tag :type="row.status == 1 ? 'success' : 'danger'">{{ row.status == 1 ? '已启用' : '已停用' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button size="mini" :type="row.status == 1 ? 'danger' : 'primary'">{{ row.status == 1 ? '禁用' : '启用' }}</el-button>
      </template>
    </MyTable>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="user" :model="userForm" label-position="right" label-width="50px">
        <el-form-item v-if="title != '修改密码'" label="账号" prop="userName" :rules="[{trigger:'blur',message: '账号不能为空',required: true}]">
          <el-input type="text" v-model="userForm.userName" placeholder="请输入账号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="title != '编辑'" label="密码" prop="password" :rules="[{trigger:'blur',message: '密码不能为空',required: true}]">
          <el-input type="password" v-model="userForm.password" placeholder="请输入密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="title != '修改密码'" label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogCancle">取 消</el-button>
        <el-button type="primary" @click="onDialogSure">确 定</el-button>
      </div>
    </el-dialog>
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
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      userForm: {
        userId: '',
        userName: '',
        password: '',
        status: 1
      },
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
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.userForm.userId = ''
        this.userForm.userName = ''
        this.userForm.password = ''
        this.userForm.status = 1
      })
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.user.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.user.validate((valid) => {
        if(valid){
          const { userId } = this.userForm
          userSave(this.userForm).then(()=>{
            this.apiUserList()
            this.visible = false
            this.$refs.user.resetFields()
            this.$message.success(`${userId ? '编辑' :  '新增'}成功`)
          })
        }
      })
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