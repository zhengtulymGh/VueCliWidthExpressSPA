/**
 *
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2017-12-27 17:02:40
 * @version $Id$
 */

import { parseTime } from '@/utils'
export default {
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      pageSizes: [10, 20, 30, 50],
      modal: {
        base: {
          visible: false,
          data: null
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSubmit(type) {
      switch (type) {
        case 'created':
          this.handleCreated()
          break
        case 'updated':
          this.handleUpdated()
          break
        case 'deleted':
          this.handleDeleted()
          break
      }
    },
    handleCreate() {
      // let index = -1
      // if (arguments.length === 1) {
      //   index = arguments[0]
      // } else {
      //   index = arguments[0][0]
      // }
      console.log(arguments)
      const cb = arguments[1]
      this.modal.base.data = null
      this.modal.base.visible = true
      cb && cb()
    },
    handleCreated() {
      this.modal.base.data = null
      this.modal.base.visible = false
      this.getList()
    },
    handleUpdate() {
      let index = -1
      if (arguments.length === 1) {
        index = arguments[0]
      } else {
        index = arguments[0][0]
      }
      const cb = arguments[1]
      this.modal.base.data = this.list[index]
      this.modal.base.visible = true
      cb && cb()
    },
    handleUpdated() {
      this.modal.base.data = null
      this.modal.base.visible = false
      this.getList()
    },
    handleDelete(index) {

    },
    handleDeleted() {

    },
    handleDownload() {
      // require.ensure([], () => {
      //   const { export_json_to_excel } = require('@/vendor/Export2Excel')
      //   const tHeader = ['时间', '地区', '类型', '标题', '重要性']
      //   const filterVal = ['timestamp', 'province', 'type', 'title', 'importance']
      //   const data = this.formatJson(filterVal, this.list)
      //   export_json_to_excel(tHeader, data, 'table数据')
      // })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
