import LqVFile from  './components/LqVFile'
import LqSingleUploadFile from  './components/LqSingleUploadFile'
import LqVFileUpload from  './components/LqVFileUpload'
import { lqFileOptions } from './defaultOptions'

export default {
  // The install method will be called with the Vue constructor as
  // the first argument, along with possible options
  install (Vue, options = {}) {
    lqFileOptions.merge(options)
    Vue.component('lq-v-file', LqVFile)
    Vue.component('lq-single-upload-file', LqSingleUploadFile)
    Vue.component('lq-v-file-upload', LqVFileUpload)
  }
}

/**
 * Upload validation rule
 */

window.validatejs.validators = {
  ...window.validatejs.validators,
  upload: function (value, rules) {
    let message = typeof rules === 'object' && rules.message ? rules.message : 'Upload the file.'
    if (value && value.file) {
      return [message + '[::upload::]']
    }
  }
}