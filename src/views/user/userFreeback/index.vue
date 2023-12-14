<template>
  <div>
    <el-form inline>
      <el-form-item label="联系方式" >
        <el-input v-model="searchForm.tel" placeholder="请输入联系方式" clearable></el-input>
      </el-form-item>
      <el-form-item label="回复状态" >
        <el-select v-model="searchForm.replyStatus" placeholder="请选择回复状态" clearable>
          <el-option label="已回复" :value="1"></el-option>
          <el-option label="待回复" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="反馈开始时间">
        <el-date-picker v-model="searchForm.createTimeStart" type="date" placeholder="选择开始时间" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="反馈结束时间">
        <el-date-picker v-model="searchForm.createTimeEnd" type="date" placeholder="选择开始时间" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="apiCustomerList">查询</el-button>
        <el-button type="info" @click.stop="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #replyStatus="{row}">
        <el-tag size="mini" :type="row.replyStatus == 1 ? 'success' : 'danger'">{{ row.replyStatus == 1 ? '已回复' : '待回复' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="onReplyDetail(row)" :disabled="row.replyStatus==1">回复</el-button>
        <el-popconfirm @onConfirm="onDel(row)" :title="`确定删除吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination" />
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body title="回复" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px">
      <el-form ref="back" :model="backForm" label-position="right" label-width="80px">
        <el-form-item label="回复内容" prop="content" :rules="[{trigger:'blur',message: '回复内容不能为空',required: true}]">
          <el-input type="textarea" v-model="backForm.content" placeholder="请输入回复内容" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { customerList, customerDel, customerReply } from '@/api/user'
export default {
  data() {
    return {
      searchForm: {
        pageNo: 1,
        pageSize: 20,
        replyStatus: '',
        tel: '',
        createTimeStart: '',
        createTimeEnd: ''
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '序号', prop: 'index'},
        {label: '昵称', prop: 'custName'},
        {label: '联系方式', prop: 'tel'},
        {label: 'QQ', prop: 'qq'},
        {label: '反馈内容', prop: 'content'},
        {label: '反馈时间', prop: 'craeteTime'},
        // {slot: 'isDel', label: '状态', prop: 'isDel'},
        {slot: 'replyStatus', label: '回复状态', prop: 'replyStatus'},
        {label: '回复内容', prop: 'reply'},
        {label: '回复时间', prop: 'replyTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      // 回复弹框
      visible: false,
      backForm: {
        provideId: '',
        content: '',
      }
    }
  },
  created() {
    this.apiCustomerList()
  },
  methods: {
    // 列表接口
    apiCustomerList(){
      if(this.searchForm.tableLoading === false) this.tableLoading = true
      customerList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiCustomerList()
    },
    onReset(){
      this.searchForm.replyStatus = ''
      this.searchForm.tel = ''
      this.searchForm.createTimeStart = ''
      this.searchForm.createTimeEnd = ''
      this.apiCustomerList()
    },
    // 详情数据接口
    onReplyDetail({ provideId }) {
      this.backForm.provideId = provideId
      this.visible = true
      this.$refs.back.clearValidate()
      this.$nextTick(()=>{
        this.backForm.content = ''
      })
    },
    // 回复操作事件
    onReply(){
      customerReply(this.backForm).then(() => {
        this.apiCustomerList()
        this.$message.success(`回复成功`)
        this.visible = false
      }).finally(()=>{})
    },
    onDialogSure(){
      this.$refs.back.validate((valid) => {
        if(valid){
          this.onReply()
        }
      })
    },
    // 删除操作事件
    onDel({provideId}){
      customerDel({provideId}).then(() => {
        this.apiCustomerList()
        this.$message.success(`删除成功`)
      })
    },
    
  },
}
</script>
<style lang="scss" scoped>

</style>
