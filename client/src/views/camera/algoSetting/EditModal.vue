<template>
  <el-dialog :title="title" :visible.sync="visible_" class="stream-edit-modal" element-loading-target=".stream-edit-modal" v-loading="loading" element-loading-text="Loading">
    <el-form :rules="rules" ref="dataForm" :model="formItems_" :label-width="style.labelWidth" label-position="left">
      <el-form-item label="算法">
        <el-select class="filter-item" v-model="formItems_.firstAlgo" placeholder="请选择" :disabled="status === 'update'" @change="handleFirstAlgoChange">
          <el-option v-for="option in firstAlgoOptions" :key="option.value" :label="option.text" :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="增值功能">
        <el-select class="filter-item" v-model="formItems_.secondAlgos" multiple placeholder="请选择" size="large" prop="secondAlgos">
          <el-option v-for="option in secondAlgoOptions" :key="option.value" :label="option.text" :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible_ = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import FormModal from '@/mixins/formModal'
  import { PUBLIC_PARAMS } from './data.js'
  export default{
    mixins: [FormModal],
    props: {
      createWidthCsv: Boolean
    },
    data() {
      return {
        cid: Number(this.$route.params.cid),
        formTag: '算法',
        secondAlgoOptions: []
      }
    },
    computed: {
      status() {
        return this.formItems ? 'update' : (this.createWidthCsv ? 'createWidthCsv' : 'create')
      },
      rules() {
        const rules = {
          secondAlgos: []
        }
        rules.secondAlgos.push({ validator: this.validateMultiSelect, trigger: 'blur' })
        return rules
      },
      firstAlgoOptions() {
        console.log('computing firstAlgoOptions')
        if (this.formItems) {
          return this.$store.state.algorithms.configRelations.algos
        } else {
          const cameraAlgos = this.$store.state.algorithms.cameraAlgos[this.cid]
          if (cameraAlgos) {
            return this.$store.state.algorithms.configRelations.algos.filter((algo) => {
              return cameraAlgos.firstAlgos.indexOf(algo.value) === -1
            })
          }
        }
      },
      algoTypes() {
        return `${this.formItems_.firstAlgo}|${this.formItems_.secondAlgos.join(',')}`
      }
    },
    methods: {
      initdata() {
        this.formItems_ = {
          firstAlgo: this.firstAlgoOptions[0] && this.firstAlgoOptions[0].value,
          secondAlgos: []
        }
        // this.secondAlgoOptions = this.$store.state.algorithms.configRelations.algos.filter((algo) => {
        //   algo.value === this.formItems_.firstAlgo.value
        // })[0].child
      },
      async handleSubmit() {
        switch (this.status) {
          case 'create':
            this.createData()
            break
          case 'update':
            this.updateData()
            break
        }
      },
      createData() {
        this.cerateUpdateFun('created')
      },
      updateData() {
        this.cerateUpdateFun('updated')
      },
      cerateUpdateFun(submitStatus) {
        this.$refs['dataForm'].validate(async(valid) => {
          if (valid) {
            const params = {
              cid: this.cid,
              arith_types: this.algoTypes
            }
            this.$store.state.algorithms.configRelations.data.forEach((list) => {
              if (this.formItems_.secondAlgos.indexOf(list.type) === -1 || typeof list.cfgu_require !== 'object') {
                return // forEach里面不能使用continue
              }
              for (const key in list.cfgu_require) {
                if (PUBLIC_PARAMS.has(key)) {
                  continue
                }
                const { position, valid_detail } = list.cfgu_require[key]
                const _default = list.cfgu_require[key].default
                let value = ''
                if (_default) {
                  value = _default
                } else {
                  value = valid_detail.split(/-|,/)[0]
                }
                // console.log(`${position}`, value)
                params[position] = value
              }
            })
            // console.log('params', params)
            const res = await this.$api.updateCameraAlgo(params)
            if (res) {
              this.submit(submitStatus)
            }
          }
        })
      },
      handleFileChange(e) {
        console.log(e)
        this.formItems_.file = e.target.files[0]
        this.formItems_.filePath = e.target.value
      },
      handleFirstAlgoChange(value) {
        this.formItems_.secondAlgos = []
        const firstAlgoArr = this.firstAlgoOptions && this.firstAlgoOptions.filter((algo) => {
          return algo.value === value
        })
        console.log(firstAlgoArr)
        this.secondAlgoOptions = firstAlgoArr[0] && firstAlgoArr[0].child
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fileInput{
    /deep/ .el-input-group__append{
      position: relative;
      width: 10%;
      min-width: 30px;
      cursor: pointer;
      input{
        width: 100%;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
      }
    }
  }
</style>