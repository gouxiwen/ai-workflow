import ClientMonitor from 'skywalking-client-js'
import packageJson from '../package.json'

// Report collected data to `http:// + window.location.host + /browser/perfData` in default
const collector = `${window.location.origin}/sw-collect`
const service = `${import.meta.env.VITE_SERVICE_GROUP_ID}::${packageJson.name}`
const serviceVersion = packageJson.version
const pagePath = window.location.origin + window.location.pathname

const setupSkywalkingReport = (app) => {
  if (import.meta.env.DEV) return
  ClientMonitor.register({
    collector,
    service,
    serviceVersion,
    pagePath,
    // traceTimeInterval: 10000,
    // enableSPA: true, // 启用单页面应用自动上报,该配置在1.0.1版本无效,但是启用后会阻止自动上报性能数据
    autoTracePerf: false // 禁用自动上报性能数据
    // useWebVitals: true, // skywalking-client-js1.0+支持且服务端需要10或者10.2+支持
    // useFmp: true, // 废弃,使用useWebVitals代替
  })
  // vue框架
  app.config.errorHandler = (error) => {
    ClientMonitor.reportFrameErrors(
      {
        collector,
        service,
        pagePath: window.location.href, // 页面路径,包括hash
        serviceVersion
      },
      error
    )
  }
}

// 手动上报单页面路由性能数据
export function setPerformance() {
  if (import.meta.env.DEV) return
  ClientMonitor.setPerformance({
    collector,
    service,
    serviceVersion,
    pagePath: window.location.href,
    // useWebVitals: true // 服务端10.3.0有bug
    useFmp: true
  })
}
export default setupSkywalkingReport
