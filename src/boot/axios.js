import ApiService from 'src/api/apiService'

export default ({ Vue, router }) => {
  ApiService.init(router)
}
