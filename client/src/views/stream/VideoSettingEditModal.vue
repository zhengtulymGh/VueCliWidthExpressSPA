<template>
  <el-dialog :title="title" :visible.sync="visible_" class="stream-edit-modal" element-loading-target=".stream-edit-modal" v-loading="loading" element-loading-text="Loading">
    <el-form :rules="rules" ref="dataForm" :model="formItems_" :label-width="style.labelWidth" label-position="left">
      <el-form-item v-if="status === 'update'" label="ID">
        <el-input v-model="formItems_.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="所属摄像头ID" prop="cid">
        <el-input v-model="formItems_.cid" :disabled="!!cid" :placeholder="batch ? 'cid必须是整数，多个cid以英文逗号分隔' : ''"></el-input>
      </el-form-item>
      <el-form-item label="录制时间范围">
        <el-time-picker
          is-range
          v-model="formItems_.videoTimes"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="上传时间范围">
        <el-time-picker
          is-range
          v-model="formItems_.uploadTimes"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="生效星期">
        <el-checkbox-group v-model="formItems_.weekDays" size="mini">
          <el-checkbox-button v-for="week in weeks" :label="week.value" :key="week.value">{{week.text}}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="任务状态">
        <el-switch
          v-model="formItems_.status"
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
      cid: Number,
      batch: Boolean
    },
    data() {
      return {
        weeks: [{ text: '周一', value: 1 }, { text: '周二', value: 2 }, { text: '周三', value: 3 }, { text: '周四', value: 4 }, { text: '周五', value: 5 }, { text: '周六', value: 6 }, { text: '周日', value: 7 }],
        statusOptions: {
          batchSet: '批量设置'
        },
        formTag: '录播',
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
        if (this.formItems || this.cid) {
          return 'update'
        }
        return this.batch ? 'batchSet' : 'create'
      },
      rules() {
        return {
          cid: [{ required: true, message: 'cid 是必须的', trigger: 'blur' }, { pattern: this.batch ? /^\s*\d+(,\d+)*\s*$/ : /^\d+$/, message: `cid 必须是整数${this.batch ? '，多个cid以英文逗号分隔' : ''}`, trigger: 'blur' }]
        }
      }
    },
    methods: {
      initdata() {
        if (this.cid) {
          this.getVideoSetting()
          return
        }
        this.formItems_ = {
          id: '',
          cid: '',
          videoTimes: [new Date(2018, 1, 1, 9, 0), new Date(2018, 1, 1, 21, 0)],
          uploadTimes: [new Date(2018, 1, 1, 22, 0), new Date(2018, 1, 2, 8, 0)],
          // videoStartTime: this.videoTimes[0],
          // videoEndTime: this.videoTimes[1],
          // uploadStartTime: '',
          // uploadEndTime: '',
          period: '',
          weekDays: [1, 2, 3, 4, 5, 6, 7],
          status: true,
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
      getVideoSetting() {
        this.loading = true
        this.$api.getVideoSetting(this.cid).then(res => {
          console.log(res)
          this.formItems_ = {
            id: res.data.id,
            cid: res.data.cid,
            videoTimes: res.data.videoTimes,
            uploadTimes: res.data.uploadTimes,
            // videoStartTime: this.videoTimes[0],
            // videoEndTime: this.videoTimes[1],
            // uploadStartTime: '',
            // uploadEndTime: '',
            period: res.data.period,
            weekDays: res.data.weekDays,
            status: res.data.status,
            updatedTime: res.data.updatedTime
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