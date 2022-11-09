import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { API_BASE_URL } from './config'
import { Loading, Notify } from 'quasar'

const app = createApp()
let vuerouter

const errorInterceptor = async (error) => {
  Loading.hide()
  switch (error.response.status) {
    case 400:
      Notify.create({
        type: 'negative',
        message: error.response.data.message
      })
      break

    case 401:
      if (error.response.config.url === '/login') {
        Notify.create({
          type: 'negative',
          message: error.response.data.message
        })
      } else {
        vuerouter.push('/login')
      }
      break

    case 503:
      vuerouter.push('/login')
      break

    default:
      Notify.create({
        type: 'negative',
        message: error.response.data.message,
        html: true
      })
  }
  return Promise.reject(error)
}

const responseInterceptor = response => {
  switch (response.status) {
    case 200:
      if (response.data.message) {
        Notify.create({
          type: 'positive',
          message: response.data.message
        })
      }
      break
  }
  return response
}

const ApiService = {
  init (router) {
    vuerouter = router
    app.use(VueAxios, axios)
    app.axios.defaults.baseURL = API_BASE_URL
    app.axios.defaults.headers.common = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    app.axios.interceptors.response.use(responseInterceptor, errorInterceptor)
  },

  get (resource) {
    return app.axios.get(`${resource}`)
  },

  post (resource, body) {
    return app.axios.post(`${resource}`, body)
  },

  postEncoded (resource, body) {
    return app.axios.post(`${resource}`,
      new URLSearchParams(body), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
  },

  update (resource, params) {
    return app.axios.put(`${resource}`, params)
  },

  delete (resource, body) {
    return axios.delete(resource, body)
  }
}

export default ApiService
