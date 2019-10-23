import Vue from 'vue'
import axios from 'axios'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || ''
axios.defaults.headers.common['client-id'] = 'eyJpdiI6ImdiOEZMR0FKTEF6ZTJQYXFIY2NSdnc9PSIsInZhbHVlIjoiaTdnN0traXRuM2QyMTFJVWppYkQzUT09IiwibWFjIjoiYjRlNDQxYmVlMGYwZWQ1MzY3YzAxOTkxNDI2NTAwMjVmNjc2YTM5NzliMGQ3YmJmZGEzYjRiZWRhYTY4YzY3ZSJ9';
axios.defaults.headers.common['device-id'] = 'ewjgfrejwghgfr';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

let config = {
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    // timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
    config => {
        // Do something before request is sent
        return config
    },
    error => {
        // Do something with request error
        return Promise.reject(error)
    }
)

// Add a response interceptor
_axios.interceptors.response.use(
    response => {
        // Do something with response data
        return response.data
    },
    error => {
        // Do something with response error
        return Promise.reject(error)
    }
)

Plugin.install = function (Vue, options) {
    Vue.axios = _axios
    window.axios = _axios
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return _axios
            }
        },
        $axios: {
            get() {
                return _axios
            }
        }
    })
}

Vue.use(Plugin)

export default Plugin
