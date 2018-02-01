<template>
  <el-dialog :title="title" :visible.sync="visible_" class="stream-edit-modal" element-loading-target=".stream-edit-modal" v-loading="loading" element-loading-text="Loading">
    <el-form :rules="rules" ref="dataForm" :model="formItems_" :label-width="style.labelWidth" label-position="left">
      <el-form-item v-if="status === 'update'" label="ID">
        <el-input v-model="formItems_.id" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="status === 'create' || status === 'createWidthCsv'" label="秘钥" prop="secretKey">
        <el-input v-model="formItems_.secretKey"></el-input>
      </el-form-item>
      <el-form-item v-if="status !== 'createWidthCsv'" label="序列号" prop="serials">
        <el-input v-model="formItems_.serials" :placeholder="this.status === 'create' ? '多序列号，不同序列号以英文逗号分隔，最多支持20个' : ''"></el-input>
      </el-form-item>
      <el-form-item v-if="status === 'createWidthCsv'" label="上传CSV" prop="filePath">
        <el-input class="fileInput" type="text" v-model="formItems_.filePath" disbaled>
          <template slot="append">
            <label>选择文件</label>
            <input type="file" accept=".csv" @change="handleFileChange">
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="厂商" prop="manufacturer">
        <el-select class="filter-item" v-model="formItems_.manufacturer" placeholder="请选择" :loading="!manufacturerOptions.length">
          <el-option v-for="option in manufacturerOptions" :key="option.value" :label="option.text" :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="status === 'create' || status === 'createWidthCsv'" label="摄像头" prop="cameraType">
        <el-select class="filter-item" v-model="formItems_.cameraType" placeholder="请选择">
          <el-option v-for="option in cameraTypeOptions" :key="option.value" :label="option.text" :value="option.value" :loading="!cameraTypeOptions.length">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="status === 'update'" label="是否激活">
        <template>
          <el-radio v-model="formItems_.activeStatus" :label="1" disabled>激活</el-radio>
          <el-radio v-model="formItems_.activeStatus" :label="0" disabled>未激活</el-radio>
        </template>
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
  export default{
    mixins: [FormModal],
    props: {
      cid: Number,
      createWidthCsv: Boolean
    },
    data() {
      return {
        formTag: '厂商序列号',
        manufacturerOptions: this.$store.state.options.manufacturers,
        cameraTypeOptions: this.$store.state.options.cameraTypes, // 在store中写死了
        statusOptions: {
          createWidthCsv: '导入CSV文件创建'
        }
      }
    },
    computed: {
      status() {
        return this.formItems ? 'update' : (this.createWidthCsv ? 'createWidthCsv' : 'create')
      },
      rules() {
        const rules = {
          secretKey: [],
          serials: [],
          filePath: []
        }
        rules.secretKey.push(this.getRequireValidateObj('秘钥'))
        rules.serials.push(this.getRequireValidateObj('序列号'))
        if (this.status === 'create') {
          rules.serials.push(this.getCommaSeparatorValidateObj('序列号'))
        }
        if (this.status === 'createWidthCsv') {
          rules.filePath.push(this.getRequireValidateObj('csv文件'))
        }
        return rules
      }
    },
    watch: {
      '$store.state.options.manufacturers'(list) {
        console.log(list)
        this.manufacturerOptions = list
        this.formItems_.manufacturer = this.formItems_.manufacturer || (list[0] && list[0].value)
      }
    },
    methods: {
      initdata() {
        this.formItems_ = {
          id: '',
          secretKey: 'kjisdhipiaoas', // kjisdhipiaoas
          serials: '',
          manufacturer: this.manufacturerOptions[0] && this.manufacturerOptions[0].value,
          cameraType: this.cameraTypeOptions[0] && this.cameraTypeOptions[0].value,
          activeStatus: 0,
          file: null,
          filePath: ''
        }
      },
      async handleSubmit() {
        switch (this.status) {
          case 'create':
            this.createData()
            break
          case 'createWidthCsv':
            this.createDataWidthCSV()
            break
        }
      },
      createData() {
        this.$refs['dataForm'].validate(async(valid) => {
          if (valid) {
            const res = await this.$api.createManufacturerSerials({
              key: this.formItems_.secretKey,
              gid: this.formItems_.manufacturer,
              camera_type: this.formItems_.cameraType,
              serials: this.formItems_.serials
            })
            if (res) {
              this.submit('created')
            }
          }
        })
      },
      createDataWidthCSV() {
        this.$refs['dataForm'].validate(async(valid) => {
          if (valid) {
            const res = await this.$api.createManufacturerSerialsWidthCSV({
              key: this.formItems_.secretKey,
              gid: this.formItems_.manufacturer,
              camera_type: this.formItems_.cameraType,
              file: this.formItems_.file
            })
            if (res) {
              this.submit('created')
            }
          }
        })
      },
      // updateData() {
      //   this.$refs['dataForm'].validate((valid) => {
      //     if (valid) {
      //       const tempData = Object.assign({}, this.formItems_)
      //       tempData.timestamp = +new Date(tempData.timestamp)
      //     }
      //   })
      // },
      uploadCsv(obj) {
        // let formData = new FormData()
        // formData.append('file', item.file)
        // this.$api.uploadCsv(formData).then(res => {
        //   console.log('上传图片接口-数据', res)
        // }).catch(err => {
        //   console.log('报错', err)
        // })
      },
      handleFileChange(e) {
        console.log(e)
        this.formItems_.file = e.target.files[0]
        this.formItems_.filePath = e.target.value
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