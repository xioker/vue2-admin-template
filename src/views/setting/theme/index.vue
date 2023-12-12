<template>
  <div>
    <el-form inline>
      <el-form-item label="标题" prop="keyword">
        <el-input type="text" v-model="searchForm.keyword" placeholder="请输入标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="apiLabelList">查询</el-button>
        <el-button type="info" @click.stop="onReset">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #isDel="{row}">
        <el-tag :type="row.isDel && row.isDel == 1 ? 'danger' : 'success'">{{ row.isDel && row.isDel == 1 ? '已停用' : '已启用' }}</el-tag>
      </template>
      <template #meetType="{row}">
        <span>{{ row.meetType == 1 ? '开通会员' : '阅读时长' }}</span>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiLabelDetail(row)">编辑</el-button>
        <el-popconfirm @onConfirm="apiLabelDelete(row)" :title="`确定删除标签【${row.title}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination"></Pagination>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="label" :model="labelForm" label-position="right" label-width="80px">
        <el-form-item label="主题名称" prop="themeName" :rules="[{trigger:'blur',message: '主题名称不能为空',required: true}]">
          <el-input type="text" v-model="labelForm.themeName" placeholder="请输入主题名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="isDel">
          <el-radio-group v-model="labelForm.isDel">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="VIP专属" prop="isVip">
          <el-radio-group v-model="labelForm.isVip">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="主题图片" prop="themeImg">
          <el-input type="text" v-model="labelForm.themeImg" placeholder="请输入标题" autocomplete="off"></el-input>
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
import { themeList, themeDel, themeSave } from '@/api/setting'
export default {
  data() {
    return {
      // 搜索表单
      searchForm: {
        pageNo:1,
        pageSize: 20,
        keyword: ''
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '标题', prop: 'title'},
        {label: '创建人', prop: 'createdId'},
        {label: '创建时间', prop: 'createdTime'},
        {label: '更新人', prop: 'updateId'},
        {label: '更新时间', prop: 'updateTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      labelForm: {
        themeId: '',
        themeName: '',
        themeImg: '',
        isVip:0,
        isDel: 0,
        levelId: 0
      }
    }
  },
  created() {
    this.apiLabelList()
  },
  methods: {
    // 列表接口
    apiLabelList(){
      if(this.tableLoading === false) this.tableLoading = true
      themeList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiLabelList()
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.labelForm.themeId = ''
        this.labelForm.themeName = ''
        this.labelForm.themeImg = ''
        this.labelForm.isVip = 0
        this.labelForm.isVip = 0
        this.labelForm.levelId = ''
      })
    },
    // 重置
    onReset(){
      this.searchForm.keyword = ''
      this.apiLabelList()
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.label.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.label.validate((valid) => {
        if(valid){
          const { themeId } = this.labelForm
          themeSave(this.labelForm).then(()=>{
            this.apiLabelList()
            this.visible = false
            this.$refs.label.resetFields()
            this.$message.success(`${themeId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiLabelDetail({ themeId, themeName, themeImg, isVip, isDel, levelId }) {
      this.title = '编辑'
      this.labelForm.themeId = themeId
      this.labelForm.themeName = themeName
      this.labelForm.themeImg = themeImg
      this.labelForm.isVip = Number(isVip)
      this.labelForm.isVip = Number(isDel)
      this.labelForm.levelId = levelId
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 删除数据接口
    apiLabelDelete({ themeId, levelId }) {
      themeDel({ themeId, levelId }).then(() => {
        this.apiLabelList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
