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
  import EditModal from './AlgoEditModal'
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
          { text: '序号', value: 'index', columnOnly: true },
          { text: 'ID', value: 'id' },
          { text: '算法名称', value: 'name' },
          { text: '算法类型', value: 'type' },
          { text: '模型文件', value: 'modelFilePath', align: 'left' },
          { text: '部署文件', value: 'deployFilePath', align: 'left' },
          { text: '均值文件', value: 'meanFilePath', align: 'left' }
        ]
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$api.getAlgoList(this.listQuery).then(res => {
          this.list = []
          res.data.items.forEach((value) => {
            this.list.push({
              index: value.index,
              id: value.id,
              name: value.name,
              type: value.type,
              modelFilePath: value.modelFilePath,
              deployFilePath: value.deployFilePath,
              meanFilePath: value.meanFilePath
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