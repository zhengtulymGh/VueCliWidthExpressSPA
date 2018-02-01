<template>
  <el-dialog :title="title" :visible.sync="visible_" class="stream-edit-modal" element-loading-target=".stream-edit-modal" v-loading="loading" element-loading-text="Loading">
    <el-form :rules="rules" ref="dataForm" :model="formItems_" :label-width="style.labelWidth" label-position="left">
      <el-form-item label="已购时长">
        <el-input-number v-model="formItems_.boughtMonths" :min="0" :max="120" size="small"></el-input-number>&nbsp;&nbsp;<span>月（&#60;= 120）</span>
      </el-form-item>
      <el-form-item label="是否实时">
        <el-switch
          v-model="formItems_.isRealTime"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否全天">
        <el-switch
          v-model="formItems_.isWholeDay"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-form-item>
      <el-form-item v-if="!this.formItems_.isWholeDay" label="开启时段">
        <el-time-picker
          is-range
          v-model="formItems_.activeTimeRange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          size="small">
        </el-time-picker>
      </el-form-item>
      <el-form-item v-if="hasAlarmThreshold" label="报警阈值" prop="alarmThreshold">
        <el-input-number v-model="formItems_.alarmThreshold" :min="0" :max="300" size="small"></el-input-number>
      </el-form-item>
      <el-form-item v-for="item in additionParams" :label="item.label || item.name" prop="alarmThreshold">
        <template v-if="item.type === 'number'">
          <el-input-number v-if="item.valid_rule === 'between'" v-model="item.value" :min="Number(item.valid_detail.split('-')[0])" :max="Number(item.valid_detail.split('-')[1])" size="small"></el-input-number>
          <el-input-number v-else v-model="item.value" size="small"></el-input-number>
        </template>
        <el-input v-else v-model="item.value"></el-input>
      </el-form-item>
      <el-form-item v-show="detection.show" label="人头宽度">
        <el-slider v-model="formItems_.headWidthRange" range :step="0.01" :max="0.2" :min="0.01"></el-slider>
        <div class="camaraPictureWrap" ref="camaraPictureWrap">
          <img :src="detection.cameraPicture.src" @load="onImgLoad">
          <!-- <img src="http://img-alert.extremevision.com.cn/shot_20170111180256_882bbe5445ba4f3a8ed50ca9eedca6d0.jpg" @load="onImgLoad"> -->
          <span class="rectangle left" :style="{'width': `${detectionMinWidth}px`, 'height': `${detectionMinWidth}px`}"></span>
          <span class="rectangle right" :style="{'width': `${detectionMaxWidth}px`, 'height': `${detectionMaxWidth}px`}"></span>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible_ = false">取 消</el-button>
      <el-button type="primary" @click="updateData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import FormModal from '@/mixins/formModal'
  import { PUBLIC_PARAMS, PARAMS_NAME } from './data.js'
  import { parseTime } from '@/utils'
  export default{
    mixins: [FormModal],
    data() {
      return {
        cid: Number(this.$route.params.cid),
        formTag: '参数',
        detection: {
          show: false,
          cameraPicture: {
            src: '',
            width: ''
          }
        },
        hasAlarmThreshold: false,
        additionParams: {}
      }
    },
    computed: {
      rules() {
        const rules = {
          secondAlgos: []
        }
        return rules
      },
      detectionMinWidth() {
        return this.formItems_.headWidthRange && (this.formItems_.headWidthRange[0] * this.detection.cameraPicture.width)
      },
      detectionMaxWidth() {
        return this.formItems_.headWidthRange && (this.formItems_.headWidthRange[1] * this.detection.cameraPicture.width)
      }
    },
    watch: {
      async visible() {
        console.log('this.formItems_.secondAlgos', this.formItems_.secondAlgos.length)
        if (!this.formItems_.secondAlgos.length) {
          this.detection.show = false
          return
        }
        const additionParams_ = {}
        for (let i = 0; i < this.formItems_.secondAlgos.length; i++) {
          const type = this.formItems_.secondAlgos[i]
          const calibRelations = this.$store.state.algorithms.calibRelations[type]
          if (this.testDetectionSize(calibRelations)) {
            this.detection.show = true
          }
          console.log(type)

          this.$store.state.algorithms.configRelations.data.forEach((list) => {
            console.log(type)
            if (list.type !== type || typeof list.cfgu_require !== 'object') {
              return // forEach里面不能使用continue
            }
            console.log(list.cfgu_require)
            for (const key in list.cfgu_require) {
              if (key === 'loitering_threshold') {
                this.hasAlarmThreshold = true
              }
              if (PUBLIC_PARAMS.has(key)) {
                continue
              }
              additionParams_[key] = list.cfgu_require[key]
              const position = additionParams_[key].position
              const _default = additionParams_[key].default
              additionParams_[key].label = PARAMS_NAME[key]
              additionParams_[key].value = this.formItems_[position] || _default
            }
          })
        }
        this.additionParams = additionParams_
      }
    },
    created() {
      console.log('cerated')
    },
    methods: {
      initdata() {
        this.formItems_ = {
          secondAlgos: [],
          boughtMonths: 0,
          isRealTime: false,
          isWholeDay: false,
          activeTimeRange: [new Date(2000, 1, 1, 9, 0, 0), new Date(2000, 1, 1, 21, 0, 0)],
          alarmThreshold: 60,
          headWidthRange: [0.04, 0.2]
        }
      },
      updateData() {
        this.$refs['dataForm'].validate(async(valid) => {
          if (valid) {
            const params = {
              cid: this.cid,
              arith_types: `${this.formItems_.firstAlgo}|${this.formItems_.secondAlgos.join(',')}`,
              analysis_time: this.formItems_.isRealTime ? 'real_time' : 'close_time',
              module_begin_time: parseTime(this.formItems_.activeTimeRange[0], '{h}:{i}:{s}'),
              module_end_time: parseTime(this.formItems_.activeTimeRange[1], '{h}:{i}:{s}'),
              loitering_threshold: this.formItems_.alarmThreshold,
              detection_min_size: JSON.stringify({ x: this.detectionMinWidth, y: this.detectionMinWidth }),
              detection_max_size: JSON.stringify({ x: this.detectionMaxWidth, y: this.detectionMaxWidth }),
              buy_months: this.formItems_.boughtMonths
            }
            for (const key in this.additionParams) {
              params[this.additionParams[key].position] = this.additionParams[key].value
            }
            const res = await this.$api.updateCameraAlgo(params)
            if (res) {
              this.submit('updated')
            }
          }
        })
      },
      testDetectionSize(calibRelations) {
        if (!calibRelations || calibRelations.length === 0) return false
        for (let i = 0; i < calibRelations.length; i++) {
          if (/detection.*size/.test(calibRelations[i].name)) {
            this.getCameraPicture()
            return true
          }
        }
        return false
      },
      async getCameraPicture() {
        const res = await this.$api.getCameraPicture({ cid: this.cid })
        if (res) {
          this.detection.cameraPicture.src = res.pic_path
        }
      },
      onImgLoad() {
        this.detection.cameraPicture.width = this.$refs.camaraPictureWrap.clientWidth
      }
    }
  }
</script>

<style lang="scss" scoped>
  .camaraPictureWrap{
    position: relative;
    img{
      width: 100%;
    }
    .rectangle{
      position: absolute;
      top: 0;
      border: 2px solid #f00;
      &.left{
        left: 0;
      }
      &.right{
        right: 0;
      }
    }
  }
</style>