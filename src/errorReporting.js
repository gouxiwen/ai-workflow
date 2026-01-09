import TraceKit from "tracekit";
import packageJson from "../package.json";

const protcol = window.location.protocol;
const service = packageJson.name;
const serviceVersion = packageJson.version;

// 用于订阅错误报告的通知或事件
TraceKit.report.subscribe((error) => {
  const { message, stack = [] } = error || {};
  const obj = {
    message,
    stack: {
      column: stack[0]?.column,
      line: stack[0]?.line,
      func: stack[0]?.func,
      url: stack[0]?.url,
    },
  };
  const params = {
    error: obj,
    data: {
      errTime: new Date().toLocaleString(),
      user: "游客",
      service,
      serviceVersion,
      pageUrl: window.location.href,
      //   isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent), // 是否移动端
      //   isWechat: /MicroMessenger/i.test(navigator.userAgent), // 是否微信浏览器
      //   isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, // 两个都是false就是未知设备
      //   isAndroid: /Android/.test(navigator.userAgent) && !/Windows Phone/.test(navigator.userAgent)
    },
    browserInfo: {
      userAgent: navigator.userAgent,
      protcol,
    },
  };
  console.log("错误上报", params);
  // http.post(service, params).then(() => {
  //   console.log('错误上报成功')
  // }).catch(() => {
  //   console.log('错误上报失败')
  // })
});

// window.onerror和window.addEventListener，对Promise报错都是无法捕获
// 图片、同步、网络、try catch（不写catch会不会抛）、try catch 不能捕获异步,同时阻塞js
window.addEventListener(
  "error",
  (args) => {
    // 只记录资源加载错误
    const err = args.target.src || args.target.href;
    if (!err) {
      return true;
    }
    console.log("windowArgs", err, args);
    const obj = new Error(`加载异常:${err}`);
    return TraceKit.report(obj, "reportWindowError");
  },
  { capture: true }
);

// Promise、async/await报错
window.addEventListener(
  "unhandledrejection",
  (error) => {
    console.log("unhandledrejection", error);
    TraceKit.report(error.reason, "reportPromiseError");
  },
  { capture: true }
);

const setupErrorReport = (app) => {
  // vue框架
  app.config.errorHandler = (err, vm, info) => {
    console.log("Error: ", err); // 错误对象，包含错误消息、堆栈信息等
    console.log("vm", vm); // 引发错误的vue组件实例，可以获取组件的状态、数据和方法
    console.log("info: ", info); // 错误的额外信息，描述错误发生的位置或上下文
    TraceKit.report(err, "reportVueError");
  };
  // 至此，js中同步、异步、资源加载、Promise、async/await都有相对应的捕获方式
};
export default setupErrorReport;
