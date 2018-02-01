<template>
  <el-dialog :title="title" :visible.sync="visible_" class="stream-edit-modal" element-loading-target=".stream-edit-modal" v-loading="loading" element-loading-text="Loading">
    <div class="tools">
      <el-button class="button" :type="step === 0 ? 'primary' : ''" :disabled="step != 0 || (groupId > 0 && !isCleaned)">
        <span class="icon is-small">
          <i class="fa fa-square-o"></i>
        </span>
      </el-button>
      <el-button class="button" :type="step === 1 ? 'primary' : ''" :disabled="step != 1">
        <span class="icon is-small">
          <i class="fa fa-minus"></i>
        </span>
      </el-button>
      <el-button class="button" :type="step === 2 ? 'primary' : ''" :disabled="step != 2">
        <span class="icon is-small">
          <i class="fa fa-dot-circle-o"></i>
        </span>
      </el-button>
      <el-button class="button" :type="step === 3 ? 'primary' : ''" :disabled="step != 3">
        <span class="icon is-small">
          <i class="fa fa-location-arrow"></i>
        </span>
      </el-button>
      <el-button class="button" @click="clean">
        <span class="icon is-small">
          <i class="fa fa-trash-o"></i>
        </span>
      </el-button>
    </div>
    <div class="draw-pad" id="canvasDraw"></div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible_ = false">取 消</el-button>
      <el-button type="primary" @click="updateData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import FormModal from '@/mixins/formModal'
  import CanvasDraw from '@/components/CanvasDraw'
  import { Message } from 'element-ui'

  const EXCEPT = new Set([
    'heatmap_detection_min_size',
    'heatmap_detection_max_size'
  ])

  export default {
    mixins: [FormModal],
    props: {
      index: {
        type: Number,
        require: true
      }
    },
    data() {
      return {
        cid: this.$route.params.cid,
        formTag: '区域',
        isCleaned: false,
        firstConfigType: null,
        groupId: null,
        graphsToDraw: {
          'polygon': null,
          'line': null,
          'point': null,
          'arrow': null
        },
        graphsDrawn: {
          'polygon': 0,
          'line': 0,
          'point': 0,
          'arrow': 0
        },
        stepArr: [
          'polygon', 'line', 'point', 'arrow'
        ],
        oldGraphs: [],
        completed: false,
        nextStepDisabled: true,
        canvasDraw: null,
        step: 0
      }
    },

    mounted() {

    },

    computed: {
      graphTypesToDraw () {
        let n = 0
        for (let k in this.graphsToDraw) {
          if (this.graphsToDraw[k]) {
            n++
          }
        }
        return n
      }
    },

    methods: {
      async initdata() {
        const algo = this.$store.state.algorithms.cameraAlgos[this.cid]
        const { arith_types } = algo && algo.data[this.index] || ''
        const firstConfig = arith_types.split('|')[0]
        const subConfigs = arith_types.split('|')[1].split(',')
        this.firstConfigType = firstConfig
        await this.initGraphsToDraw(firstConfig, subConfigs)
        const type_ids = this.getGraphTypeIds()
        const areaConf = await this.$api.getCameraAlgoAreaConf(this.cid, type_ids)
        this.initOldGraphs(areaConf)

        this.initCanvas(!!type_ids)
      },
      nextStep () {
        this.nextStepDisabled = true
        let next = this.step
        next++
        while (!this.graphsToDraw[this.stepArr[next]] && next < this.stepArr.length) {
          next++
        }
        if (next >= this.stepArr.length) {
          this.completed = true
          this.canvasDraw.setCanDraw(false)
        }
        this.step = next
      },

      initOldGraphs (areaConf) {
        for (let i = 0; i < areaConf.length; i++) {
          const _areaConf = areaConf[i]
          for (let group in _areaConf) {
            this.groupId = group
            const groupObj = _areaConf[group]
            for (let typeId in groupObj) {
              const typeObj = groupObj[typeId]
              const graph = this.getGraphTypeByTypeId(typeId)
              for (let p in typeObj) {
                let points = typeObj[p]
                if (!this.$tools.isType('Array', points)) {
                  points = [points]
                }
                this.oldGraphs.push({type: graph, points})
              }
            }
          }
        }
      },

      getGraphTypeByTypeId (typeId) {
        for (let graph in this.graphsToDraw) {
          if (!this.graphsToDraw[graph]) continue
          if (String(this.graphsToDraw[graph].type_id) === String(typeId)) {
            return graph
          }
        }
      },

      clean () {
        this.isCleaned = true
        this.canvasDraw.clean()
        this.canvasDraw.setDrawType('polygon')
        this.completed = false
        this.canvasDraw.setCanDraw(true)
        this.step = 0
        for (let i in this.graphsDrawn) {
          this.graphsDrawn[i] = 0
        }
      },

      async initCanvas () {
        console.log()
        const canvasDraw = document.getElementById('canvasDraw')
        const width = canvasDraw.offsetWidth
        const height = canvasDraw.offsetHeight
        this.canvasDraw = new CanvasDraw({
          id: 'canvasDraw',
          bgImg: await this.$api.getCameraPicture({ cid: this.cid }),
          oldGraphs: this.oldGraphs,
          canDraw: !(this.oldGraphs.length > 0),
          width,
          height
        })
        this.canvasDraw.init()

        this.canvasDraw.listen('afterDrawGraph', (graphs) => {
          this.afterDrawGraph(graphs)
        })
      },

      afterDrawGraph (graphs) {
        const len = graphs.length
        const type = graphs[len - 1].type
        this.graphsDrawn[type]++
        if (parseInt(this.graphsDrawn[type]) >= parseInt(this.graphsToDraw[type].min)) {
          this.nextStepDisabled = false
        }
        if (parseInt(this.graphsDrawn[type]) === parseInt(this.graphsToDraw[type].max)) {
          this.nextStep()
          this.canvasDraw.setDrawType(this.stepArr[this.step])
        }
      },

      // firstConfig 一级算法 config 二级算法
      async initGraphsToDraw (firstConfig, configs) {
        const s = new Set(configs)
        // const ret = await this.$api.getAlgoCalibRelations(firstConfig)
        const ret = this.$store.state.algorithms.calibRelations[firstConfig]

        if (ret.length <= 0) return

        for (let i = 0; i < ret.length; i++) {
          if (!/_size/.test(ret[i].name) && s.has(ret[i].config_type)) {
            let front_shape = ret[i].front_shape
            if (front_shape === 'ploygon') front_shape = 'polygon'
            if (front_shape === 'line_string') front_shape = 'line'
            this.graphsToDraw[front_shape] = ret[i]
          }
        }
      },

      getGraphTypeIds () {
        let ids = []
        for (let i in this.graphsToDraw) {
          if (this.graphsToDraw[i]) {
            ids.push(this.graphsToDraw[i].type_id)
          }
        }
        return ids.join(',')
      },

      async updateData() {
        const {firstConfigType, groupId} = this
        let graphs = this.canvasDraw.getGraphsData()
        let params = {
          cid: this.cid,
          config_type: firstConfigType,
          group_id: groupId || -1,
          detail: {}
        }

        for (var i = 0; i < graphs.length; i++) {
          const graphType = graphs[i].type
          let points = graphs[i].points
          const typeId = this.graphsToDraw[graphType].type_id
          if (!params.detail[typeId]) params.detail[typeId] = []
          if (graphType === 'point') points = points[0]
          params.detail[typeId].push(points)
        }
        params.detail = JSON.stringify(params.detail)

        const ret = await this.$api.updateCameraAlgoAreaConf(params)
        if (ret) {
          Message({
            type: 'success',
            message: '区域设置成功',
            duration: 5 * 1000
          })
          this.submit('updated')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .draw-pad {
    width: 900px;
    height: 490px;
    max-width: 900px;
    margin-top: 1rem;
  }
  .header {
    display: flex;
    justify-content: space-between;
  }
</style>
