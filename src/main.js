import LqVFile from  './components/LqVFile'
import LqSingleUploadFile from  './components/LqSingleUploadFile'
import LqVFileUpload from  './components/LqVFileUpload'

export default {
  // The install method will be called with the Vue constructor as
  // the first argument, along with possible options
  install (Vue) {
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
  upload: function (value, rules,  id, values, options) {
    // console.log('Value', value)
    if (value && value.file) {
      
      return ['Please First, upload the file.[::upload::]']
    }
  }
}