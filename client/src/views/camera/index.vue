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
      :hasEdit="false"
      :hasDelete="false"
      @handleUpdate="handleUpdate"
      @handleDelete="handleDelete"
      @handleFilter="handleFilter"
      @handleCreate="handleCreate"
      @handleDownload="handleDownload"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
      <router-link slot-scope="scope" slot="actions" class="button is-primary is-small" :to="{name: 'algoSetting', params: {cid: list[scope.index].cid.value}}">
        <el-button type="primary" size="mini" plain>配置</el-button>
      </router-link>
      <!-- <el-button type="primary" slot-scope="scope" slot="actions" size="mini" plain @click="routeToAlgo(scope.cid)">配置</el-button> -->
      <!-- <el-dropdown slot-scope="scope" slot="actions" size="mini" trigger="click" @command="handleCommand(arguments, scope.index)">
        <el-button type="primary" size="mini" plain>
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(value, key) in modal.more" :command="key" :key="key">{{ value.text }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </default-table>
    <camera-edit :formItems="modal.base.data" :visible.sync="modal.base.visible"></camera-edit>
    <stream-edit :cid="modal.more.stream.cid" :visible.sync="modal.more.stream.visible"></stream-edit>
    <video-setting-edit :cid="modal.more.videoSetting.cid" :visible.sync="modal.more.videoSetting.visible"></video-setting-edit>
  </div>
</template>

<script>
  import DefaultTable from '@/components/DefaultTable'
  import Table from '@/mixins/table'
  import CameraEdit from './CameraEditModal'
  import StreamEdit from '@/views/stream/StreamEditModal'
  import VideoSettingEdit from '@/views/stream/VideoSettingEditModal'
  export default {
    mixins: [Table],
    components: {
      DefaultTable,
      CameraEdit,
      StreamEdit,
      VideoSettingEdit
    },
    data() {
      return {
        modal: {
          more: {
            stream: {
              text: '流设置',
              visible: false,
              cid: -1
            },
            videoSetting: {
              text: '录播设置',
              visible: false,
              cid: -1
            },
            params: {
              text: '参数修改',
              visible: false,
              cid: -1
            },
            algo: {
              text: '算法配置',
              visible: false,
              cid: -1
            },
            user: {
              text: '用户配置',
              visible: false,
              cid: -1
            }
          }
        },
        theads: [
          { text: '摄像头ID', value: 'cid' },
          { text: '所属组ID', value: 'groupId', expendOnly: true },
          { text: '序列号', value: 'serial', align: 'left' },
          { text: 'mac', value: 'mac', align: 'left' },
          { text: '类型', value: 'type', expendOnly: true },
          { text: '是否改变', value: 'changed', expendOnly: true },
          { text: '状态', value: 'status' },
          // { text: '绑定状态', value: 'bound' },
          // { text: '传流状态', value: 'transfered' },
          { text: '开启debug', value: 'debug' },
          { text: '画面截图路径', value: 'capturePath', align: 'left', expendOnly: true },
          { text: '自定义名称', value: 'userDefinedName', align: 'left', expendOnly: true },
          { text: '添加时间', value: 'addTime', expendOnly: true }
        ]
      }
    },
    methods: {
      async getList() {
        this.listLoading = true
        const res = await this.$api.getCameraList({
          page: this.listQuery.page,
          per_page: this.listQuery.limit
        })
        if (res) {
          this.list = []
          res.data.list.forEach((value) => {
            this.list.push({
              cid: {
                value: value.cid
              },
              groupId: {
                value: value.groupId
              },
              type: {
                text: '',
                value: value.type
              },
              mac: {
                value: value.mac
              },
              serial: {
                value: value.serial
              },
              userDefinedName: {
                value: value.name
              },
              capturePath: {
                value: value.pic_path
              },
              transfered: {
                value: value.transfered
              },
              changed: {
                value: value.changed
              },
              status: {
                value: value.status
              },
              bound: {
                value: value.bound
              },
              boundAndTransed: {
                value: value.boundAndTransed
              },
              debug: {
                value: value.debug
              },
              addTime: {
                value: value.addTime
              }
            })
          })
          this.total = res.data.total_count
        }
        this.listLoading = false
      },
      handleCommand() {
        console.log(arguments[0][0])
        const modal = this.modal.more[arguments[0][0]]
        modal.visible = true
        modal.cid = this.list[arguments[1]].cid
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-dropdown {
    margin: 2px 4px;
  }
</style>