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
      :hasAdd="false"
      :hasDelete="false"
      @handleUpdate="handleUpdate(arguments, updateCallBack)"
      @handleDelete="handleDelete"
      @handleFilter="handleFilter"
      @handleCreate="handleCreate"
      @handleDownload="handleDownload"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
      <el-button slot="filter" class="filter-item" style="margin-left: 10px;" @click="handleBatchSetting" type="primary" icon="el-icon-edit">批量设置</el-button>
    </default-table>
    <edit-modal :formItems="modal.base.data" :visible.sync="modal.base.visible" :batch="modal.base.batch"></edit-modal>
  </div>
</template>

<script>
  import DefaultTable from '@/components/DefaultTable'
  import Table from '@/mixins/table'
  import EditModal from './VideoSettingEditModal'
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
            batch: false
          }
        },
        theads: [
          { text: '序号', value: 'index', columnOnly: true },
          { text: 'ID', value: 'id' },
          { text: '摄像头ID', value: 'cid' },
          { text: '录制开始时间', value: 'videoStartTime' },
          { text: '录制结束时间', value: 'videoEndTime' },
          { text: '上传开始时间', value: 'uploadStartTime' },
          { text: '上传结束时间', value: 'uploadEndTime' },
          { text: '周期', value: 'period' },
          { text: '生效星期', value: 'weekDays' },
          { text: '任务状态', value: 'status' },
          { text: '更新时间', value: 'updatedTime' }
        ]
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$api.getVideoSettingList(this.listQuery).then(res => {
          this.list = []
          res.data.items.forEach((value) => {
            this.list.push({
              index: value.index,
              id: value.id,
              cid: value.cid,
              videoTimes: value.videoTimes,
              uploadTimes: value.uploadTimes,
              videoStartTime: value.videoStartTime,
              videoEndTime: value.videoEndTime,
              uploadStartTime: value.uploadStartTime,
              uploadEndTime: value.uploadEndTime,
              period: value.period,
              weekDays: value.weekDays,
              status: value.status,
              updatedTime: value.updatedTime
            })
          })
          this.total = res.data.total
          this.listLoading = false
        }).catch(error => {
          console.log(error)
        })
      },
      handleBatchSetting() {
        this.modal.base.data = null
        this.modal.base.visible = true
        this.modal.base.batch = true
      },
      updateCallBack() {
        this.modal.base.batch = false
      }
    }
  }
</script>

<style lang="scss" scoped></style>