<template>
  <div class="app-container">
    <default-table
      :list="list"
      :theads="theads"
      :queryKey.sync="listQuery.key"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      :listLoading="listLoading"
      :hasActions="false"
      @handleUpdate="handleUpdate"
      @handleDelete="handleDelete"
      @handleFilter="handleFilter"
      @handleCreate="handleCreate(arguments, createCallBack)"
      @handleDownload="handleDownload"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
      <el-button slot="filter" class="filter-item" style="margin-left: 10px;" @click="handleBatchSettingWidthCSV" type="primary" icon="el-icon-edit">导入CSV添加</el-button>
    </default-table>
    <edit-modal :formItems="modal.base.data" :visible.sync="modal.base.visible" :createWidthCsv="modal.base.createWidthCsv" @submit="handleSubmit"></edit-modal>
  </div>
</template>

<script>
  import DefaultTable from '@/components/DefaultTable'
  import Table from '@/mixins/table'
  import EditModal from './ManufacturerSerialEditModal'
  export default {
    mixins: [Table],
    components: {
      DefaultTable,
      EditModal
    },
    data() {
      return {
        modal: {
          base: {
            createWidthCsv: false
          }
        },
        theads: [
          { text: 'ID', value: 'id' },
          { text: '厂商序列号', value: 'serial' },
          { text: '厂商编号', value: 'manufacturer' },
          { text: '激活状态', value: 'activeStatus' }
        ]
      }
    },
    created() {
      console.log('created manufacturer')
    },
    methods: {
      async getList() {
        this.listLoading = true
        const res = await this.$api.getManufacturerSerialList({
          page: this.listQuery.page,
          per_page: this.listQuery.limit
        })
        if (res) {
          this.list = []
          res.data.list.forEach((value) => {
            this.list.push({
              id: {
                value: value.id
              },
              serial: {
                value: value.serial
              },
              manufacturer: {
                text: '',
                value: value.gid
              },
              activeStatus: {
                value: value.status
              }
            })
          })
          this.total = res.data.total_count
        }
        this.listLoading = false
      },
      handleBatchSettingWidthCSV() {
        this.modal.base.data = null
        this.modal.base.visible = true
        this.modal.base.createWidthCsv = true
      },
      createCallBack() {
        this.modal.base.createWidthCsv = false
      }
    }
  }
</script>

<style lang="scss" scoped></style>