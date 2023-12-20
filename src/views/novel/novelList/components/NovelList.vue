<template>
  <div>
    <el-form inline>
      <el-form-item label="标题" prop="keyword">
        <el-input type="text" v-model="searchForm.keyword" placeholder="请输入标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="apiNovelList">查询</el-button>
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
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiNovelDetail(row)">编辑</el-button>
        <el-button size="mini" type="success" @click="$parent.changeCom(row)">小说章节</el-button>
        <el-popconfirm @onConfirm="apiNovelDelete(row)" :title="`确定删除小说【${row.bookTitle}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination" />
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="novel" :model="novelForm" label-position="right" label-width="80px">
        <el-form-item label="标题" prop="bookTitle" :rules="[{trigger:'blur',message: '标题不能为空',required: true}]">
          <el-input type="text" v-model="novelForm.bookTitle" placeholder="请输入标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="bookPrice" :rules="[{trigger:'blur',message: '价格不能为空',required: true}]">
          <el-input type="text" v-model="novelForm.bookPrice" placeholder="请输入价格" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortNum">
          <el-input type="text" v-model="novelForm.sortNum" placeholder="请输入排序" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字数" prop="wordCount">
          <el-input type="text" v-model="novelForm.wordCount" placeholder="请输入字数" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="novelForm.bookTitle" placeholder="请输入标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-input type="textarea" v-model="novelForm.bookCover" placeholder="请输入标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-radio-group v-model="novelForm.isTop">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="bookState">
          <el-radio-group v-model="novelForm.bookState">
            <el-radio :label="0">更新</el-radio>
            <el-radio :label="1">完结</el-radio>
            <el-radio :label="2">停更</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="付费类型" prop="chargeType">
          <el-radio-group v-model="novelForm.chargeType">
            <el-radio :label="0">完全免费</el-radio>
            <el-radio :label="1">VIP免费</el-radio>
            <el-radio :label="2">章节收费</el-radio>
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
      novelForm: {
        authorId: '',
        typeId: '',
        bookTitle: '',
        bookPrice: '',
        sortNum: 0,
        wordCount: '',
        bookDesc: '',
        bookState: 0,
        chargeType: 0,
        isTop: 0,
        isShow: 0,
        bookCover: '',
      }
    }
  },
  created() {
    this.apiNovelList()
  },
  methods: {
    // 列表接口
    apiNovelList(){
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
      this.apiNovelList()
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.novelForm.authorId = ''
        this.novelForm.bookTitle = ''
        this.novelForm.bookPrice = ''
        this.novelForm.bookCover = ''
        this.novelForm.bookDesc = ''
        this.novelForm.sortNum = 0
        this.novelForm.wordCount = ''
        this.novelForm.bookState = 0
        this.novelForm.chargeType = 0
        this.novelForm.isTop = 0
        this.novelForm.isShow = 0
      })
    },
    // 重置
    onReset(){
      this.searchForm.keyword = ''
      this.apiNovelList()
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.novel.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.novel.validate((valid) => {
        if(valid){
          const { authorId } = this.novelForm
          bookSave(this.novelForm).then(()=>{
            this.apiNovelList()
            this.visible = false
            this.$refs.novel.resetFields()
            this.$message.success(`${authorId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiNovelDetail({ bookTitle, bookPrice, bookCover, bookDesc, sortNum, authorId, wordCount, bookState, chargeType, isTop, isShow}) {
      this.title = '编辑'
      this.novelForm.authorId = authorId
      this.novelForm.bookTitle = bookTitle
      this.novelForm.bookPrice = bookPrice
      this.novelForm.bookCover = bookCover
      this.novelForm.bookDesc = bookDesc
      this.novelForm.sortNum = Number(sortNum || 0)
      this.novelForm.wordCount = wordCount
      this.novelForm.bookState = Number(bookState || 0)
      this.novelForm.chargeType = Number(chargeType || 0)
      this.novelForm.isTop = Number(isTop || 0)
      this.novelForm.isShow = Number(isShow || 0)
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 删除数据接口
    apiNovelDelete({ labelId: bookLabelId }) {
      labelDelete({ bookLabelId }).then(() => {
        this.apiNovelList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
