<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </el-row>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #typePic="{row}">
        <el-image :src="row.typePic || require('@/assets/images/img-no.jpg')" fit="cover" style="width:150px;height:50px"></el-image>
      </template>
      <template #channelBelong="{row}">
        <span>{{ row.channelBelong == 1 ? '男' : '女' }}</span>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiBookTypeDetail(row)">编辑</el-button>
        <el-popconfirm @onConfirm="apiBookTypeDelete(row)" :title="`确定删除小说分类【${row.typeTitle}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" :before-close="onDialogCancle">
      <el-form ref="type" :model="typeForm" label-position="right" label-width="110px">
        <el-form-item label="一级分类标题" prop="bigTypeId" :rules="[{trigger:'blur',message: '一级分类标题不能为空',required: true}]">
          <el-input type="text" v-model="typeForm.bigTypeId" placeholder="请输入一级分类标题" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="二级分类标题" prop="typeTitle" :rules="[{trigger:'blur',message: '二级分类标题不能为空',required: true}]">
          <el-input type="text" v-model="typeForm.typeTitle" placeholder="请输入二级分类标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="阅读时长" prop="readCount">
          <el-input type="text" v-model="typeForm.readCount" placeholder="请输入阅读时长" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortNum">
          <el-input-number v-model="typeForm.sortNum"></el-input-number>
        </el-form-item>
        <el-form-item label="男/女" prop="channelBelong">
          <el-radio-group v-model="typeForm.channelBelong">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类图片" prop="typePic">
          <!-- <el-input type="number" v-model="typeForm.typePic" placeholder="请输入赠送金币" autocomplete="off"></el-input> -->
          <SingleImage2></SingleImage2>
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
import { bookTypeList, bookTypeDetail, bookTypeDelete, bookTypeSave } from '@/api/novel'
import MyTable from '@/components/MyTable/index.vue'
import SingleImage2 from '@/components/Upload/SingleImage2.vue'
export default {
  components: {
    MyTable,
    SingleImage2
  },
  data() {
    return {
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '排序', prop: 'sortNum'},
        {label: '一级分类标题', prop: 'bigTypeId'},
        {label: '二级分类标题', prop: 'typeTitle'},
        {label: '阅读时长', prop: 'readCount'},
        {slot: 'typePic', label: '分类图片', prop: 'typePic'},
        {slot: 'channelBelong', label: '男/女', prop: 'channelBelong'},
        {label: '创建时间', prop: 'createdTime'},
        {label: '更新时间', prop: 'updateTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      typeForm: {
        bigTypeId: '',
        typeId: '',
        typeTitle: '',
        readCount: '',
        sortNum: 0,
        channelBelong: 1,
        typePic: '',
      }
    }
  },
  created() {
    this.apiBookTypeList()
  },
  methods: {
    // 列表接口
    apiBookTypeList(){
      bookTypeList({pageNo:1, pageSize: 20}).then(res => {
        this.tableList = res.list || []
        this.tableLoading = false
      }).catch(()=>this.tableLoading = false)
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.typeForm.bigTypeId = ''
        this.typeForm.typeId = ''
        this.typeForm.typeTitle = ''
        this.typeForm.readCount = ''
        this.typeForm.sortNum = 0
        this.typeForm.channelBelong = 1
        this.typeForm.typePic = ''
      })
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.type.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.type.validate((valid) => {
        if(valid){
          const { typeId } = this.typeForm
          bookTypeSave(this.typeForm).then(()=>{
            this.apiBookTypeList()
            this.visible = false
            this.$refs.type.resetFields()
            this.$message.success(`${typeId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiBookTypeDetail({bigTypeId, typeId, typeTitle, typePic, readCount, sortNum, channelBelong}) {
      this.title = '编辑'
      this.typeForm.bigTypeId = bigTypeId
      this.typeForm.typeId = typeId
      this.typeForm.typeTitle = typeTitle
      this.typeForm.readCount = readCount
      this.typeForm.sortNum = Number(sortNum || 0)
      this.typeForm.channelBelong = Number(channelBelong)
      this.typeForm.typePic = typePic
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 删除数据接口
    apiBookTypeDelete({ typeId:bookTypeId  }) {
      bookTypeDelete({ bookTypeId }).then(res => {
        this.apiBookTypeList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
