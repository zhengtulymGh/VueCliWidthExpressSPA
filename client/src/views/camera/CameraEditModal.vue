<template>
  <el-dialog :title="title" :visible.sync="visible_">
    <el-form :rules="rules" ref="dataForm" :model="formItems_" :label-width="style.labelWidth" label-position="left">
      <el-form-item label="摄像头ID" prop="cid">
        <el-input v-model="formItems_.cid"></el-input>
      </el-form-item>
      <el-form-item label="所属组ID" prop="groupId">
        <el-input v-model="formItems_.groupId"></el-input>
      </el-form-item>
      <el-form-item label="mac">
        <el-input v-model="formItems_.mac"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select class="filter-item" v-model="formItems_.type" placeholder="请选择">
          <el-option v-for="option in typeOptions" :key="option.value" :label="option.text" :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自定义名称">
        <el-input v-model="formItems_.userDefinedName"></el-input>
      </el-form-item>
      <el-form-item label="序列号">
        <el-input v-model="formItems_.serial"></el-input>
      </el-form-item>
      <el-form-item label="画面截图路径">
        <el-input v-model="formItems_.capturePath"></el-input>
      </el-form-item>
      <el-form-item label="是否改变">
        <template>
          <el-radio v-model="formItems_.changed" :label="true">已改变</el-radio>
          <el-radio v-model="formItems_.changed" :label="false">未改变</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="绑定与传流">
        <el-checkbox v-model="formItems_.bound" border>已绑定</el-checkbox>
        <el-checkbox v-model="formItems_.transfered" border>已传流</el-checkbox>
      </el-form-item>
      <el-form-item label="debug">
        <el-switch
          v-model="formItems_.debug"
          active-text="开启"
          inactive-text="关闭">
        </el-switch>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="formItems_.addTime" :disabled="status=='update'" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible_ = false">取 消</el-button>
      <el-button v-if="status=='create'" type="primary" @click="createData">确 定</el-button>
      <el-button v-else type="primary" @click="updateData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import FormModal from '@/mixins/formModal'
  export default{
    mixins: [FormModal],
    data() {
      return {
        typeOptions: [
          {
            text: '入口型',
            value: 1
          }, {
            text: '全景型',
            value: 2
          }, {
            text: '局部型',
            value: 3
          }, {
            text: '室内入口',
            value: 4
          }
        ],
        formTag: '摄像头',
        rules: {
          cid: [{ required: true, message: 'cid is required', trigger: 'blur' }],
          groupId: [{ required: true, message: 'groupId is required', trigger: 'blur' }]
        }
      }
    },
    methods: {
      initdata() {
        this.formItems_ = {
          cid: '',
          groupId: '',
          mac: '',
          serial: '',
          type: this.typeOptions[0].value,
          userDefinedName: '',
          changed: false,
          debug: false,
          transfered: false,
          bound: false,
          capturePath: '',
          addTime: new Date()
        }
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // this.formItems_.id = parseInt(Math.random() * 100) + 1024 // mock a id
            // createArticle(this.formItems_).then(() => {
            //   this.list.unshift(this.formItems_)
            //   this.dialogFormVisible = false
            //   this.$notify({
            //     title: '成功',
            //     message: '创建成功',
            //     type: 'success',
            //     duration: 2000
            //   })
            // })
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.formItems_)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            // updateArticle(tempData).then(() => {
            //   for (const v of this.list) {
            //     if (v.id === this.formItems_.id) {
            //       const index = this.list.indexOf(v)
            //       this.list.splice(index, 1, this.formItems_)
            //       break
            //     }
            //   }
            //   this.dialogFormVisible = false
            //   this.$notify({
            //     title: '成功',
            //     message: '更新成功',
            //     type: 'success',
            //     duration: 2000
            //   })
            // })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>