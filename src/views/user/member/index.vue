<template>
  <div class="container">
    <el-form inline>
      <el-form-item label="账号">
        <el-input placeholder="请输入账号" v-model="searchForm.account" clearable></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input placeholder="请输入昵称" v-model="searchForm.custName" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input placeholder="请输入手机号" v-model="searchForm.phone" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户来源">
        <el-select placeholder="请选择用户来源" v-model="searchForm.source" clearable>
          <el-option value="1" label="APP"></el-option>
          <el-option value="2" label="PC"></el-option>
          <el-option value="3" label="微信"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册开始时间">
        <el-date-picker clearable v-model="searchForm.registerTimeStart" type="datetime" placeholder="选择开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="注册结束时间">
        <el-date-picker clearable v-model="searchForm.registerTimeEnd" type="datetime" placeholder="选择开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="会员到期开始时间">
        <el-date-picker clearable v-model="searchForm.expirationTimeStart" type="datetime" placeholder="选择开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="会员到期结束时间">
        <el-date-picker clearable v-model="searchForm.expirationTimeEnd" type="datetime" placeholder="选择开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
    </el-form>
    <MyTable v-loading="tableLoading" :data="tableList" :columns="columns">
      <template #headUrl="{row}">
        <el-image :preview-src-list="[row.headUrl]" :src="row.headUrl || require('@/assets/images/head-no.png')" fit="cover" style="width:50px;height:50px;border-radius: 50%;">
          <div slot="error" class="flex-c-c img-err">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </template>
      <template #source="{row}">
        <el-tag type="info">{{ ['APP','PC','微信'][row.source] }}</el-tag>
      </template>
      <template #isDel="{row}">
        <el-tag size="mini" :type="row.isDel == 1 ? 'danger' : 'success'">{{ row.isDel == 1 ? '已停用' : '已启用' }}</el-tag>
      </template>
      <template #sex="{row}">
        <span>{{ row.sex == 1 ? '男' : '女' }}</span>
      </template>
      <template #isVip="{row}">
        <el-tag size="mini" :type="row.isVip == 1 ? 'success' : 'danger'">{{ row.isVip == 1 ? '是' : '否' }}</el-tag>
      </template>
      <template #action="{row}">
        <template>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="apiUserDetail(row)">编辑</el-button>
          <!-- <el-popconfirm @onConfirm="onStatus(row)" :title="`确定${row.status == 1 ? '禁用' : '启用'}吗`" style="margin-left:10px">
            <el-button slot="reference" size="mini" :type="row.status == 1 ? 'danger' : 'primary'">{{ row.status == 1 ? '禁用' : '启用' }}</el-button>
          </el-popconfirm> -->
        </template>
      </template>
    </MyTable>
    <Pagination :hidden="!total" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" style="text-align: right;" @pagination="onPagination" />
  </div>
</template>
<script>
import { customer, opCustomer } from '@/api/user'
export default {
  data(){
    return {
      searchForm: {
        pageNo: 1,
        pageSize: 20,
        account: '',
        custName: '',
        phone: '',
        source: '',
        registerTimeStart: '',
        registerTimeEnd: '',
        expirationTimeStart: '',
        expirationTimeEnd: ''
      },
      total: 0,
      // 表格数据
      tableList: [],
      // 表格loading
      tableLoading: true,
      columns: [
        {slot: 'headUrl', label: '头像', prop: 'headUrl'},
        {label: '账号', prop: 'account'},
        {label: '用户名', prop: 'custName'},
        {label: '手机号', prop: 'phone'},
        {slot: 'isDel', label: '状态', prop: 'isDel'},
        {slot: 'sex', label: '性别', prop: 'sex'},
        {slot: 'source', label: '来源', prop: 'source'},
        {label: '微信唯一ID', prop: 'unionId'},
        {slot: 'isVip', label: '是否会员', prop: 'isVip'},
        {label: '会员等级', prop: 'levelId'},
        {label: '注册时间', prop: 'registerTime'},
        {label: '最后登录时间', prop: 'lastLoginTime'},
        {slot: 'action', label: '操作', prop: 'action', fixed: 'right'},
      ],
    }
  },
  created(){
    this.apiCustomer()
  },
  methods: {
    apiCustomer(){
      if(this.tableLoading === false) this.tableLoading = true
      customer(this.searchForm).then((res)=>{
        this.tableList = res.list || []
        this.total = Number(res.total) || 0
      }).finally(() =>this.tableLoading = false)
    },
    onPagination({page, limit}){
      this.searchForm.pageNo = page
      this.searchForm.pageSize = limit
      this.apiCustomer()
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
