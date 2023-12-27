<template>
  <div>
    <el-form inline>
      <el-form-item label="内容">
        <el-input v-model="searchForm.content" type="text" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="apiEventList">查询</el-button>
        <el-button type="info" @click.stop="onReset">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #eventImg="{row}">
        <el-image :preview-src-list="[row.eventImg]" :src="row.eventImg || require('@/assets/images/img-no.jpg')" fit="cover" style="width:50px;height:50px;border-radius: 50%;">
          <div slot="error" class="flex-c-c img-err">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </template>
      <template #isDel="{row}">
        <el-tag size="mini" :type="row.isDel == 0 ? 'success' : 'danger'">{{ row.isDel == 0 ? '已启用' : '已禁用' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiEventDetail(row)">编辑</el-button>
        <el-popconfirm @onConfirm="onDel(row)" :title="`确定删除吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination" />
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="event" :model="eventForm" label-position="right" label-width="80px">
        <el-form-item label="活动名称" prop="eventName" :rules="[{trigger:'blur',message: '活动名称不能为空',required: true}]">
          <el-input type="text" v-model="eventForm.eventName" placeholder="请输入活动名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动内容" prop="eventContent" :rules="[{trigger:'blur',message: '活动内容不能为空',required: true}]">
          <el-input type="textarea" v-model="eventForm.eventContent" placeholder="请输入活动内容" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="eventStartTime" :rules="[{trigger:'blur',message: '开始时间不能为空',required: true}]">
          <el-date-picker v-model="eventForm.eventStartTime" type="date" placeholder="选择开始时间" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="eventEndTime" :rules="[{trigger:'blur',message: '结束时间不能为空',required: true}]">
          <el-date-picker v-model="eventForm.eventEndTime" type="date" placeholder="选择结束时间" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="关联链接" prop="eventUrl">
          <el-input type="text" v-model="eventForm.eventUrl" placeholder="请输入关联链接" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="eventImg">
          <ImageUpload ref="up" :url.sync="eventForm.eventImg" :params="{type: 1, module: 5 }"></ImageUpload>
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
import { eventList, eventSave, eventDel } from '@/api/user'
export default {
  components: { ImageUpload },
  data() {
    return {
      searchForm: {
        pageNo: 1,
        pageSize: 20,
        content: '',
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '序号', prop: 'index'},
        {label: '活动名称', prop: 'eventName'},
        {slot: 'eventImg', label: '图片', prop: 'eventImg'},
        {label: '活动内容', prop: 'eventContent'},
        // {slot: 'isDel', label: '状态', prop: 'isDel'},
        {label: '关联链接', prop: 'eventUrl'},
        {label: '开始时间', prop: 'eventStartTime'},
        {label: '结束时间', prop: 'eventEndTime'},
        {label: '创建人', prop: 'createName'},
        {label: '创建时间', prop: 'createTime'},
        {slot: 'action', label: '操作', prop: 'action', width: '180'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      eventForm: {
        eventId: '',
        eventName: '',
        eventContent: '',
        eventStartTime: '',
        eventEndTime: '',
        eventUrl: '',
        eventImg: '',
      }
    }
  },
  created() {
    this.apiEventList()
  },
  methods: {
    // 列表接口
    apiEventList(){
      if(this.tableLoading === false) this.tableLoading = true
      eventList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiEventList()
    },
    onReset(){
      this.searchForm.content = ''
      this.apiEventList()
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.eventForm.eventId = ''
        this.eventForm.eventName = ''
        this.eventForm.eventContent = ''
        this.eventForm.eventStartTime = ''
        this.eventForm.eventEndTime = ''
        this.eventForm.eventUrl = ''
        this.eventForm.eventImg = ''
      })
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.event.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.event.validate((valid) => {
        if(valid){
          const { eventId } = this.eventForm
          eventSave(this.eventForm).then(()=>{
            this.apiEventList()
            this.visible = false
            this.$refs.event.resetFields()
            this.$message.success(`${eventId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiEventDetail({eventId, eventName, eventContent, eventStartTime, eventEndTime, eventUrl, eventImg, isDel}) {
      this.title = '编辑'
      this.eventForm.eventId = eventId
      this.eventForm.eventName = eventName
      this.eventForm.eventContent = eventContent
      this.eventForm.eventStartTime = eventStartTime
      this.eventForm.eventEndTime = eventEndTime
      this.eventForm.eventUrl = eventUrl
      this.eventForm.eventImg = eventImg
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 删除站内信操作事件
    onDel({ eventId }){
      eventDel({ eventId }).then(() => {
        this.apiEventList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
