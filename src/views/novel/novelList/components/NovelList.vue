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
      <template #bookState="{row}">
        <el-tag size="mini" :type="row.bookState == 0 ? 'success' : 'danger'">{{ ['更新','完结','停更'][row.bookState] }}</el-tag>
      </template>
      <template #isTop="{row}">
        <el-tag size="mini" :type="row.isTop == 1 ? 'success' : 'danger'">{{ row.isTop == 1 ? '是' : '否' }}</el-tag>
      </template>
      <template #chargeType="{row}">
        <el-tag size="mini" type="info">{{ ['完全免费','VIP免费','章节收费'][row.chargeType] }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiLabelDetail(row)">编辑</el-button>
        <el-button size="mini" type="success" @click="$parent.changeCom(row)">小说章节</el-button>
        <el-popconfirm @onConfirm="apiLabelDelete(row)" :title="`确定删除小说【${row.bookTitle}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination" />
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="label" :model="labelForm" label-position="right" label-width="60px">
        <el-form-item label="标题" prop="title" :rules="[{trigger:'blur',message: '标题不能为空',required: true}]">
          <el-input type="text" v-model="labelForm.title" placeholder="请输入标题" autocomplete="off"></el-input>
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
import { bookFind, bookSave, bookDetail, bookUpdate } from '@/api/novel'
export default {
  data() {
    return {
      // 搜索表单
      searchForm: {
        pageNo:1,
        pageSize: 20,
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '排序', prop: 'sortNum', sortable: true},
        {label: '书名', prop: 'bookTitle'},
        {label: '作者', prop: 'authorName'},
        {label: '字数', prop: 'wordCount'},
        {slot: 'bookState', label: '状态', prop: 'bookState'},
        {label: '分类名', prop: 'typeName'},
        {slot: 'chargeType', label: '付费类型', prop: 'chargeType'},
        {slot: 'isTop', label: '是否置顶', prop: 'isTop'},
        {label: '创建时间', prop: 'createTime'},
        {label: '更新时间', prop: 'updateTime'},
        {slot: 'action', label: '操作', prop: 'action', fixed:'right', width: '280'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      labelForm: {
        labelId: '',
        title: '',
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
      bookFind(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
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
        this.labelForm.labelId = ''
        this.labelForm.title = ''
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
          const { labelId } = this.labelForm
          bookSave(this.labelForm).then(()=>{
            this.apiLabelList()
            this.visible = false
            this.$refs.label.resetFields()
            this.$message.success(`${labelId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiLabelDetail({ labelId, title }) {
      this.title = '编辑'
      this.labelForm.labelId = labelId
      this.labelForm.title = title
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 删除数据接口
    apiLabelDelete({ labelId: bookLabelId }) {
      labelDelete({ bookLabelId }).then(() => {
        this.apiLabelList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
