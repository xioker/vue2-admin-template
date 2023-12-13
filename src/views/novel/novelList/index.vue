<template>
  <div>
    <component :is="currentCom" :params="params"></component>
  </div>
</template>
<script>
import NovelSection from './components/NovelSection.vue'
import NovelList from './components/NovelList.vue';
export default {
  components: {
    NovelList,
    NovelSection,
  },
  data(){
    return {
      // 当前组件
      currentCom : 'NovelList',
      // 当前参数
      params: null
    }
  },
  methods:{
    changeCom(params){
      this.params = params
      if(this.currentCom === 'NovelList'){
        return this.currentCom = 'NovelSection';
      }
      this.currentCom = 'NovelList';
    }
  }
}
</script>
<style lang="scss" scoped>
  
</style>