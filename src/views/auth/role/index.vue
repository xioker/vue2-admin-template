<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </el-row>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #status="{row}">
        <el-tag :type="row.status == 1 ? 'success' : 'danger'">{{ row.status == 1 ? '已启用' : '已禁用' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiRoleDetail(row)">编辑</el-button>
        <el-button size="mini" type="primary" icon="el-icon-setting" @click="dialogVisible = true">菜单配置</el-button>
        <!-- <el-popconfirm @onConfirm="onStatus(row)" :title="`确定${row.status == 1 ? '禁用' : '启用'}吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" :type="row.status == 1 ? 'danger' : 'primary'">{{ row.status == 1 ? '禁用' : '启用' }}</el-button>
        </el-popconfirm> -->
      </template>
    </MyTable>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="role" :model="roleForm" label-position="right" label-width="80px">
        <el-form-item label="角色名称" prop="roleName" :rules="[{trigger:'blur',message: '角色名称不能为空',required: true}]">
          <el-input type="text" v-model="roleForm.roleName" placeholder="请输入角色名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="次序" prop="roleOrder">
          <el-input-number v-model="roleForm.roleOrder" ></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleForm.status">
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
    <!-- 添加编辑弹窗 -->
		<el-drawer title="菜单配置" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close	>
			<template #default >
				<div v-loading="loading">
					<el-form label-position="top" ref="apiForm" style="width: 90%;margin: auto;">
						<el-form-item>
							<el-card style="width: 100%;margin: auto;">
								<el-tree
									style="height:500px;overflow-y: auto;"
									ref="treeRef"
									:default-checked-keys="comKeys"
									:data="treeData"
									show-checkbox
									default-expand-all
									node-key="id"
									:props="{children: 'children',label: 'menuName'}"
								/>
							</el-card>
						</el-form-item>
					</el-form>
					<div style="text-align: start;width: 90%;margin: auto;">
						<el-button type="primary" @click="onFormSubmit" :loading="btnLoading">保存</el-button>
						<el-button @click="onFormCancle">取消</el-button>
					</div>
				</div>
			</template>
		</el-drawer>
  </div>
</template>
<script>
import { roleList, roleDetail, roleOper, roleSave, menuList } from '@/api/auth'
export default {
  data() {
    return {
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '序号', prop: 'index'},
        {label: '角色名称', prop: 'roleName'},
        {slot: 'status', label: '状态', prop: 'status'},
        {label: '次序', prop: 'roleOrder'},
        // {label: '创建人', prop: 'createId'},
        {label: '创建时间', prop: 'createTime'},
        // {label: '更新人', prop: 'updateId'},
        {label: '更新时间', prop: 'updateTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      roleForm: {
        roleId: '',
        roleName: '',
        roleOrder: 0,
        status: 1
      },
      // 菜单配置
      menu_ids: [],
      dialogVisible: false,
      treeData: [],
      loading: false,
      btnLoading: false
    }
  },
  created() {
    this.apiRoleList()
    this.apiMenuList()
  },
  computed: {
    comKeys(){{
      if( typeof this.menu_ids === 'string'){
        return []
      }
      return this.menu_ids
    }}
  },
  methods: {
    // 列表接口
    apiRoleList(){
      roleList({pageNo:1, pageSize: 20}).then(res => {
        this.tableList = res.list || []
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    // 菜单列表接口
    apiMenuList(){
      menuList({pageNo:1, pageSize: 100}).then(res => {
        this.treeData = res.list || []
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.roleForm.roleId = ''
        this.roleForm.roleName = ''
        this.roleForm.roleOrder = ''
        this.roleForm.status = 1
      })
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.role.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.role.validate((valid) => {
        if(valid){
          const { userId } = this.roleForm
          roleSave(this.roleForm).then(()=>{
            this.apiRoleList()
            this.visible = false
            this.$refs.role.resetFields()
            this.$message.success(`${userId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiRoleDetail({roleId, roleName, roleOrder, status }) {
      this.title = '编辑'
      this.roleForm.roleId = roleId
      this.roleForm.roleName = roleName
      this.roleForm.roleOrder = roleOrder
      this.roleForm.status = Number(status)
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 状态操作事件
    onStatus({roleId,status}){
      roleOper({roleId,type: status == '1' ? 0 : 1}).then(() => {
        this.apiRoleList()
        this.$message.success(`${status == '1' ? '禁用' : '启用'}成功`)
      })
    },
    handleData(tree){
      let result = []
      if (Array.isArray(tree) && tree?.length) {
        tree.forEach(item => {
            result.push(item.id)
            if (item?.children) result.push(...this.handleData(item.children))
        }) 
      }
      return result
    },
    // 设置全选和非全选
    onSelectAll(type) {
      if(type === 1){
        this.$refs.treeRef.setCheckedKeys(this.handleData(this.treeData))
        return
      }
      this.$refs.treeRef.setCheckedKeys([])
    }
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer {
	width: calc(100vw - 210px) !important;
  .el-tree-node__content{
    border: 1px solid #ebebeb;
    padding: 18px 6px;
    border-radius: 6px;
    margin-bottom: 6px;
  }
}

</style>