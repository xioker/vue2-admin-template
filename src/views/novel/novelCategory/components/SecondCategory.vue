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
      <el-button type="success" @click="$parent.changeCom" style="float: right;">切换一级分类</el-button>
    </el-form>
    
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #channelBelong="{row}">
        <span>{{ row.channelBelong == 2 ? '女' : '男' }}</span>
      </template>
      <template #labelNames="{row}">
        <template v-if="row.labelNames">
          <div class="flex-c-c-c">
            <el-tag size="mini" v-for="name in row.labelNames.split(',')" :key="name" style="margin-bottom: 2px;">{{ name }}</el-tag>
          </div>
        </template>
      </template>
      <template #typePic="{row}">
        <el-image :src="row.typePic || require('@/assets/images/img-no.jpg')" fit="cover" style="width:150px;height:50px"></el-image>
      </template>
      <template #bigTypeId="{row}">
        <span>{{ bigTypeTitle }}</span>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiBookTypeDetail(row)">编辑</el-button>
        <el-button size="mini" type="primary" @click="onLabels(row)">关联标签</el-button>
        <el-popconfirm @onConfirm="apiBookTypeDelete(row)" :title="`确定删除小说分类【${row.typeTitle}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination" />
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" :before-close="onDialogCancle">
      <el-form ref="type" :model="typeForm" label-position="right" label-width="110px">
        <el-form-item label="一级分类标题" prop="bigTypeId">
          <el-input type="text" v-model="bigTypeTitle" placeholder="请输入一级分类标题" autocomplete="off" disabled></el-input>
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
          <ImageUpload></ImageUpload>
          <!-- <ImageUpload :url.sync="typeForm.typePic" :params="{type: 1, module: 6 }"></ImageUpload> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogCancle">取 消</el-button>
        <el-button type="primary" @click="onDialogSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 标签关联 -->
    <el-dialog destroy-on-close append-to-body title="关联标签" :visible.sync="labelsVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="600px">
      <el-form ref="labels" label-position="right" label-width="80px">
        <el-form-item label="活动标签" >
          <el-select multiple clearable v-model="labelForm.labelIds" placeholder="请选择活动标签" style="width:100%">
            <el-option
              v-for="item in labelList"
              :key="item.labelId"
              :label="item.title"
              :value="item.labelId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="labelsVisible = false">取 消</el-button>
        <el-button type="primary" @click="apiBookTypeAddLabel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { bookTypeList, bookTypeDetail, bookTypeDelete, bookTypeSave, bookTypeAddLabel, labelList } from '@/api/novel'
import ImageUpload from '@/components/Upload/ImageUpload.vue'
export default {
  components: {
    ImageUpload
  },
  props: ['params'],
  data() {
    return {
      searchForm: {
        pageNo: 1,
        pageSize: 20,
        keyword: '',
        bigTypeId: ''
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {slot: 'bigTypeId', label: '一级分类标题', prop: 'bigTypeId'},
        {label: '二级分类标题', prop: 'typeTitle'},
        {slot: 'channelBelong', label: '男/女', prop: 'channelBelong'},
        {label: '排序', prop: 'sortNum'},
        {label: '阅读时长', prop: 'readCount'},
        {slot: 'typePic', label: '分类图片', prop: 'typePic'},
        {slot: 'labelNames', label: '活动标签', prop: 'labelNames'},
        {label: '创建时间', prop: 'createdTime'},
        {label: '更新时间', prop: 'updateTime'},
        {slot: 'action', label: '操作', prop: 'action', fixed: 'right', width: '280'},
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
      },
      bigTypeTitle: '',
      // 标签列表
      labelList: [],
      // 标签表单
      labelForm: {
        typeId: '',
        labelIds: [],
        labelNames: []
      },
      labelsVisible: false
    }
  },
  created() {
    this.searchForm.bigTypeId = this.params.bigTypeId || ''
    this.typeForm.bigTypeId = this.params.bigTypeId || ''
    this.bigTypeTitle = this.params.bigTypeTitle || ''
    this.apiBookTypeList()
    this.apiLabelList()
  },
  methods: {
    // 列表接口
    apiBookTypeList(){
      if(this.tableLoading === false) this.tableLoading = true
      bookTypeList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
    },
    // 标签列表接口
    apiLabelList(){
      labelList({pageNo: 1, pageSize: 100}).then(res => {
        this.labelList = res.list || []
      }).catch(()=>{})
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
        this.typeForm.typeId = ''
        this.typeForm.typeTitle = ''
        this.typeForm.readCount = ''
        this.typeForm.sortNum = 0
        this.typeForm.channelBelong = 1
        this.typeForm.typePic = ''
      })
    },
    // 关联标签
    onLabels({ typeId, labelNames, labelIds }){
      this.labelForm.typeId = typeId
      this.labelForm.labelNames = labelNames ? labelNames.split(',') : []
      this.labelForm.labelIds = labelIds ? labelIds.split(',') : []
      this.labelsVisible = true
    },
    // 获取对应的 标签名称
    getNames(){
      const { labelIds, labelNames } = this.labelForm
      for(let i = 0; i < this.labelList.length; i++){
        if(labelIds.includes(this.labelList[i].labelId)){
          labelNames.push(this.labelList[i].title)
          continue
        }
      }
    },
    apiBookTypeAddLabel(){
      const { typeId, labelIds, labelNames } = this.labelForm
      let params = {}
      if(labelIds.length === 0){
        params = { typeId, labelIds: '', labelNames: ''}
      }else{
        this.getNames()
        params = { typeId, labelIds: labelIds.join(), labelNames: labelNames.join() }
      }
      bookTypeAddLabel(params).then(() => {
        this.$message.success('关联标签成功')
        this.labelsVisible = false
        this.apiBookTypeList()
      }).finally(()=>{})
    },
    // 新增 编辑 弹框确认 取消事件
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
      this.typeForm.channelBelong = Number(channelBelong || 1)
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
