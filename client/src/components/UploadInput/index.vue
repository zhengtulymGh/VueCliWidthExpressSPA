<template>
  <el-input class="fileInput" type="text" v-model="filePath" :disbaled="true">
    <template slot="append">
      <label>选择文件</label>
      <input type="file" accept=".csv" @change="handleFileChange">
    </template>
  </el-input>
</template>

<script>
  export default {
    props: {
      filePath: String
    },
    methods: {
      handleFileChange(e) {
        this.$emit('handleFileChange', e)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fileInput{
    /deep/ .el-input-group__append{
      position: relative;
      width: 10%;
      min-width: 30px;
      cursor: pointer;
      input{
        width: 100%;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
      }
    }
  }
</style>
