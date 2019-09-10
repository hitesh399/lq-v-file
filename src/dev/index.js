import Vue from 'vue'
import App from './App'
import Boilerplate from './Boilerplate'
import vuetify from 'vuetify'
// import '@mdi/font/css/materialdesignicons.css'
import lqForm from 'lq-form'
import store from '../store'
import './axios'
import VueCroppie from 'vue-croppie'
import 'croppie/croppie.css' // import the croppie css manually
import lqFile from '../main'
import 'vuetify/dist/vuetify.min.css'
import 'font-awesome/css/font-awesome.min.css'
// import '../../node_modules/@mdi/font/css/materialdesignicons.css'
// import validatejs from 'validate.js';

import helper from 'vuejs-object-helper'
Object.defineProperty(Vue.prototype, '$helper',   {value: helper});
Vue.use(VueCroppie)
Vue.use(lqFile)


Vue.use(lqForm, { store })

Vue.config.performance = true

Vue.use(vuetify)
Vue.component(Boilerplate.name, Boilerplate)

const vm = new Vue({
  data: () => ({ isLoaded: document.readyState === 'complete' }),
  store,
  render (h) {
    return this.isLoaded ? h(App) : undefined
  },
}).$mount('#app')

// Prevent layout jump while waiting for styles
vm.isLoaded || window.addEventListener('load', () => {
  vm.isLoaded = true
})
