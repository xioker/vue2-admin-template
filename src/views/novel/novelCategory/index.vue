<template>
  <div>
    <component :is="currentCom" :params="params"></component>
  </div>
</template>
<script>
import FirstCategory from './components/FirstCategory.vue'
import SecondCategory from './components/SecondCategory.vue';
export default {
  components: {
    FirstCategory,
    SecondCategory,
  },
  data(){
    return {
      // 当前组件
      currentCom : 'FirstCategory',
      // 当前参数
      params: null
    }
  },
  methods:{
    changeCom(params){
      this.params = params
      if(this.currentCom === 'FirstCategory'){
        return this.currentCom = 'SecondCategory';
      }
      this.currentCom = 'FirstCategory';
    }
  }
}
</script>
<style lang="scss" scoped>
  
</style>