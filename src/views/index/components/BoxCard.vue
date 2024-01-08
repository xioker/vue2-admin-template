<template>
  <el-card class="box-card-component" shadow="never">
    <div slot="header" class="box-card-header" >
      <div class="flex-b-c box-card-head">
        <div class="box-card-rank">
          <div>
            <img src="@/assets/images/rank2.png">
            <img class="img-rank2" src="@/assets/images/img-no.jpg">
          </div>
          <div class="rank2">
            <span>天下第一大三大四烦烦烦</span>
            <span>sasf</span>
          </div>
        </div>
        <div class="box-card-rank">
          <div>
            <img src="@/assets/images/rank1.png">
            <img class="img-rank1" src="@/assets/images/img-no.jpg">
          </div>
          <div class="rank1">
            <span>天下第二</span>
            <span>sasf</span>
          </div>
        </div>
        <div class="box-card-rank">
          <div>
            <img src="@/assets/images/rank3.png">
            <img class="img-rank3" src="@/assets/images/img-no.jpg">
          </div>
          <div class="rank3">
            <span>天下第三</span>
            <span>sasf</span>
          </div>
        </div>
      </div>
    </div>
    <MyTable :data="[]" :columns="columns" style="max-height:auto !important;height:auto !important"></MyTable>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import MyTable from '@/components/MyTable/index.vue'
export default {
  components: { MyTable },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    columns: {
      type: Array,
      default: () => [
        { prop: 'a', label: '封面' },{ prop: 'b', label: '书名' },{ prop: 'c', label: '浏览量' }
      ]
    }
  },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>


<style lang="scss" scoped>
.box-card-component {
  padding:30px 0;
  border: none;
  ::v-deep.el-card__header{
    border-bottom: none;
    padding: 20px 46px;
  }
  ::v-deep.el-card__body{
    padding: 0 20px;
  }
  .box-card-header {
    .box-card-head{
      width: 100%;
      text-align: center;
      .box-card-rank:nth-child(2){
        margin-top: -50px;
      }
      .box-card-rank{
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        .rank1{
          font-size: 14px;
          width: 100%;
          background-image: linear-gradient(to bottom,#fff0c8,#fff);
        }
        .rank2{
          font-size: 14px;
          width: 100%;
          background-image: linear-gradient(to bottom,#eceff5,#fff);
        }
        .rank3{
          font-size: 14px;
          width: 100%;
          background-image: linear-gradient(to bottom,#ffeadb,#fff);
        }
        div{
          display: flex;
          flex-direction: column;
          align-items: center;
          .img-rank1{
            border: 2px solid #f5c633;
          }
          .img-rank2{
            border: 2px solid #c5cbe9;
          }
          .img-rank3{
            border: 2px solid #ff9e22;
          }
        }
        div:nth-child(2){
          margin-top: -50px;
          width: 120px;
          min-height: 100px;
          border-radius: 26px;
          justify-content: flex-end;
          padding: 0 6px;
          span:nth-child(1){
            margin-bottom: 2px;
          }
        }
        div>img:nth-child(1) {
          width: 40px;
          height: auto;
          margin-bottom: 6px;
          transition: all 0.2s linear;
          &:hover {
            transform: scale(1.1, 1.1);
            filter: contrast(130%);
          }
        }
        div>img:nth-child(2) {
          z-index: 10;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
