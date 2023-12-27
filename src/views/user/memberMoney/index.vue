<template>
  <div>
    <el-form inline>
      <el-form-item label="是否限时" >
        <el-select v-model="searchForm.isLimitedTime" placeholder="请选择是否限时" clearable>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="限时开始时间">
        <el-date-picker v-model="searchForm.beginTime" type="date" placeholder="选择开始时间" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="限时结束时间">
        <el-date-picker v-model="searchForm.endTime" type="date" placeholder="选择开始时间" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="apiThaliList">查询</el-button>
        <el-button type="info" @click.stop="onReset">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns" style="overflow-y: auto;max-height:calc(100vh - 150px);height:calc(100vh - 150px)">
      <template #isLimitedTime="{row}">
        <el-tag size="mini" :type="row.isLimitedTime == 1 ? 'danger' : 'success'">{{ row.isLimitedTime == 1 ? '是' : '否' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiThaliDetail(row)">编辑</el-button>
        <el-popconfirm @onConfirm="onDel(row)" :title="`确定删除吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="thali" :model="thaliForm" label-position="right" label-width="100px">
        <el-form-item label="标题" prop="thaliName" :rules="[{trigger:'blur',message: '标题不能为空',required: true}]">
          <el-input type="text" v-model="thaliForm.thaliName" placeholder="请输入标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price" :rules="[{trigger:'blur',message: '价格不能为空',required: true}]">
          <el-input type="number" v-model="thaliForm.price" placeholder="请输入价格" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="天数" prop="day" :rules="[{trigger:'blur',message: '天数不能为空',required: true}]">
          <el-input type="number" v-model="thaliForm.day" placeholder="请输入天数" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="赠送书币" prop="gold">
          <el-input type="text" v-model="thaliForm.gold" placeholder="请输入赠送书币" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="" prop="quotaCount">
          <template #label>
            <span>限购次数</span>
            <el-tooltip class="item" effect="dark" content="0代表不限购" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <el-input type="text" v-model="thaliForm.quotaCount" placeholder="请输入限购次数" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="限时开始时间" prop="limitedStartTime">
          <el-date-picker v-model="thaliForm.limitedStartTime" type="date" placeholder="选择开始时间" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="限时结束时间" prop="limitedEndTime">
          <el-date-picker v-model="thaliForm.limitedEndTime" type="date" placeholder="选择结束时间" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否限时" prop="isLimitedTime">
          <el-radio-group v-model="thaliForm.isLimitedTime">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
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
import { findMemberThali, memberThaliAdd, memberThaliDelete } from '@/api/user'
export default {
  data() {
    return {
      searchForm: {
        isLimitedTime: '',
        beginTime: '',
        endTime: '',
      },
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '序号', prop: 'index'},
        {label: '标题', prop: 'thaliName'},
        {label: '价格', prop: 'price'},
        {label: '限购', prop: 'quotaCount'},
        {label: '天数', prop: 'day'},
        {label: '赠送书币', prop: 'gold'},
        {slot: 'isLimitedTime', label: '是否限时', prop: 'isLimitedTime'},
        {label: '限时开始时间', prop: 'limitedStartTime'},
        {label: '限时结束时间', prop: 'limitedEndTime'},
        {label: '创建人', prop: 'createName'},
        // {label: '创建时间', prop: 'createTime'},
        {slot: 'action', label: '操作', prop: 'action', fixed: 'right', width: '200'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      thaliForm: {
        thaliId:'',
        thaliName: '',
        day: '',
        gold: '',
        isLimitedTime: 0,
        price: '',
        quotaCount: 0,
        limitedStartTime: '',
        limitedEndTime: '',
      }
    }
  },
  created() {
    this.apiThaliList()
  },
  methods: {
    // 列表接口
    apiThaliList(){
      if(this.tableLoading === false) this.tableLoading = true
      findMemberThali(this.searchForm).then(res => {
        this.tableList = res || []
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
    },
    onReset(){
      this.searchForm.isLimitedTime = ''
      this.searchForm.beginTime = ''
      this.searchForm.endTime = ''
      this.apiThaliList()
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.thaliForm.thaliId = ''
        this.thaliForm.thaliName = ''
        this.thaliForm.day = ''
        this.thaliForm.gold = ''
        this.thaliForm.isLimitedTime = 0
        this.thaliForm.price = ''
        this.thaliForm.quotaCount = 0
        this.thaliForm.limitedStartTime = ''
        this.thaliForm.limitedEndTime = ''
      })
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.thali.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.thali.validate((valid) => {
        if(valid){
          const { thaliId } = this.thaliForm
          memberThaliAdd(this.thaliForm).then(()=>{
            this.apiThaliList()
            this.visible = false
            this.$refs.thali.resetFields()
            this.$message.success(`${thaliId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiThaliDetail({thaliId, thaliName, day, gold, isLimitedTime, price, quotaCount, limitedStartTime, limitedEndTime}) {
      this.title = '编辑'
      this.thaliForm.thaliId = thaliId
      this.thaliForm.thaliName = thaliName
      this.thaliForm.day = day
      this.thaliForm.gold = gold
      this.thaliForm.price = price 
      this.thaliForm.isLimitedTime = Number(isLimitedTime || 0)
      this.thaliForm.quotaCount = Number(quotaCount || 0)
      this.thaliForm.limitedStartTime = limitedStartTime
      this.thaliForm.limitedEndTime = limitedEndTime
      this.visible = true
    },
    // 删除操作事件
    onDel({thaliId}){
      memberThaliDelete({thaliId}).then(() => {
        this.apiThaliList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
