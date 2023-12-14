<template>
  <div>
    <el-form inline>
      <el-form-item label="VIP专属" prop="isVip">
        <el-select v-model="searchForm.isVip" placeholder="请选择VIP专属" clearable>
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="apiThemeList">查询</el-button>
        <el-button type="info" @click="onReset">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #isDel="{row}">
        <el-tag size="mini" :type="row.isDel == 1 ? 'danger' : 'success'">{{ row.isDel == 1 ? '已停用' : '已启用' }}</el-tag>
      </template>
      <template #isVip="{row}">
        <el-tag size="mini" :type="row.isVip == 1 ? 'success' : 'danger'">{{ row.isVip == 1 ? '是' : '否' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiThemeDetail(row)">编辑</el-button>
        <el-popconfirm @onConfirm="apiThemeDelete(row)" :title="`确定删除主题【${row.themeName}】吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination"></Pagination>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="theme" :model="themeForm" label-position="right" label-width="80px">
        <el-form-item label="主题名称" prop="themeName" :rules="[{trigger:'blur',message: '主题名称不能为空',required: true}]">
          <el-input type="text" v-model="themeForm.themeName" placeholder="请输入主题名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="VIP专属" prop="isVip">
          <el-radio-group v-model="themeForm.isVip">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="主题图片" prop="themeImg">
          <ImageUpload :url.sync="themeForm.themeImg" :params="{type: 1, module: 6 }"></ImageUpload>
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
import { throttle } from '@/utils/index'
import ImageUpload from '@/components/Upload/ImageUpload.vue'
import { themeList, themeDel, themeSave } from '@/api/setting'
export default {
  components: { ImageUpload },
  data() {
    return {
      // 搜索表单
      searchForm: {
        isVip: '',
        pageNo:1,
        pageSize: 20,
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {label: '序号', prop: 'index'},
        {label: '主题名称', prop: 'themeName'},
        {label: '主题图片', prop: 'themeImg'},
        {slot: 'isDel', label: '状态', prop: 'isDel'},
        {slot: 'isVip', label: 'VIP专属', prop: 'isVip'},
        {label: '创建人', prop: 'createName'},
        {label: '更新时间', prop: 'createTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      themeForm: {
        themeId: '',
        themeName: '',
        themeImg: '',
        isVip:0,
        levelId: ''
      }
    }
  },
  created() {
    this.apiThemeList()
  },
  methods: {
    // 列表接口
    apiThemeList(){
      if(this.tableLoading === false) this.tableLoading = true
      themeList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiThemeList()
    },
    // 新增
    onAdd(){
      this.title = '新增'
      this.visible = true
      this.$nextTick(()=>{
        this.themeForm.themeId = ''
        this.themeForm.themeName = ''
        this.themeForm.themeImg = ''
        this.themeForm.isVip = 0
        this.themeForm.levelId = ''
      })
    },
    // 重置
    onReset(){
      this.searchForm.isVip = ''
      this.apiThemeList()
    },
    onDialogCancle(){
      this.title === '新增' && this.$refs.theme.clearValidate()
      this.visible = false
    },
    onDialogSure(){
      this.$refs.theme.validate((valid) => {
        if(valid){
          const { themeId } = this.themeForm
          themeSave(this.themeForm).then(()=>{
            this.apiThemeList()
            this.visible = false
            this.$refs.theme.resetFields()
            this.$message.success(`${themeId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiThemeDetail({ themeId, themeName, themeImg, isVip, isDel, levelId }) {
      this.title = '编辑'
      this.themeForm.themeId = themeId
      this.themeForm.themeName = themeName
      this.themeForm.themeImg = themeImg
      this.themeForm.isVip = Number(isVip)
      this.themeForm.levelId = levelId
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 删除数据接口
    apiThemeDelete({ themeId, levelId }) {
      themeDel({ themeId, levelId }).then(() => {
        this.apiThemeList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
