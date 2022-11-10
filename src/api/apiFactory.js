import agileDashboardService from 'src/api/agileDashboardService'

const services = {
  agileDashboard: agileDashboardService
}

export const ApiFactory = {
  get: name => services[name]
}
