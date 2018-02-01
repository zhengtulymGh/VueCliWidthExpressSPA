/**
 *
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2017-12-27 17:10:40
 * @version $Id$
 */

// import { deepClone } from '@/utils'
// import { validateCommaSeparator } from '@/utils/validate'

export default {
  props: {
    visible: Boolean,
    formItems: Object
  },
  data() {
    // const requireValidator = (rule, value, callback) => {
    //   if (value === '') {
    //     this.$message({
    //       message: `${rule.field} 是必须的`,
    //       type: 'error'
    //     })
    //     callback(null)
    //   } else {
    //     callback()
    //   }
    // }

    // const commaSeparatorValidator = (rule, value, callback) => {
    //   if (validateCommaSeparator(value)) {
    //     this.$message({
    //       message: `多个 ${rule.field} 必须以 ',' 分隔`,
    //       type: 'error'
    //     })
    //     callback(null)
    //   } else {
    //     callback()
    //   }
    // }

    return {
      visible_: this.visible,
      loading: false,
      style: {
        labelWidth: '120px'
      },
      formItems_: {},
      statusOptions: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  watch: {
    visible(value) {
      console.log('visible changed>>>')
      this.visible_ = value
      if (value) {
        if (this.formItems) {
          for (const key in this.formItems) {
            this.$set(this.formItems_, key, this.formItems[key].value)
          }
        } else {
          this.initdata()
        }
      }
      console.log('<<<visible changed')
    },
    visible_(value) {
      this.$nextTick(() => {
        this.$refs['dataForm'] && this.$refs['dataForm'].clearValidate()
      })
      this.$emit('update:visible', value)
    }
  },
  computed: {
    status() {
      return this.formItems ? 'update' : 'create'
    },
    title() {
      const idStr = this.formItems_.id ? ` ID: ${this.formItems_.id}` : ''
      return `${this.statusOptions[this.status]} ${this.formTag}${(this.formItems || this.cid) ? idStr : ''}`
    }
  },
  methods: {
    submit(type, id) {
      this.$emit('submit', type, id)
    },
    getRequireValidateObj(label) {
      return {
        required: true,
        message: `${label} 不能为空`,
        trigger: 'blur'
      }
    },
    getCommaSeparatorValidateObj(label, charType) {
      return {
        pattern: /^(?![,])\S+(,(?![,])\S+)*$/,
        message: `多个 ${label} 必须且只能以 ',' 分隔`,
        trigger: 'blur'
      }
    },
    validateMultiSelect(rule, value, callback) {
      console.log(rule)
      console.log(value)
      if (value.length === 0) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    // ,
    // dValidator(rule, value, callback) {
    //   const reg = new RegExp(`^\\${mark}$`)
    //   valuesArr = value.split(',').filter((v) => {
    //     return v !== ''
    //   })
    //   if (valuesArr.every((v) => {
    //     /^\d+$/
    //   })) {
    //     callback();
    //   } else {
    //     callback(new Error(`{rule.field} 必须为数字`));
    //   }
    // }
  }
}
