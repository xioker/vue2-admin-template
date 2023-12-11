<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </el-row>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #isDel="{row}">
        <el-tag :type="row.isDel && row.isDel == 1 ? 'danger' : 'success'">{{ row.isDel && row.isDel == 1 ? '已停用' : '已启用' }}</el-tag>
      </template>
      <template #meetType="{row}">
        <span>{{ row.meetType == 1 ? '开通会员' : '阅读时长' }}</span>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiLevelDetail(row)">编辑</el-button>
        <!-- <el-popconfirm @onConfirm="apiLevelDel(row)" :title="`确定删除会员等级【${row.levelName}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm> -->
      </template>
    </MyTable>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" :before-close="onDialogCancle">
      <el-form ref="level" :model="levelForm" label-position="right" label-width="90px">
        <el-form-item label="等级名称" prop="levelName" :rules="[{trigger:'blur',message: '等级名称不能为空',required: true}]">
          <el-input type="text" v-model="levelForm.levelName" placeholder="请输入等级名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="赠送金币" prop="gold" :rules="[{trigger:'blur',message: '赠送金币不能为空',required: true}]">
          <el-input type="number" v-model="levelForm.gold" placeholder="请输入赠送金币" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="阅读时长" prop="readTimes" :rules="[{trigger:'blur',message: '阅读时长不能为空（小时）',required: true}]">
          <el-input type="number" v-model="levelForm.readTimes" placeholder="请输入阅读时长（小时）" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="满足条件" prop="meetType" :rules="[{trigger:'blur',message: '满足条件不能为空',required: true}]">
          <el-select v-model="levelForm.meetType" placeholder="请选择满足条件" style="width:100%">
            <el-option :value="1" label="开通会员" />
            <el-option :value="2" label="阅读时长" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="isDel">
          <el-radio-group v-model="levelForm.isDel" style="width:100%">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="等级描述" prop="description">
          <el-input type="textarea" v-model="levelForm.description" placeholder="请输入等级描述"></el-input>
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
import { levelList, levelDel, levelDetail, levelSave } from '@/api/user'
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
        {label: '等级名称', prop: 'levelName'},
        {label: '赠送金币', prop: 'gold'},
        {slot: 'isDel', label: '状态', prop: 'isDel'},
        {slot: 'meetType', label: '满足条件', prop: 'meetType'},
        {label: '阅读时长', prop: 'readTimes'},
        {label: '等级描述', prop: 'description'},
        {label: '创建人', prop: 'createName'},
        {label: '创建时间', prop: 'createTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      levelForm: {
        levelId: '',
        levelName: '',
        gold: '',
        meetType: '',
        readTimes: '',
        description: '',
        isDel: 0
      }
    }
  },
  created() {
    this.apiLevelList()
  },
  methods: {
    // 列表接口
    apiLevelList(){
      levelList({pageNo:1, pageSize: 20}).then(res => {
        this.tableList = res || []
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.levelForm.levelId = ''
        this.levelForm.levelName = ''
        this.levelForm.gold = ''
        this.levelForm.meetType = ''
        this.levelForm.readTimes = ''
        this.levelForm.description = ''
        this.levelForm.isDel = 0
      })
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.level.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.level.validate((valid) => {
        if(valid){
          const { levelId } = this.levelForm
          levelSave(this.levelForm).then(()=>{
            this.apiLevelList()
            this.visible = false
            this.$refs.level.resetFields()
            this.$message.success(`${levelId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiLevelDetail({levelId, levelName, gold, meetType, readTimes, isDel, description  }) {
      this.title = '编辑'
      this.levelForm.levelId = levelId
      this.levelForm.levelName = levelName
      this.levelForm.gold = gold
      this.levelForm.meetType = Number(meetType)
      this.levelForm.readTimes = readTimes
      this.levelForm.isDel = isDel ? Number(isDel) : 0
      this.levelForm.description = description
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 删除数据接口
    apiLevelDel({ levelId }) {
      levelDel({levelId}).then(res => {
        this.apiLevelList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
