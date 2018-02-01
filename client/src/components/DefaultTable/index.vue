<template>
  <div>
    <div class="filter-container">
      <template v-if="hasSearch">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="关键词" v-model="queryKey">
        </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" :disabled="true">搜索</el-button>
      </template>
      <el-button v-if="hasAdd" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button v-if="hasDownload" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" :disabled="true">导出</el-button>
      <slot name="filter"></slot>
    </div>
    <el-table slot="table" :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row :style="{'min-width': minWidth}" class="my-table">
      <el-table-column v-if="trExpand" type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="my-table-expand">
            <template v-for="(item, index) in theads">
              <el-form-item v-if="!item.columnOnly" :label="item.text" :key="item.value">
                <span>{{ scope.row[item.value].value || scope.row[item.value].text  }}</span>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <!-- <multirow-thead :theads="theads"></multirow-thead> -->
      <el-table-column v-if="!item.expendOnly" v-for="(item, index) in theads" :align="item.align ? item.align : 'center'" :label='item.text' :key="item.value">
        <template slot-scope="scope">
          {{ scope.row[item.value].text || scope.row[item.value].value  }}
        </template>
      </el-table-column>
      <el-table-column v-if="hasActions" ref="actionsCloumn" label="操作" align="center" :min-width="actionsCloumnMinWidth" class-name="small-padding my-base-actions">
        <template slot-scope="scope">
          <el-button v-if="hasEdit" type="primary" size="mini" @click="handleUpdate(scope.$index)" plain :disabled="editDisabled">编辑</el-button>
          <el-button v-if="hasDelete" type="danger" size="mini" @click="handleDelete(scope.$index)" plain :disabled="deleteDisabled">删除</el-button>
          <slot name="actions" :index="scope.$index"></slot>
        </template>
      </el-table-column>
      <slot name="column"></slot>
    </el-table>
    <div v-show="hasPagination && !listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page_"
        :page-sizes="pageSizes" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import MultirowThead from './MultirowThead'
  export default{
    conpoments: {
      MultirowThead
    },
    props: {
      list: Array,
      theads: Array,
      queryKey: String,
      limit: {
        type: Number,
        default: 20
      },
      page: {
        type: Number,
        default: 1
      },
      pageSizes: {
        type: Array,
        default: () => [10, 20, 30, 50]
      },
      total: Number,
      listLoading: Boolean,
      trExpand: {
        type: Boolean,
        default: true
      },
      minWidth: {
        type: String,
        default: '1000px'
      },
      hasSearch: {
        type: Boolean,
        default: true
      },
      hasAdd: {
        type: Boolean,
        default: true
      },
      hasDownload: {
        type: Boolean,
        default: true
      },
      hasActions: {
        type: Boolean,
        default: true
      },
      hasEdit: {
        type: Boolean,
        default: true
      },
      editDisabled: {
        type: Boolean,
        default: false
      },
      hasDelete: {
        type: Boolean,
        default: true
      },
      deleteDisabled: {
        type: Boolean,
        default: false
      },
      hasPagination: {
        type: Boolean,
        default: true
      },
      actionsCloumnMinWidth: {
        type: String,
        default: 'auto'
      }
    },
    data() {
      return {
        limit_: this.limit,
        page_: this.page
      }
    },
    watch: {
      page(value) {
        this.page_ = value
      }
    },
    mounted() {
      // console.log('this.$refs', this.$refs)
    },
    methods: {
      handleFilter() {
        this.$emit('handleFilter')
      },
      handleCreate() {
        this.$emit('handleCreate')
      },
      handleDownload() {
        this.$emit('handleDownload')
      },
      handleUpdate(index) {
        this.$emit('handleUpdate', index)
      },
      handleDelete(index) {
        this.$emit('handleDelete', index)
      },
      handleSizeChange(val) {
        this.$emit('update:limit', val)
        this.$emit('handleSizeChange', val)
      },
      handleCurrentChange(val) {
        this.$emit('handleCurrentChange', val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .my-table-expand {
    font-size: 0;
    /deep/ label {
      width: 120px;
      color: #99a9bf;
    }
    .el-form-item{
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
  .my-table{
    /deep/ button {
      margin: 2px 4px;
    }
  }
</style>