<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </el-row>
    <!-- 表格数据 -->
    <el-table
      v-loading="tableLoading"
      :data="tableList"
      row-key="menuId"
      :tree-props="{children: 'children'}">
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column align="center" label="菜单名称" prop="menuName" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="菜单类型" prop="menuType">
        <template #default="{row}">
          <el-tag :type="row.menuType == 1 ? 'primary' : 'warning'">{{ row.menuType == 1 ? '菜单' : '按钮' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示顺序" prop="orderNum"></el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template #default="{row}">
          <el-tag :type="row.status == 1 ? 'success' : 'danger'">{{ row.status == 1 ? '已启用' : '已停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="组件路径" prop="component" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="路由路径" prop="path"></el-table-column>
      <el-table-column align="center" label="菜单图标" prop="icon"></el-table-column>
      <el-table-column align="center" label="备注" prop="remark"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="160"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updateTime" width="160"></el-table-column>
      <el-table-column align="center" label="操作" prop="action" width="220">
        <template #default="{row}">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiMenuDetail(row)">编辑</el-button>
          <el-button v-if="row.menuType != 2" size="mini" type="success" icon="el-icon-plus" @click="apiMenuDetail(row,'新增子菜单')">新增子菜单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="menu" :model="menuForm" label-position="right" label-width="80px">
        <el-form-item label="菜单名称" prop="menuName" :rules="[{trigger:'blur',message: '菜单名称不能为空',required: true}]">
          <el-input type="text" v-model="menuForm.menuName" placeholder="请输入菜单名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType" :rules="[{trigger:'blur',message: '菜单类型不能为空',required: true}]">
          <el-select v-model="menuForm.menuType" placeholder="请选择菜单类型" style="width: 100%">
            <el-option label="菜单" :value="1"></el-option>
            <el-option label="按钮" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="menuForm.orderNum" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input type="text" v-model="menuForm.component" placeholder="请输入组件路径" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input type="text" v-model="menuForm.path" placeholder="请输入路由路径" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input type="text" v-model="menuForm.icon" placeholder="请输入菜单图标" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="menuForm.remark" placeholder="请输入备注" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="状态" prop="status">
          <el-radio-group v-model="menuForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
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
import { buildTree } from '@/utils'
import { menuList,userDetail, menuSave, menuOper } from '@/api/auth'
export default {
  data() {
    return {
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      menuForm: {
        menuId: '',
        parentId: '',
        menuName: '',
        menuType: '',
        orderNum: '0',
        component: '',
        path: '',
        icon: '',
        status: 1,
        remark: ''
      },
    }
  },
  created() {
    this.apiMenuList()
  },
  methods: {
    // 列表接口
    apiMenuList(){
      menuList({pageNo:1, pageSize: 200}).then(res => {
        this.tableList = res.list ? buildTree(res.list) : []
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.menuForm.menuId = ''
        this.menuForm.parentId = ''
        this.menuForm.menuName = ''
        this.menuForm.menuType = ''
        this.menuForm.menuType = ''
        this.menuForm.orderNum = 0
        this.menuForm.component = ''
        this.menuForm.path = ''
        this.menuForm.icon = ''
        this.menuForm.status = 1
        this.menuForm.remark = ''
      })
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.menu.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.menu.validate((valid) => {
        if(valid){
          const { menuId } = this.menuForm
          menuSave(this.menuForm).then(()=>{
            this.apiMenuList()
            this.visible = false
            this.$message.success(`${menuId ? '编辑' :  '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    async apiMenuDetail({ menuId, parentId, menuName, menuType, orderNum, component, path, icon, status, remark}, type) {
      // 增加子菜单
      if(type){
        await this.onAdd()
        this.title = type
        this.menuForm.parentId = menuId
        return
      }
      this.title = '编辑'
      this.menuForm.menuId = menuId
      this.menuForm.parentId = parentId
      this.menuForm.menuName = menuName
      this.menuForm.menuType = Number(menuType || 1)
      this.menuForm.orderNum = Number(orderNum || 0)
      this.menuForm.component = component
      this.menuForm.path = path
      this.menuForm.icon = icon
      this.menuForm.status = Number(status || 1)
      this.menuForm.remark = remark
      this.visible = true
    }
  },
}
</script>
<style lang="scss" scoped>
  
</style>