<template>
  <el-dialog :title="title" :visible.sync="visible_" class="stream-edit-modal" element-loading-target=".stream-edit-modal" v-loading="loading" element-loading-text="Loading">
    <el-form :rules="rules" ref="dataForm" :model="formItems_" :label-width="style.labelWidth" label-position="left">
      <el-form-item v-if="status === 'update'" label="ID">
        <el-input v-model="formItems_.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="厂商编号" prop="number">
        <el-input v-model="formItems_.number"></el-input>
      </el-form-item>
      <el-form-item label="厂商名称" prop="name">
        <el-input v-model="formItems_.name"></el-input>
      </el-form-item>
      <el-form-item label="厂商类型">
        <el-select class="filter-item" v-model="formItems_.type" placeholder="请选择">
          <el-option v-for="option in manufacturerTypeOptions" :key="option.value" :label="option.text" :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="status === 'update'" label="序列号总数">
        <el-input v-model="formItems_.serialCount" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="status === 'update'" label="激活数量">
        <el-input v-model="formItems_.activeCount" disabled></el-input>
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
    props: {
      cid: Number,
      batch: Boolean
    },
    data() {
      return {
        formTag: '厂商',
        manufacturerTypeOptions: [
          {
            text: '摄像头厂商',
            value: 1
          }, {
            text: 'NVR厂商',
            value: 2
          }
        ],
        rules: {
          number: [{ required: true, pattern: /^\d+$/, message: `厂商编号 是必须的，必须是整数`, trigger: 'blur' }],
          name: [{ required: true, message: `厂商名称 是必须的`, trigger: 'blur' }]
        }
      }
    },
    computed: {
      status() {
        return this.formItems ? 'update' : 'create'
      }
    },
    methods: {
      initdata() {
        this.formItems_ = {
          id: '',
          number: '',
          name: '',
          type: this.manufacturerTypeOptions[0].value,
          serialCount: '',
          activeCount: ''
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

<style lang="" scoped></style>