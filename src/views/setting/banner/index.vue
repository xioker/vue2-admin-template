<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </el-row>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #bannerSort="{row}">
        <el-input size="mini" type="number" v-model="row.bannerSort" @blur="(e)=>onSortChange(e,row)"></el-input>
      </template>
      <template #isDel="{row}">
        <el-tag :type="row.isDel == 1 ? 'danger' : 'success'">{{ row.status == 1 ? '已停用' : '已启用' }}</el-tag>
      </template>
      <template #bannerUrl="{row}">
        <el-image :preview-src-list="[row.bannerUrl]" :src="row.bannerUrl || require('@/assets/images/img-no.jpg')" fit="cover" style="width:50px;height:50px;border-radius: 50%;">
          <div slot="error" class="flex-c-c img-err">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiBannerDetail(row)">编辑</el-button>
        <el-popconfirm @onConfirm="onStatus(row)" :title="`确定删除吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination"></Pagination>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="900px" :before-close="onDialogCancle">
      <el-form ref="banner" :model="bannerForm" label-position="right" label-width="90px">
        <el-form-item label="关联小说" prop="bookName" :rules="[{trigger:'blur',message: '关联小说不能为空',required: true}]">
          <el-input type="text" v-model="bannerForm.bookName" placeholder="请选择关联小说" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="banner图" prop="bannerUrl">
          <ImageUpload :url.sync="bannerForm.bannerUrl" :params="{type: 1, module: 3 }"></ImageUpload>
        </el-form-item>
        <el-form-item label="排序" prop="bannerSort">
          <el-input-number v-model="bannerForm.bannerSort"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="bannerForm.isDel">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <h4>关联小说列表</h4>
      <el-form inline>
        <el-form-item>
          <el-input type="text" v-model="novelSearch.bookTitle" placeholder="请输入书名" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="text" v-model="novelSearch.authorName" placeholder="请输入作者名" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="apiNovelList">搜索</el-button>
        </el-form-item>
      </el-form>
      <MyTable border v-loading="novelLoading" :data="novelLists" :columns="novelsc">
        <template #bookCover="{row}">
          <el-image :preview-src-list="[row.bookCover]" :src="row.bookCover || require('@/assets/images/head-no.png')" fit="cover" style="width:50px;height:50px;border-radius: 50%;">
            <div slot="error" class="flex-c-c img-err">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
        <template #action="{row}">
          <el-link :underline="false" type="danger" icon="el-icon-circle-close" @click="onNovel(row)" v-if="bannerForm.bookId == row.bookId">取消</el-link>
          <el-link :underline="false" type="success" icon="el-icon-circle-check" @click="onNovel(row,1)" v-else>选取</el-link>
        </template>
      </MyTable>
      <Pagination :hidden="!novelTotal" :total="novelTotal" :page.sync="novelSearch.pageNo" :limit.sync="novelSearch.pageSize" style="text-align: right;" @pagination="onNovelPagination"></Pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogCancle">取 消</el-button>
        <el-button type="primary" @click="onDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { bannerList, bannerDetail, bannerSave, bannerDel, bannerSort } from '@/api/setting'
import { bookFind } from '@/api/novel'
import ImageUpload from '@/components/Upload/ImageUpload.vue'
export default {
  components: { ImageUpload },
  data() {
    return {
      searchForm: {
        pageNo: 1,
        pageSize: 20,
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {slot: 'bannerSort', label: '排序', prop: 'bannerSort', width: '100'},
        {label: '关联小说名称', prop: 'bookName'},
        {slot: 'bannerUrl', label: 'banner图', prop: 'bannerUrl'},
        {slot: 'isDel', label: '状态', prop: 'isDel'},
        {label: '创建人', prop: 'createName'},
        {label: '创建时间', prop: 'createTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      novelSearch: {
        pageNo: 1,
        pageSize: 10,
        bookTitle: '',
        authorName: ''
      },
      novelTotal: 0,
      novelLists: [],
      // 表格loading
      novelLoading: false,
      novelsc: [
        {label: '书名', prop: 'bookTitle'},
        {slot:'bookCover',label: '封面图', prop: 'bookCover'},
        {label: '作者', prop: 'authorName'},
        {label: '分类名', prop: 'typeName'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      bannerForm: {
        bannerId: '',
        bookId: '',
        bookName: '',
        bannerUrl: '',
        bannerSort: 0,
        isDel: 0
      }
    }
  },
  created() {
    this.apiBannerList()
  },
  methods: {
    // 列表接口
    apiBannerList(){
      if(this.searchForm.tableLoading === false) this.tableLoading = true
      bannerList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
    },
    // 小说列表接口
    apiNovelList(){
      if(this.novelLoading === false) this.novelLoading = true
      bookFind(this.novelSearch).then(res => {
        this.novelLists = res.list || []
        this.novelTotal = Number(res.total) || 0
      }).finally(()=>this.novelLoading = false)
    },
    onNovelPagination({page, limit}){
      this.novelSearch.pageNo = page
      this.novelSearch.pageSize = limit
      this.apiNovelList()
    },
    // 选取小说 1选取
    onNovel({ bookId, bookTitle },type){
      if(type === 1){
        this.bannerForm.bookId = bookId
        this.bannerForm.bookName = bookTitle
        return
      }
      this.bannerForm.bookId = ''
      this.bannerForm.bookName = ''
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiBannerList()
    },
    onSortChange(e,{ bannerId, bannerSort: sort }){
      bannerSort({ bannerId, sort }).then(()=>{
        this.apiBannerList()
        this.$message.success(`排序成功`)
      })
    },
    // 新增
    onAdd(){
      // 获取小说列表数据
      this.apiNovelList()
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.bannerForm.bannerId = ''
        this.bannerForm.bookId = ''
        this.bannerForm.bookName = ''
        this.bannerForm.bannerUrl = ''
        this.bannerForm.bannerSort = 0
        this.bannerForm.isDel = 0
      })
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.banner.clearValidate()
      this.novelSearch.bookTitle = ''
      this.novelSearch.authorName = ''
      this.visible = false
    },
    onDialogSure(){
      this.$refs.banner.validate((valid) => {
        if(valid){
          const { bannerId } = this.bannerForm
          bannerSave(this.bannerForm).then(()=>{
            this.apiBannerList()
            this.visible = false
            this.$refs.banner.resetFields()
            this.$message.success(`${bannerId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiBannerDetail({bannerId, bannerUrl, bannerSort, isDel, bookId, bookName }) {
      this.title = '编辑'
      // 获取小说列表数据
      this.apiNovelList()
      this.bannerForm.bannerId = bannerId
      this.bannerForm.bookId = bookId
      this.bannerForm.bookName = bookName
      this.bannerForm.bannerUrl = bannerUrl
      this.bannerForm.bannerSort = bannerSort
      this.bannerForm.isDel = Number(isDel)
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 状态操作事件
    onStatus({bannerId}){
      bannerDel({bannerId}).then(() => {
        this.apiBannerList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
  
</style>