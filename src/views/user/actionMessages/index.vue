<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </el-row>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #isDel="{row}">
        <el-tag :type="row.isDel == 0 ? 'success' : 'danger'">{{ row.isDel == 0 ? '已启用' : '已禁用' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiEventDetail(row)">编辑</el-button>
        <el-popconfirm @onConfirm="onDel(row)" :title="`确定删除吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogCancle">取 消</el-button>
        <el-button type="primary" @click="onDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { eventList, eventSave, eventDel } from '@/api/user'
import MyTable from '@/components/MyTable/index.vue'
export default {
  components: {
    MyTable
  },
  data() {
    return {
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '活动名称', prop: 'eventName'},
        {label: '活动内容', prop: 'eventContent'},
        {slot: 'isDel', label: '状态', prop: 'isDel'},
        {label: '关联链接', prop: 'eventUrl'},
        {label: '开始时间', prop: 'eventStartTime'},
        {label: '结束时间', prop: 'eventEndTime'},
        {label: '创建人', prop: 'createName'},
        {label: '创建时间', prop: 'createTime'},
        {slot: 'action', label: '操作', prop: 'action'},
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
      eventList({pageNo:1, pageSize: 20}).then(res => {
        this.tableList = res.list || []
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
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
