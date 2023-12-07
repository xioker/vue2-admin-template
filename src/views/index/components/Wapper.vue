<!--
 * @Author: shilin 1449163251@qq.com
 * @Date: 2023-11-28 13:10:54
 * @LastEditors: shilin 1449163251@qq.com
 * @LastEditTime: 2023-12-07 09:40:11
 * @FilePath: \vue-element-admin\src\views\index\components\Wapper.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="wapper">
    <header>
      <div>
        <i class="el-icon-user-solid"></i>
        <slot name="title">资金记录</slot>
      </div>
      <div>
        <i class="el-icon-refresh"></i>
      </div>
    </header>
    <slot></slot>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="scss">
.wapper{
  width: 100%;
  max-width: 100%;
}
  header{
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    padding: 10px;
    div i{
      color: #1890ff;
      background-color: #e6f7ff;
      border-radius: 50%;
      padding: 4px;
      font-size: 16px;
    }
    div:first-child{
      font-size: 16px;
      font-weight: bold;
      i{
        margin-right: 6px;
      }
    }
  }
</style>