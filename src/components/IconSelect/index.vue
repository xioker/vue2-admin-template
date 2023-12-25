<template>
  <div class="icons-container">
    <el-select class="icons-s" v-model="comValue" placeholder="请选择图标" clearable style="width: 100%;">
      <template #prefix>
        <i :class="'el-icon-' + comValue" style="font-size: 20px;margin-top: 8px;" v-if="comValue"/>
      </template>
      <el-option v-for="item of elementIcons" :key="item" :label="item" :value="item">
        <!-- <div v-for="item of elementIcons" :key="item" @click="handleClipboard(generateElementIconCode(item),$event)"> -->
          <div class="flex-s-c">
            <!-- <div >
              {{ generateElementIconCode(item) }}
            </div> -->
            <div class="icon-item flex-s-c">
              <i :class="'el-icon-' + item" style="font-size: 20px;margin-right: 6px;"/>
              <span>{{ item }}</span>
            </div>
          </div>
        <!-- </div> -->
      </el-option>
    </el-select>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

export default {
  name: 'Icons',
  props: ['value'],
  data() {
    return {
      svgIcons,
      elementIcons
    }
  },
  computed: {
    comValue: {
      get(){
        return this.value
      },
      set(val){
        this.$emit('update:value',val)
      }
    }
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>


<style lang="scss" >

.icons-container {
  overflow: hidden;
  .el-select-dropdown__list{
    display: flex;
    flex-wrap: wrap;
    max-width: 400px;
  }
}
</style>
