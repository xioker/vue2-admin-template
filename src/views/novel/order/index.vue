<template>
  <div>
    <el-form inline>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input type="text" v-model="searchForm.orderNo" placeholder="请输入订单编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input type="text" v-model="searchForm.phone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态" clearable>
          <el-option label="未支付" :value="0"></el-option>
          <el-option label="已支付" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="apiOrderList">查询</el-button>
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
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiOrderDetail(row)">编辑</el-button>
        <el-popconfirm @onConfirm="apiOrderDelete(row)" :title="`确定删除标签【${row.title}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination"></Pagination>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="label" :model="orderForm" label-position="right" label-width="60px">
        <el-form-item label="标题" prop="title" :rules="[{trigger:'blur',message: '标题不能为空',required: true}]">
          <el-input type="text" v-model="orderForm.title" placeholder="请输入标题" autocomplete="off"></el-input>
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
import { orderList, orderDel } from '@/api/novel'
export default {
  data() {
    return {
      // 搜索表单
      searchForm: {
        pageNo:1,
        pageSize: 20,
        orderNo: '',
        phone: '',
        orderStatus: '',
        createTimeStart: '',
        createTimeEnd: '',
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '序号', prop: 'index'},
        {label: '标题', prop: 'title'},
        // {label: '创建人', prop: 'createdId'},
        {label: '创建时间', prop: 'createdTime'},
        // {label: '更新人', prop: 'updateId'},
        {label: '更新时间', prop: 'updateTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      orderForm: {
        labelId: '',
        title: '',
      }
    }
  },
  created() {
    this.apiOrderList()
  },
  methods: {
    // 列表接口
    apiOrderList(){
      if(this.tableLoading === false) this.tableLoading = true
      orderList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiOrderList()
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.orderForm.labelId = ''
        this.orderForm.title = ''
      })
    },
    // 重置
    onReset(){
      this.searchForm.keyword = ''
      this.apiOrderList()
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.label.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.label.validate((valid) => {
        if(valid){
          const { labelId } = this.orderForm
          labelSave(this.orderForm).then(()=>{
            this.apiOrderList()
            this.visible = false
            this.$refs.label.resetFields()
            this.$message.success(`${labelId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiOrderDetail({ labelId, title }) {
      this.title = '编辑'
      this.orderForm.labelId = labelId
      this.orderForm.title = title
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 删除数据接口
    apiOrderDelete({ labelId: bookLabelId }) {
      labelDelete({ bookLabelId }).then(() => {
        this.apiOrderList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
