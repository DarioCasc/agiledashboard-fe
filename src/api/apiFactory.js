import helloService from 'src/api/helloService'

const services = {
  hello: helloService
}

export const ApiFactory = {
  get: name => services[name]
}
