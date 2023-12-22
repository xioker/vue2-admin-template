<template>
  <div>
    <el-form inline>
      <el-form-item label="发送状态">
        <el-select v-model="searchForm.sendStatus" placeholder="请选择发送状态" >
          <el-option label="待发送" :value="0"></el-option>
          <el-option label="已发送" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送类型">
        <el-select v-model="searchForm.sendCustType" placeholder="请选择发送类型" >
          <el-option label="全体" :value="0"></el-option>
          <el-option label="会员" :value="1"></el-option>
          <el-option label="普通用户" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="apiMailList">查询</el-button>
        <el-button type="info" @click.stop="onReset">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #img="{row}">
        <el-image :preview-src-list="[row.img]" :src="row.img || require('@/assets/images/head-no.png')" fit="cover" style="width:50px;height:50px;border-radius: 50%;">
          <div slot="error" class="flex-c-c img-err">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </template>
      <template #sendCustType="{row}">
        <el-tag type="info">{{ ['全体','会员','普通用户'][row.sendCustType] }}</el-tag>
      </template>
      <template #sendStatus="{row}">
        <el-tag size="mini" :type="row.sendStatus && row.sendStatus == 1 ? 'success' : 'danger'">{{ row.sendStatus && row.sendStatus == 1 ? '已发送' : '未发送' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiMailDetail(row)" :disabled="row.sendStatus == 1">编辑</el-button>
        <el-popconfirm @onConfirm="onStatus(row)" :title="`确定发送吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="success" :disabled="row.sendStatus == 1">发送</el-button>
        </el-popconfirm>
        <el-popconfirm @onConfirm="onDel(row)" :title="`确定删除吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination" />
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="mail" :model="mailForm" label-position="right" label-width="80px">
        <el-form-item label="标题" prop="titile" :rules="[{trigger:'blur',message: '标题不能为空',required: true}]">
          <el-input type="text" v-model="mailForm.titile" placeholder="请输入标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" :rules="[{trigger:'blur',message: '内容不能为空',required: true}]">
          <el-input type="textarea" v-model="mailForm.content" placeholder="请输入内容" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发送类型" prop="sendCustType" :rules="[{trigger:'blur',message: '发送类型不能为空',required: true}]">
          <el-select v-model="mailForm.sendCustType" placeholder="请选择发送类型" style="width:100%">
            <el-option label="全体" :value="0">全体</el-option>
            <el-option label="会员" :value="1">会员</el-option>
            <el-option label="普通用户" :value="2">普通用户</el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="发送状态" prop="sendStatus">
          <el-radio-group v-model="mailForm.sendStatus">
            <el-radio :label="0">不发送</el-radio>
            <el-radio :label="1">发送</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="图片" prop="img">
          <ImageUpload ref="up" :url.sync="mailForm.img" :params="{type: 1, module: 4 }"></ImageUpload>
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
import ImageUpload from '@/components/Upload/ImageUpload.vue'
import { mailList, mailDel, mailSave, mailSend } from '@/api/user'
export default {
  components: { ImageUpload },
  data() {
    return {
      searchForm: {
        pageNo: 1,
        pageSize: 20,
        sendStatus: '',
        sendCustType: '',
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
        {label: '标题', prop: 'titile'},
        {slot: 'img',label: '图片', prop: 'img'},
        {label: '内容', prop: 'content'},
        {label: '创建人', prop: 'createName'},
        {label: '创建时间', prop: 'createTime'},
        {slot: 'sendStatus',label: '发送状态', prop: 'sendStatus'},
        {slot: 'sendCustType',label: '发送类型', prop: 'sendCustType'},
        {label: '发送时间', prop: 'sendTime'},
        {slot: 'action', label: '操作', prop: 'action', fixed: 'right', width:'280'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      mailForm: {
        maiId: '',
        titile: '',
        content: '',
        sendCustType: '',
        sendStatus: 0,
        img: ''
      }
    }
  },
  created() {
    this.apiMailList()
  },
  methods: {
    // 列表接口
    apiMailList(){
      if(this.tableLoading === false) this.tableLoading = true
      mailList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiMailList()
    },
    onReset(){
      this.searchForm.sendCustType = ''
      this.searchForm.sendStatus = ''
      this.searchForm.createTimeStart = ''
      this.searchForm.createTimeEnd = ''
      this.apiMailList()
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.mailForm.maiId = ''
        this.mailForm.titile = ''
        this.mailForm.content = ''
        this.mailForm.sendCustType = ''
        this.mailForm.sendStatus = 0
        this.mailForm.img = ''
      })
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.mail.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.mail.validate((valid) => {
        if(valid){
          const { maiId } = this.mailForm
          mailSave(this.mailForm).then(()=>{
            this.apiMailList()
            this.visible = false
            this.$refs.mail.resetFields()
            this.$message.success(`${maiId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiMailDetail({maiId, titile, content, isDel, sendCustType, sendStatus, img }) {
      this.title = '编辑'
      this.mailForm.maiId = maiId
      this.mailForm.titile = titile
      this.mailForm.content = content
      this.mailForm.sendCustType = Number(sendCustType)
      this.mailForm.sendStatus = Number(sendStatus || 0)
      this.mailForm.img = img
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 发送站内信操作事件
    onStatus({ maiId:mailId }){
      mailSend({ mailId }).then(() => {
        this.apiMailList()
        this.$message.success(`发送成功`)
      })
    },
    // 删除站内信操作事件
    onDel({ maiId:mailId }){
      mailDel({ mailId }).then(() => {
        this.apiMailList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
