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
  import EditModal from './StreamSettingEditModal'
  export default {
    mixins: [Table],
    components: {
      DefaultTable,
      EditModal
    },
    data() {
      return {
        theads: [
          { text: '序号', value: 'index', columnOnly: true },
          { text: 'ID', value: 'id' },
          { text: '摄像头ID', value: 'cid' },
          { text: '是否推流', value: 'pushFlow' },
          { text: '在线时长', value: 'onlineTime' },
          { text: '自动检测', value: 'autoCheck' },
          { text: '接收人电话', value: 'tel' },
          { text: '更新时间', value: 'updatedTime' }
        ]
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$api.getMonitorStreamList(this.listQuery).then(res => {
          this.list = []
          res.data.items.forEach((value) => {
            this.list.push({
              index: value.index,
              id: value.id,
              cid: value.cid,
              pushedFlow: value.pushFlow,
              onlineTime: value.onlineTime,
              autoCheck: value.autoCheck,
              tel: value.tel,
              updatedTime: value.updatedTime
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