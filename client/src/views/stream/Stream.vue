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
  import EditModal from './StreamEditModal'
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
          { text: '所属摄像头ID', value: 'cid' },
          { text: '所属地区', value: 'area' },
          { text: '视频类型', value: 'videoType' },
          { text: '直播内网地址', value: 'liveUrlIn', align: 'left' },
          { text: '直播外网地址', value: 'liveUrlOut', align: 'left' },
          { text: '录播内网地址', value: 'replayUrlIn', align: 'left' },
          { text: '录播外网地址', value: 'replayUrlOut', align: 'left' },
          { text: 'status', value: 'status' },
          { text: '添加时间', value: 'addTime' }
        ]
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$api.getStreamList(this.listQuery).then(res => {
          this.list = []
          res.data.items.forEach((value) => {
            this.list.push({
              index: value.index,
              id: value.id,
              cid: value.cid,
              area: value.area,
              videoType: value.videoType,
              liveUrlIn: value.liveUrlIn,
              liveUrlOut: value.liveUrlOut,
              replayUrlIn: value.liveUrlIn,
              replayUrlOut: value.liveUrlOut,
              status: value.status,
              addTime: value.addTime
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