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
  import EditModal from './NVRSerialEditModal'
  import { filterOptionOfArray } from '@/utils'
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
          { text: 'NVR序列号', value: 'serial' },
          { text: '通道数', value: 'channelCount' },
          { text: 'mac地址', value: 'mac', expandOnly: true },
          { text: '厂商', value: 'manufacturer' },
          { text: '激活状态', value: 'activeStatus' }
        ]
      }
    },
    watch: {
      // 由于manufacturers列表是在页面加载后才获取的，需要额外进行赋值
      '$store.state.options.manufacturers'(options) {
        this.list = this.list && this.list.map((value) => {
          const filtered = filterOptionOfArray(options, { key: 'text', value: value.manufacturerName })
          value.manufacturer = filtered[0] && filtered[0].value
        })
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$api.getNVRSerialList(this.listQuery).then(res => {
          this.list = []
          res.data.list.forEach((value) => {
            const filtered = filterOptionOfArray(this.$store.state.options.manufacturers, { key: 'text', value: value.name })
            this.list.push({
              id: {
                value: value.id
              },
              serial: {
                value: value.serial
              },
              manufacturer: {
                text: value.name,
                value: filtered[0] && filtered[0].value
              },
              channelCount: {
                value: value.chanel
              },
              mac: {
                value: value.mac
              },
              activeStatus: {
                value: value.status
              }
            })
          })
          this.total = res.data.total
          this.listLoading = false
        }).catch(error => {
          console.log(error)
        })
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