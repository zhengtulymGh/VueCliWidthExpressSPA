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
      :hasPagination="false"
      @handleUpdate="handleUpdate"
      @handleDelete="handleDelete"
      @handleFilter="handleFilter"
      @handleCreate="handleCreate(arguments, createCallBack)"
      @handleDownload="handleDownload"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
      <template slot-scope="scope" slot="actions">
        <el-button class="filter-item" type="primary" size="mini" plain @click="handleUpdateParams(scope.index)">参数配置</el-button>
        <el-button v-if="list[scope.index] && list[scope.index].hasAreaSetting" class="filter-item" type="primary" size="mini" plain  @click="handleUpdateArea(scope.index)">区域配置</el-button>
      </template>
    </default-table>
    <edit-modal :formItems="modal.base.data" :visible.sync="modal.base.visible" @submit="handleSubmit"></edit-modal>
    <params-edit-modal :formItems="modal.params.data" :visible.sync="modal.params.visible" @submit="handleUpdatedParams"></params-edit-modal>
    <area-edit-modal :index="modal.area.index" :visible.sync="modal.area.visible" @submit="handleUpdatedArea"></area-edit-modal>
  </div>
</template>

<script>
  import DefaultTable from '@/components/DefaultTable'
  import Table from '@/mixins/table'
  import EditModal from './EditModal'
  import ParamsEditModal from './ParamsEditModal'
  import AreaEditModal from './AreaEditModal'
  import { filterOptionOfArray } from '@/utils'
  export default {
    mixins: [Table],
    components: {
      DefaultTable,
      EditModal,
      ParamsEditModal,
      AreaEditModal
    },
    data() {
      return {
        cid: this.$route.params.cid,
        modal: {
          params: {
            visible: false,
            data: null
          },
          area: {
            visible: false,
            index: 0,
            data: null
          }
        },
        theads: [
          { text: '算法名称', value: 'firstAlgo' },
          { text: '增值功能', value: 'secondAlgos' },
          { text: '添加时间', value: 'addedTime' },
          { text: '已购时长（月）', value: 'boughtMonths' },
          { text: '生效时段', value: 'expireTime' },
          { text: '更新时间', value: 'updatedTime' },
          { text: '状态', value: 'status' }
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
    created() {
      this.$store.dispatch('GetConfigRelations')
    },
    methods: {
      async getList() {
        this.listLoading = true
        const data = await this.$store.dispatch('GetCameraAlgos', this.cid)
        if (data) {
          try {
            this.list = []
            data.forEach(async(value) => {
              const algos = value.arith_types.split('|')
              this.list.push({
                firstAlgo: {
                  text: '',
                  value: Number(algos[0])
                },
                secondAlgos: {
                  text: '',
                  value: algos[1].split(',').map((algo) => {
                    return Number(algo)
                  })
                },
                addedTime: {
                  text: value.create_at,
                  value: value.create_at
                },
                boughtMonths: {
                  text: value.buy_months,
                  value: value.buy_months
                },
                expireTime: {
                  text: value.expire_date,
                  value: value.expire_date
                },
                updatedTime: {
                  text: value.update_at,
                  value: value.update_at
                },
                status: {
                  text: value.status,
                  value: value.status
                },
                isRealTime: {
                  value: value.analysis_time === 'real_time'
                },
                isWholeDay: {
                  value: value.module_begin_time === '00:00:00' && value.module_end_time === '00:00:00'
                },
                alarmThreshold: {
                  value: value.loitering_threshold
                },
                activeTimeRange: {
                  value: (() => {
                    function getDate(timeStr) {
                      const timeArr = timeStr.split(':')
                      return new window.Date(2000, 1, 1, Number(timeArr[0]), Number(timeArr[1]), Number(timeArr[2]))
                    }
                    return [getDate(value.module_begin_time), getDate(value.module_end_time)]
                  })()
                },
                headWidthRange: {
                  value: [Number(value.detection_min_size.x), Number(value.detection_max_size.x)]
                },
                hasAreaSetting: {
                  value: await this.hasAreaSetting(algos[1])
                }
              })
            })
          } catch (error) {
            console.log(error)
          }
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
      },
      async hasAreaSetting(types) {
        const typeArr = types.split(',')
        for (let i = 0; i < typeArr.length; i++) {
          const type = typeArr[i]
          if (this.$store.state.algorithms.calibRelations[type]) {
            return !!this.$store.state.algorithms.calibRelations[type].length
          } else {
            const res = await this.$store.dispatch('GetCalibRelations', type)
            return !!(res && res.length)
          }
        }
      },
      handleUpdateParams(index) {
        this.modal.params.data = this.list[index]
        this.modal.params.visible = true
      },
      handleUpdatedParams() {
        this.modal.params.data = null
        this.modal.params.visible = false
      },
      handleUpdateArea(index) {
        this.modal.area.data = this.list[index]
        this.modal.area.index = index
        this.modal.area.visible = true
      },
      handleUpdatedArea() {
        this.modal.area.data = null
        this.modal.area.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped></style>