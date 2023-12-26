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
        <el-popconfirm @onConfirm="apiSectionDelete(row)" :title="`确定删除标签【${row.sectionTitle}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <!-- 修改新增弹框 -->
    <el-drawer :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
			<template #default >
				<el-card v-loading="loading">
					<el-form label-position="right" label-width="100px" ref="sForm" :model="sectionForm" style="width: 90%;margin: auto;">
            <el-form-item label="标题" prop="title" :rules="[{trigger:'blur',message: '标题不能为空',required: true}]">
              <el-input v-model="sectionForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
						<el-form-item label="字数" prop="wordCount">
              <el-input v-model="sectionForm.wordCount" placeholder="请输入字数"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sortNum">
              <el-input-number v-model="sectionForm.sortNum" placeholder="请输入排序"></el-input-number>
            </el-form-item>
            <el-form-item label="是否免费" prop="isFree">
              <el-radio-group v-model="sectionForm.isFree">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否目录加粗" prop="isBold">
              <el-radio-group v-model="sectionForm.isBold">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <Tinymce v-model="sectionForm.content" :params="{type: 1, module: 7 }"></Tinymce>
            </el-form-item>
					</el-form>
					<div style="text-align: start;width: 90%;margin: auto;">
						<el-button type="primary" @click="onDialogSure">保存</el-button>
						<el-button @click="onDialogCancle">取消</el-button>
					</div>
				</el-card>
			</template>
		</el-drawer>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce/index.vue'
import { sectionList, sectionDelete, sectionSave } from '@/api/novel'
export default {
  components: { Tinymce },
  props: ['params'],
  data() {
    return {
      // 搜索表单
      searchForm: {
        bookId: ''
      },
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        // {label: '序号', prop: 'index'},
        {label: '排序', prop: 'sortNum'},
        {label: '标题', prop: 'sectionTitle'},
        {label: '字数', prop: 'wordCount'},
        {slot: 'isFree', label: '是否免费', prop: 'isFree'},
        {slot: 'isBold', label: '是否目录加粗', prop: 'isBold'},
        {slot: 'action', label: '操作', prop: 'action', fixed:'right', width: '200'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      loading: false,
      sectionForm: {
        sectionId: '',
        title: '',
        wordCount: '',
        sortNum: 0,
        isFree: 0,
        isBold: 0,
        content: ''
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
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.sectionForm.sectionId = ''
        this.sectionForm.title = ''
        this.sectionForm.sortNum = 0
        this.sectionForm.isBold = 0
        this.sectionForm.isFree = 0
        this.sectionForm.wordCount = ''
        this.sectionForm.content = ''
      })
    },
    // 重置
    onReset(){
      this.searchForm.keyword = ''
      this.apiSectionList()
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.sForm.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.sForm.validate((valid) => {
        if(valid){
          this.loading = true
          const { sectionId } = this.sectionForm
          sectionSave(this.sectionForm).then(()=>{
            this.apiSectionList()
            this.visible = false
            this.$refs.sForm.resetFields()
            this.$message.success(`${sectionId ? '编辑' : '新增'}成功`)
          }).finally(() => this.loading = false)
        }
      })
    },
    // 详情数据接口
    apiSectionDetail({ sectionId, sectionTitle, sortNum, wordCount, isBold, isFree, content }) {
      this.title = '编辑'
      this.sectionForm.sectionId = sectionId
      this.sectionForm.title = sectionTitle
      this.sectionForm.wordCount = wordCount
      this.sectionForm.content = content
      this.sectionForm.sortNum = Number(sortNum || 0)
      this.sectionForm.isBold = Number(isBold || 0)
      this.sectionForm.isFree = Number(isFree || 0)
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
::v-deep .el-drawer {
	width: calc(100vw - 210px) !important;
  header{
    margin-bottom: 0;
  }
  .el-card{
    margin: 20px;
    overflow-y: auto;
    height: calc(100vh - 100px);
  }
}
</style>
