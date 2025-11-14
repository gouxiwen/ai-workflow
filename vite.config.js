import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import monacoEditorPlugin from "vite-plugin-monaco-editor-esm";

// 导入VTJ开发工具
import { createDevTools } from "@vtj/pro/vite";

// import MonacoEditorNlsPlugin, {
//   esbuildPluginMonacoEditorNls,
//   Languages,
// } from "vite-plugin-monaco-editor-nls";

// 新版本中vite-plugin-monaco-editor-nls不能用，自己实现一个插件
import MonacoEditorNlsPlugin, {
  Languages,
  esbuildPluginMonacoEditorNls,
} from "./nls";
// 从官方获取语言包
// https://github.com/microsoft/vscode-loc/blob/v1.98.2025022817/i18n/vscode-language-pack-zh-hans/translations/main.i18n.json
import zh_hans from "./nls/zh-hans.json";

// 注意只在生产环境下添加rollup插件，开发模式下会报错
const plugins = [];
if (process.env.NODE_ENV !== "development") {
  plugins.push(
    MonacoEditorNlsPlugin({
      locale: Languages.zh_hans,
      localeData: zh_hans,
    })
  );
} else {
  plugins.push(
    // 添加VTJ开发工具插件
    createDevTools()
  );
}

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        /** vite 版本需要大于等于2.3.0 */
        esbuildPluginMonacoEditorNls({
          locale: Languages.zh_hans,
          /**
           * The weight of `localedata` is higher than that of `locale`
           */
          localeData: zh_hans,
        }),
      ],
    },
  },
  plugins: [
    vue(),
    monacoEditorPlugin(),
    createSvgIconsPlugin({
      // 这个是自己配置的图标路径
      iconDirs: [resolve(process.cwd(), "src/assets/svg")],
      // 这个表示id，按这个来就对了
      symbolId: "icon-[name]",
    }),
    ...plugins,
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
