<template>
  <div class="card-panel">
    <div class="flex-b-c">
      <div>
        <div class="card-count">561</div>
        <div class="card-desc flex-b-c">
          <span>{{ datas.title }}</span>
        </div>
      </div>
      <img style="width:45px;height:100%" :src="datas.img" alt="">
    </div>
    <div class="card-bottom flex-b-c" v-if="datas.desc">
      <span>{{ datas.desc }}</span>
      <span>23</span>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  props: ['datas'],
  components: {
    CountTo
  },
}
</script>

<style lang="scss" scoped>
.card-panel {
  background-color: #fff;
  margin-bottom: 20px;
  padding: 10px;
  .card-count{
    font-size: 30px;
    color: #515a6e;
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
