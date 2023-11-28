<template>
  <div class="card-panel">
    <div class="card-count">561</div>
    <div class="card-desc flex-b-c">
      <span>总注册量</span>
      <span>同日比</span>
    </div>
    <div class="card-bottom flex-b-c">
      <span>今日注册</span>
      <span>23</span>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-panel {
  background-color: #fff;
  margin-bottom: 20px;
  .card-count{
    font-size: 30px;
  }
  .card-desc{
    span:nth-child(1){
      font-weight: 400;
    }
    span:nth-child(2){
      color: #515a6e;
      font-size: 14px;
    }
  }
  .card-count,
  .card-desc,
  .card-bottom{
    padding: 10px 0;
    margin: 0 10px;
  }
  .card-bottom{
    border-top: 1px solid #eee;
    color: #8c8c8c;
  }
}

</style>
