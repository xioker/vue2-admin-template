<template>
  <div>
    <el-form inline>
      <el-form-item label="关键字" prop="keyword">
        <el-input type="text" v-model="searchForm.keyword" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="apiBookTypeList">查询</el-button>
        <el-button type="info" @click.stop="onReset">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #typePic="{row}">
        <el-image :src="row.typePic || require('@/assets/images/img-no.jpg')" fit="cover" style="width:150px;height:50px"></el-image>
      </template>
      <template #channelBelong="{row}">
        <span>{{ row.channelBelong == 1 ? '男' : '女' }}</span>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiBookTypeDetail(row)">编辑</el-button>
        <el-button size="mini" type="success" @click="$parent.changeCom(row)">二级分类</el-button>
        <el-popconfirm @onConfirm="apiBookTypeDelete(row)" :title="`确定删除分类【${row.bigTypeTitle}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination" />
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" :before-close="onDialogCancle">
      <el-form ref="type" :model="typeForm" label-position="right" label-width="110px">
        <el-form-item label="一级分类标题" prop="bigTypeTitle" :rules="[{trigger:'blur',message: '一级分类标题不能为空',required: true}]">
          <el-input type="text" v-model="typeForm.bigTypeTitle" placeholder="请输入一级分类标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题简写" prop="bigTypeDesc">
          <el-input type="text" v-model="typeForm.bigTypeDesc" placeholder="请输入标题简写" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortNum">
          <el-input-number v-model="typeForm.sortNum"></el-input-number>
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
import { bookBigTypeList, bookBigTypeDetail, bookBigTypeDelete, bookBigTypeSave } from '@/api/novel'
export default {
  data() {
    return {
      searchForm: {
        keyword: '',
        pageNo: 1,
        pageSize: 20,
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '序号', prop: 'index'},
        {label: '一级分类标题', prop: 'bigTypeTitle'},
        {label: '标题简写', prop: 'bigTypeDesc'},
        {label: '排序', prop: 'sortNum'},
        {label: '创建时间', prop: 'createdTime'},
        {label: '更新时间', prop: 'updateTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      typeForm: {
        bigTypeId: '',
        bigTypeTitle: '',
        bigTypeDesc: '',
        sortNum: 0,
      }
    }
  },
  created() {
    this.apiBookTypeList()
  },
  methods: {
    // 列表接口
    apiBookTypeList(){
      if(this.searchForm.tableLoading === false) this.tableLoading = true
      bookBigTypeList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiBookTypeList()
    },
    onReset(){
      this.searchForm.keyword = ''
      this.apiBookTypeList()
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.typeForm.bigTypeId = ''
        this.typeForm.bigTypeTitle = ''
        this.typeForm.bigTypeDesc = ''
        this.typeForm.sortNum = 0
      })
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.type.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.type.validate((valid) => {
        if(valid){
          const { bigTypeId } = this.typeForm
          bookBigTypeSave(this.typeForm).then(()=>{
            this.apiBookTypeList()
            this.visible = false
            this.$refs.type.resetFields()
            this.$message.success(`${bigTypeId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiBookTypeDetail({bigTypeId, bigTypeTitle, bigTypeDesc, sortNum }) {
      this.title = '编辑'
      this.typeForm.bigTypeId = bigTypeId
      this.typeForm.bigTypeTitle = bigTypeTitle
      this.typeForm.bigTypeDesc = bigTypeDesc
      this.typeForm.sortNum = Number(sortNum || 0)
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 删除数据接口
    apiBookTypeDelete({ bigTypeId:bookBigTypeId  }) {
      bookBigTypeDelete({ bookBigTypeId }).then(res => {
        this.apiBookTypeList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
