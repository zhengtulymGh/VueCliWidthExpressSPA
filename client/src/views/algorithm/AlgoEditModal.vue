<template>
  <el-dialog :title="title" :visible.sync="visible_" class="stream-edit-modal" element-loading-target=".stream-edit-modal" v-loading="loading" element-loading-text="Loading">
    <el-form :rules="rules" ref="dataForm" :model="formItems_" :label-width="style.labelWidth" label-position="left">
      <el-form-item v-if="status === 'update'" label="ID">
        <el-input v-model="formItems_.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="摄像头ID" prop="cid">
        <el-input v-model="formItems_.cid" :disabled="!!cid"></el-input>
      </el-form-item>
      <el-form-item label="所属地区">
        <el-select class="filter-item" v-model="formItems_.area" placeholder="请选择">
          <el-option v-for="option in areaOptions" :key="option.value" :label="option.text" :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="视频类型">
        <el-select class="filter-item" v-model="formItems_.videoType" placeholder="请选择">
          <el-option v-for="option in videoTypeOptions" :key="option.value" :label="option.text" :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="直播内网地址">
        <el-input v-model="formItems_.liveUrlIn"></el-input>
      </el-form-item>
      <el-form-item label="直播外网地址">
        <el-input v-model="formItems_.liveUrlOut"></el-input>
      </el-form-item>
      <el-form-item label="录播内网地址">
        <el-input v-model="formItems_.replayUrlIn"></el-input>
      </el-form-item>
      <el-form-item label="录播外网地址">
        <el-input v-model="formItems_.replayUrlOut"></el-input>
      </el-form-item>
      <el-form-item label="status">
        <el-switch
          v-model="formItems_.status"
          active-text="on"
          inactive-text="off">
        </el-switch>
      </el-form-item>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="formItems_.addTime" disabled type="datetime" placeholder="选择日期时间">
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
        formTag: '流',
        areaOptions: [
          {
            text: 'Oss-cn-hangzhou',
            value: 1
          },
          {
            text: 'oss-cn-shanghai',
            value: 2
          },
          {
            text: 'oss-cn-qingdao',
            value: 3
          },
          {
            text: 'oss-cn-beijing',
            value: 4
          }
        ],
        videoTypeOptions: [
          {
            text: 'flv',
            value: 1
          }, {
            text: 'hls',
            value: 2
          }
        ]
      }
    },
    computed: {
      status() {
        return (this.formItems || this.cid) ? 'update' : 'create'
      },
      rules() {
        const rules = {
          cid: []
        }
        rules.cid.push(this.getRequireValidateObj('摄像头ID'))
        return rules
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
          pushFlow: false,
          onlineTime: '',
          autoCheck: false,
          tel: '',
          updatedTime: new Date()
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