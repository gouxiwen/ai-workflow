import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import "virtual:svg-icons-register"; // eslint-disable-line
import SvgIcon from "@/components/Svglcon.vue";
import { setupStore } from "./stores";
import router, { setupRouter } from "./router";
import ElementPlus from "element-plus"; //引入element-plus库
import VForm3 from "vform3-builds"; //引入VForm3库
import "element-plus/dist/index.css"; //引入element-plus样式
import "vform3-builds/dist/designer.style.css"; //引入VForm3样式
import "vform3-builds/dist/render.style.css"; //引入VForm3样式
import "ant-design-vue/dist/reset.css";
import "./assets/styles/main.css";
import setupErrorReport from "./errorReporting";
import "./metricMonitoring";
// 如果服务端使用setupSkywalking监控错误和性能
// import setupSkywalkingReport from './skywalking'

// 1. 引入VTJ核心功能
import {
  createProvider,
  LocalService,
  createModules,
  BaseService,
} from "@vtj/web";
// 2. 引入组件库样式
import "@vtj/web/src/index.scss";

// 3. 实例化低代码服务
// 注意：LocalService仅适用于开发环境
// 生产环境需实现RemoteService接口
const service = new LocalService();
// 实现自定义服务类
class CustomService extends BaseService {
  // 实现项目初始化请求
  async init(project) {
    // 在这里可以发起请求，从后端获取项目信息
    return {
      ...project,
      name: "项目名称",
    };
  }
  // 在这里实现类的其他方法，
  // 类的其他方法，请看抽象类的定义：https://gitee.com/newgateway/vtj/blob/master/packages/core/src/protocols/service.ts
}

// 4. 创建VTJ提供者实例
const setupProvider = (app) => {
  // 生产环境自定义服务实现复杂，放弃探索
  if (process.env.NODE_ENV === "development") {
    const { provider, onReady } = createProvider({
      // 设置运行环境
      nodeEnv: process.env.NODE_ENV,
      // 注册应用模块
      modules: createModules(),
      // 注入服务实例
      service: process.env.NODE_ENV !== "development" ? CustomService : service,
      // 注入路由实例
      router,
    });
    app.use(provider);
  }
};

const app = createApp(App);
app.config.productionTip = false;
setupStore(app);
setupRouter(app);
app.component("SvgIcon", SvgIcon);
app.use(Antd);
app.use(ElementPlus);
app.use(VForm3);
setupProvider(app);
setupErrorReport(app);
// setupSkywalkingReport(app)

app.mount("#app");
