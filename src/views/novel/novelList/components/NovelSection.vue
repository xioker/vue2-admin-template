<template>
  <div>
    <el-form inline>
      <el-form-item label="标题" prop="keyword">
        <el-input type="text" v-model="searchForm.keyword" placeholder="请输入标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="apiSectionList">查询</el-button>
        <el-button type="info" @click.stop="onReset">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
      </el-form-item>
      <el-button type="success" @click="$parent.changeCom" style="float: right;">返回小说列表</el-button>
    </el-form>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #isFree="{row}">
        <el-tag :type="row.isFree == 0 ? 'success' : 'danger'">{{ row.isFree == 1 ? '收费' : '免费' }}</el-tag>
      </template>
      <template #isBold="{row}">
        <el-switch :value="row.isBold" active-value="1" inactive-value="0"></el-switch>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiSectionDetail(row)">编辑</el-button>
        <el-popconfirm @onConfirm="apiSectionDelete(row)" :title="`确定删除标签【${row.title}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination" />
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="label" :model="sectionForm" label-position="right" label-width="60px">
        <el-form-item label="标题" prop="title" :rules="[{trigger:'blur',message: '标题不能为空',required: true}]">
          <el-input type="text" v-model="sectionForm.title" placeholder="请输入标题" autocomplete="off"></el-input>
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
import { sectionList, sectionDelete, sectionSave } from '@/api/novel'
export default {
  props: ['params'],
  data() {
    return {
      // 搜索表单
      searchForm: {
        pageNo:1,
        pageSize: 20,
        bookId: ''
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '序号', prop: 'index'},
        {label: '标题', prop: 'sectionTitle'},
        {label: '字数', prop: 'wordCount'},
        {slot: 'isFree', label: '是否免费', prop: 'isFree'},
        {slot: 'isBold', label: '是否目录加粗', prop: 'isBold'},
        {slot: 'action', label: '操作', prop: 'action', fixed:'right', width: '200'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      sectionForm: {
        sectionId: '',
        title: '',
      }
    }
  },
  created() {
    this.searchForm.bookId = this.params.bookId || ''
    this.apiSectionList()
  },
  methods: {
    // 列表接口
    apiSectionList(){
      if(this.tableLoading === false) this.tableLoading = true
      sectionList(this.searchForm).then(res => {
        this.tableList = res || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiSectionList()
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.sectionForm.sectionId = ''
        this.sectionForm.title = ''
      })
    },
    // 重置
    onReset(){
      this.searchForm.keyword = ''
      this.apiSectionList()
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.label.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.label.validate((valid) => {
        if(valid){
          const { sectionId } = this.sectionForm
          sectionSave(this.sectionForm).then(()=>{
            this.apiSectionList()
            this.visible = false
            this.$refs.label.resetFields()
            this.$message.success(`${sectionId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiSectionDetail({ sectionId, title }) {
      this.title = '编辑'
      this.sectionForm.sectionId = sectionId
      this.sectionForm.title = title
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 删除数据接口
    apiSectionDelete({ sectionId:bookSectionId }) {
      sectionDelete({ bookSectionId }).then(() => {
        this.apiSectionList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
