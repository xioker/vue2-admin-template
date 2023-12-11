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
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" :before-close="onDialogCancle">
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
import { labelList, labelDelete, labelSave } from '@/api/novel'
import MyTable from '@/components/MyTable/index.vue'
export default {
  components: {
    MyTable
  },
  data() {
    return {
      // 搜索表单
      searchForm: {
        pageNo:1,
        pageSize: 20,
        keyword: ''
      },
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
      labelList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
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
          labelSave(this.labelForm).then(()=>{
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
