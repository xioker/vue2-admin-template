<template>
  <el-table ref="table" :data="data" v-bind="$attrs" v-on="$listeners" height="calc(100vh - 220px)"
    max-height="calc(100vh - 220px)"
    style="overflow-y: auto;"
  >
    <template v-for="(co, ind) in columns">
      <el-table-column
        :label="co.label"
        :prop="co.prop"
        :width="co.width"
        :sortable="co.sortable || false"
        :fixed="co.fixed || false"
        :align="co.align || 'center'"
        :key="ind"
        type="selection"
        v-if="co.prop === 'selection'"
      />
      <el-table-column
        :label="co.label"
        :prop="co.prop"
        :width="co.width"
        :sortable="co.sortable || false"
        :fixed="co.fixed || false"
        :align="co.align || 'center'"
        :key="co.label"
        type="index"
        v-else-if="co.prop === 'index'"
      />
      <el-table-column
        :label="co.label"
        :prop="co.prop"
        :width="co.width"
        :sortable="co.sortable || false"
        :fixed="co.fixed || false"
        :align="co.align || 'center'"
        :key="co.slot"
        v-else-if="co.slot"
      >
        <template #default="scope">
          <slot :name="co.prop" :row="scope.row" :index="scope.$index"></slot>
        </template>
      </el-table-column>
      <el-table-column
        :label="co.label"
        :prop="co.prop"
        :width="co.width"
        :sortable="co.sortable || false"
        :fixed="co.fixed || false"
        :align="co.align || 'center'"
        :show-overflow-tooltip="co.showOverflowTooltip || true"
        :key="co.prop"
        v-else
      />
    </template>
  </el-table>
</template>
<script>
export default {
  props: {
    // 表格数据
    data: {
      type: Array,
      default: () => []
    },
    // 表格列数据
    columns: {
      type: Array,
      default: () => []
    },
  },
}
</script>
<style lang="scss" scoped></style>
