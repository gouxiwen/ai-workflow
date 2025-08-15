import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import "virtual:svg-icons-register"; // eslint-disable-line
import SvgIcon from "@/components/Svglcon.vue";
import { setupStore } from "./stores";
import "ant-design-vue/dist/reset.css";
import "./assets/styles/main.css";

const app = createApp(App);
app.config.productionTip = false;
setupStore(app);
app.component("SvgIcon", SvgIcon);
app.use(Antd);

app.mount("#app");
