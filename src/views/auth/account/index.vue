<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </el-row>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #status="{row}">
        <el-tag size="mini" :type="row.status == 1 ? 'success' : 'danger'">{{ row.status == 1 ? '已启用' : '已禁用' }}</el-tag>
      </template>
      <template #action="{row}">
        <template v-if="row.roleName !== '超级管理员'">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiUserDetail(row)">编辑</el-button>
          <el-button size="mini" type="success" icon="el-icon-password" @click="apiUserDetail(row,'password')">修改密码</el-button>
          <el-button size="mini" type="primary" icon="el-icon-setting" @click="onRole(row)">角色配置</el-button>
          <!-- <el-popconfirm @onConfirm="onStatus(row)" :title="`确定${row.status == 1 ? '禁用' : '启用'}吗`" style="margin-left:10px">
            <el-button slot="reference" size="mini" :type="row.status == 1 ? 'danger' : 'primary'">{{ row.status == 1 ? '禁用' : '启用' }}</el-button>
          </el-popconfirm> -->
        </template>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination" />
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
    <!-- 角色配置 -->
    <el-dialog destroy-on-close append-to-body title="角色配置" :visible.sync="roleVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px">
      <el-form ref="roles" label-position="right" label-width="50px">
        <el-form-item label="角色" >
          <el-select multiple clearable v-model="roleId" placeholder="请选择角色" style="width:100%">
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="apiUserAddRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { userList, userDetail, userSave, userOper, userAddRole, roleList, findUserRole } from '@/api/auth'
export default {
  data() {
    return {
      searchForm: {
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '序号', prop: 'index'},
        {label: '账号', prop: 'userName'},
        {label: '角色名称', prop: 'roleName'},
        {slot: 'status', label: '状态', prop: 'status'},
        // {label: '创建人', prop: 'createId'},
        {label: '创建时间', prop: 'createTime'},
        // {label: '更新人', prop: 'updateId'},
        {label: '更新时间', prop: 'updateTime'},
        {slot: 'action', label: '操作', prop: 'action', fixed: 'right', width: '320'},
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
      // 角色配置
      userId: '',
      roleId: [],
      roleVisible: false,
      roles: [],
    }
  },
  created() {
    this.apiUserList()
    this.apiRoleList()
  },
  methods: {
    // 角色列表接口
    apiRoleList(){
      roleList({pageNo:1, pageSize: 100}).then(res => {
        this.roles = res.list || []
      }).catch(()=>{})
    },
    // 列表接口
    apiUserList(){
      if(this.searchForm.tableLoading === false) this.tableLoading = true
      userList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiUserList()
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
          const { userId, password } = this.userForm
          const data = this.title === '修改密码' ? { userId, password } : this.userForm
          userSave(data).then(()=>{
            this.apiUserList()
            this.visible = false
            this.$message.success(`${this.title === '修改密码' ? '修改密码' : userId ? '编辑' :  '新增'}成功`)
          })
        }
      })
    },
    // 用户关联角色
    apiUserAddRole(){
      const roleId = this.roleId.length > 0 ? this.roleId.toString() : ''
      userAddRole({ userId: this.userId, roleId  }).then(()=> {
        this.apiUserList()
        this.roleVisible = false
        this.roleId.length = 0
        this.$message.success(`角色配置成功`)
      })
    },
    onRole({ userId }){
      findUserRole({ userId }).then((res) => {
        this.roleId = res && res.map((item) => item.roleId)
      }).catch(()=>{this.roleId.length = 0})
      .finally(()=>{
        this.userId = userId
        this.roleVisible = true
      })
    },
    // 详情数据接口
    apiUserDetail({userId, password, status, userName }, type) {
      if(type === 'password'){
        this.title = '修改密码'
      }else{
        this.title = '编辑'
      }
      this.userForm.userId = userId
      this.userForm.password = password
      this.userForm.status = Number(status)
      this.userForm.userName = userName
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 状态操作事件
    onStatus({userId,status}){
      userOper({userId,type: status == '1' ? 0 : 1}).then(() => {
        this.apiUserList()
        this.$message.success(`${status == '1' ? '禁用' : '启用'}成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
