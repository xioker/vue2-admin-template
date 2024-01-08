<template>
  <div class="dashboard-editor-container">

    <el-row type="flex" justify="space-between" :gutter="20">
      <el-col v-for="item in records" :key="item.title" :span="6">
        <Wapper >
          <template #title>{{ item.title }}</template>
          <PanelGroup />
        </Wapper>
      </el-col>
    </el-row>
    <Wapper>
      <el-row type="flex" justify="space-between" :gutter="20" style="margin:0 0 20px 0;padding: 20px 10px 0 10px;background-color: #fff;box-sizing: border-box;">
        <el-col v-for="item in records1" :key="item.title" :span="6" >
          <CardItem style="background-color:#fbfbfb" :datas="item"/>
        </el-col>
      </el-row>
    </Wapper>

    <el-row :gutter="20">
      <el-col :span="12">
        <Wapper>
          <template #title>全国用户分布数据</template>
          <div class="chart-wrapper">
            <line-chart :chart-data="lineChartData" />
          </div>
        </Wapper>
      </el-col>
      <el-col :span="12">
        <Wapper>
          <template #title>每日各小时阅读人数</template>
          <div class="chart-wrapper">
            <line-chart :chart-data="lineChartData" />
          </div>
        </Wapper>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <Wapper>
          <template #title>火爆榜</template><box-card :columns="[{ prop: 'q', label: '封面图' },{ prop: 'w', label: '标题' },{ prop: 'e', label: '阅读时长' }]" />
        </Wapper>
      </el-col>
      <el-col :span="12">
        <Wapper>
          <template #title>分类榜</template><box-card />
        </Wapper>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import BoxCard from './components/BoxCard'
import Wapper from './components/Wapper'
import CardItem from './components/CardItem'
import { bookReadTimeReport, bookReadTypeTimeReport, custCityReport, todayReadCustReport, customerReport } from '@/api/index'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    BarChart,
    BoxCard,
    Wapper,
    CardItem
},
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      records: [
        { title: '注册量', time: '2016-05-02', status: 'Finished', progress:''},
        { title: '会员量', time: '2016-05-02', status: 'Finished', progress:''},
        { title: '订单量', time: '2016-05-02', status: 'Finished', progress:''},
        { title: '营业额', time: '2016-05-02', status: 'Finished', progress:''},
      ],
      records1: [
        { title: '总奖励金额', img: require('@/assets/images/card1.png'), desc: '昨日奖励金额' },
        { title: '总成本金额', img: require('@/assets/images/card2.png'), desc: '昨日成本金额' },
        { title: '总充值金额', img: require('@/assets/images/card3.png'), desc: '今日充值金额' },
        { title: '总提现金额', img: require('@/assets/images/card4.png'), desc: '今日提现金额' },
      ],
      records2: [
        { title: '提现', img: require('@/assets/images/card1.png'), desc: '' },
        { title: '退货', img: require('@/assets/images/card2.png'), desc: '' },
        { title: '留言', img: require('@/assets/images/card3.png'), desc: '' },
        { title: '评价', img: require('@/assets/images/card4.png'), desc: '' },
      ],
    }
  },
  created(){
    customerReport().then((res)=>{
      console.log(res)
    })
    bookReadTimeReport().then((res)=>{
      console.log(res)
    })
    bookReadTypeTimeReport().then(res=>{
      console.log(res)
    })
    custCityReport().then((res)=>{
      console.log(res)
    })
    todayReadCustReport().then(res=>{
      console.log(res)
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding:  0 16px 16px 16px;
    margin-bottom: 20px;
  }
}
</style>
