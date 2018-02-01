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
      @handleCreate="handleCreate"
      @handleDownload="handleDownload"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
    </default-table>
    <edit-modal :formItems="modal.base.data" :visible.sync="modal.base.visible"></edit-modal>
  </div>
</template>

<script>
  import DefaultTable from '@/components/DefaultTable'
  import Table from '@/mixins/table'
  import EditModal from './ManufacturerManageEditModal'
  export default {
    mixins: [Table],
    components: {
      DefaultTable,
      EditModal
    },
    data() {
      return {
        modal: {
          stream: {
            visible: false,
            data: null
          }
        },
        theads: [
          { text: 'ID', value: 'id' },
          { text: '厂商编号', value: 'number' },
          { text: '厂商名称', value: 'name' },
          { text: '厂商类型', value: 'type' },
          { text: '序列号总数', value: 'serialCount' },
          { text: '激活数量', value: 'activeCount' }
        ]
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$api.getManufacturerList(this.listQuery).then(res => {
          this.list = []
          res.data.forEach((value) => {
            this.list.push({
              id: {
                value: value.id
              },
              number: {
                value: value.gid
              },
              name: {
                text: value.name,
                value: ''
              },
              type: {
                value: value.type
              },
              serialCount: {
                value: value.serialCount
              },
              activeCount: {
                value: value.activeCount
              }
            })
          })
          this.total = res.data.total
          this.listLoading = false
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style lang="scss" scoped></style>