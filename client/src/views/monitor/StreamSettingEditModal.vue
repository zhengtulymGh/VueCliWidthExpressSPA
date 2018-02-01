<template>
  <el-dialog :title="title" :visible.sync="visible_" class="stream-edit-modal" element-loading-target=".stream-edit-modal" v-loading="loading" element-loading-text="Loading">
    <el-form :rules="rules" ref="dataForm" :model="formItems_" :label-width="style.labelWidth" label-position="left">
      <el-form-item v-if="status === 'update'" label="ID">
        <el-input v-model="formItems_.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="所属摄像头ID" prop="cid">
        <el-input v-model="formItems_.cid" :disabled="!!cid"></el-input>
      </el-form-item>
      <el-form-item label="是否推流">
        <template>
          <el-radio v-model="formItems_.pushedFlow" :label="true">已推流</el-radio>
          <el-radio v-model="formItems_.pushedFlow" :label="false">未推流</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="在线时长">
        <el-input v-model="formItems_.onlineTime"></el-input>
      </el-form-item>
      <el-form-item label="接收人电话">
        <el-input v-model="formItems_.tel"></el-input>
      </el-form-item>
      <el-form-item label="自动检测">
        <el-switch
          v-model="formItems_.autoCheck"
          active-text="开启"
          inactive-text="关闭">
        </el-switch>
      </el-form-item>
      <el-form-item label="更新时间">
        <el-date-picker v-model="formItems_.updatedTime" disabled type="datetime" placeholder="选择日期时间">
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
    props: {
      cid: Number
    },
    data() {
      return {
        formTag: '监控流',
        rules: {
          cid: [{ required: true, message: 'cid is required', trigger: 'blur' }]
        }
      }
    },
    computed: {
      status() {
        return (this.formItems || this.cid) ? 'update' : 'create'
      }
    },
    methods: {
      initdata() {
        if (this.cid) {
          this.getStream()
          return
        }
        this.formItems_ = {
          id: '',
          cid: '',
          area: this.areaOptions[0].value,
          videoType: this.videoTypeOptions[0].value,
          liveUrlIn: '',
          liveUrlOut: '',
          replayUrlIn: '',
          replayUrlOut: '',
          status: false,
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
      },
      getStream() {
        this.loading = true
        this.$api.getStream(this.cid).then(res => {
          console.log(res)
          this.formItems_ = {
            id: res.data.id,
            cid: res.data.cid,
            area: res.data.area,
            videoType: res.data.videoType,
            liveUrlIn: res.data.liveUrlIn,
            liveUrlOut: res.data.liveUrlOut,
            replayUrlIn: res.data.replayUrlIn,
            replayUrlOut: res.data.replayUrlOut,
            status: res.data.status,
            addTime: res.data.addTime
          }
          this.loading = false
        }).catch((error) => {
          console.log(error)
          this.initdata()
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="" scoped></style>