import LqVFile from  './components/LqVFile'

export default {
  // The install method will be called with the Vue constructor as
  // the first argument, along with possible options
  install (Vue, options) {
    Vue.component('lq-v-file', LqVFile)
  }
}