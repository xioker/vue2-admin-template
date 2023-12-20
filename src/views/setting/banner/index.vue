<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </el-row>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #bannerSort="{row}">
        <el-input size="mini" v-model="row.bannerSort"></el-input>
      </template>
      <template #isDel="{row}">
        <el-tag :type="row.isDel == 1 ? 'danger' : 'success'">{{ row.status == 1 ? '已停用' : '已启用' }}</el-tag>
      </template>
      <template #action="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiBannerDetail(row)">编辑</el-button>
        <el-popconfirm @onConfirm="onStatus(row)" :title="`确定删除吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" type="danger">删除</el-button>
        </el-popconfirm>
        <!-- <el-popconfirm @onConfirm="onStatus(row)" :title="`确定${row.status == 1 ? '禁用' : '启用'}吗`" style="margin-left:10px">
          <el-button slot="reference" size="mini" :type="row.status == 1 ? 'danger' : 'primary'">{{ row.status == 1 ? '禁用' : '启用' }}</el-button>
        </el-popconfirm> -->
      </template>
    </MyTable>
    <!-- 修改新增弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" :before-close="onDialogCancle">
      <el-form ref="banner" :model="bannerForm" label-position="right" label-width="90px">
          <el-form-item label="关联小说" prop="bookId" :rules="[{trigger:'blur',message: '关联小说不能为空',required: true}]">
            <el-input type="text" v-model="bannerForm.bookId" placeholder="请输入关联小说" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="轮播图链接" prop="bannerUrl">
            <el-input type="text" v-model="bannerForm.bannerUrl" placeholder="请输入轮播图链接" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="bannerSort">
            <el-input-number v-model="bannerForm.bannerSort"></el-input-number>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="bannerForm.isDel">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
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
import { bannerList, bannerDetail, bannerSave, bannerDel, bannerSort } from '@/api/setting'
export default {
  data() {
    return {
      searchForm: {
        pageNo: 1,
        pageSize: 20,
      },
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {slot: 'bannerSort', label: '排序', prop: 'bannerSort'},
        {label: '关联小说名称', prop: 'bookName'},
        {label: '轮播图链接', prop: 'bannerUrl'},
        {slot: 'isDel', label: '状态', prop: 'isDel'},
        {label: '创建人', prop: 'createName'},
        {label: '创建时间', prop: 'createTime'},
        {slot: 'action', label: '操作', prop: 'action'},
      ],
      // 修改新增弹框数据
      title: '新增',
      visible: false,
      bannerForm: {
        bannerId: '',
        bookId: '',
        bookName: '',
        bannerUrl: '',
        bannerSort: 0,
        isDel: 0
      }
    }
  },
  created() {
    this.apiBannerList()
  },
  methods: {
    // 列表接口
    apiBannerList(){
      if(this.searchForm.tableLoading === false) this.tableLoading = true
      bannerList(this.searchForm).then(res => {
        this.tableList = res.list || []
        this.tableLoading = false
      }).finally(()=>this.tableLoading = false)
    },
    // 新增
    onAdd(){
      this.visible = true
      this.$refs.banner.resetFields()
    },
    onDialogCancle(){
      this.visible = false
    },
    onDialogSure(){
      this.$refs.banner.validate((valid) => {
        if(valid){
          const { bannerId } = this.bannerForm
          bannerSave(this.bannerForm).then(()=>{
            this.apiBannerList()
            this.visible = false
            this.$refs.banner.resetFields()
            this.$message.success(`${bannerId ? '编辑' : '新增'}成功`)
          })
        }
      })
    },
    // 详情数据接口
    apiBannerDetail({bannerId, bannerUrl, bannerSort, isDel, bookId, bookName }) {
      this.bannerForm.bannerId = bannerId
      this.bannerForm.bookId = bookId
      this.bannerForm.bookName = bookName
      this.bannerForm.bannerUrl = bannerUrl
      this.bannerForm.bannerSort = bannerSort
      this.bannerForm.isDel = Number(isDel)
      this.visible = true
      // userDetail({userId}).then(res => {
      //   console.log(res)
      // })
    },
    // 状态操作事件
    onStatus({bannerId}){
      bannerDel({bannerId}).then(() => {
        this.apiBannerList()
        this.$message.success(`删除成功`)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
  
</style>