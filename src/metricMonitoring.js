import { onTTFB, onFCP, onLCP, onINP, onCLS } from 'web-vitals'

// 性能监控指标采集
function sendToAnalytics(metric) {
  // const body = JSON.stringify({
  //   name: metric.name,
  //   value: metric.value,
  //   id: metric.id

  //   // Include additional data as needed...
  // })
  // 支持页面卸载时发送请求的浏览器API
  // navigator.sendBeacon('http://xxx.analytics', body)
  console.log(metric)
}
onTTFB(sendToAnalytics)
onFCP(sendToAnalytics)
onLCP(sendToAnalytics)
onINP(sendToAnalytics)
onCLS(sendToAnalytics)
