<template>
  <div>
    <el-table-column v-if="!item.expandOnly" v-for="(item, index) in theads" :align="item.align" :label='item.text' :key="item.value">
      <template slot-scope="scope">
        {{scope.row[item.value]}}
        <multirow-thead v-if="item.children" :theads="item.children"></multirow-thead>
      </template>
    </el-table-column>
  </div>
</template>

<script>
  export default{
    name: 'multirow-thead',
    props: {
      theads: Array
    }
  }
</script>
