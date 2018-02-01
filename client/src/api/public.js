/**
 *
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2018-01-05 10:00:00
 * @version $Id$
 */

import axios from 'axios'
import { upload } from '@/utils/request'

export default {
  async uploadCsv(formData) {
    return await upload({
      url: '/api/paas_s/upload/csv',
      params: formData
    })
  }
}
