import ApiService from 'src/api/apiService'

const resource = '/hello'

export default {
  greeting () {
    return ApiService.get(resource + '')
  }
}
