<template>
  <div class="container">
    <!-- <div v-if="type !== 'view'" ref="graph-stencil" class="graph-stencil"></div> -->
    <div ref="graph-container" class="graph-container"></div>
    <!-- <TeleportContainer />放到App.vue解决重复注册问题 -->
  </div>
</template>

<script setup>
import { onMounted, useTemplateRef, watch } from "vue";
import { storeToRefs } from "pinia";
import { Graph, Shape } from "@antv/x6";
// import { Stencil } from "@antv/x6-plugin-stencil"; // 模板
// import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from "@antv/x6-plugin-selection";
import { Snapline } from "@antv/x6-plugin-snapline"; // 对齐线
import { Keyboard } from "@antv/x6-plugin-keyboard";
// import { Clipboard } from '@antv/x6-plugin-clipboard'
// import { History } from '@antv/x6-plugin-history'
import {
  register as registerVueNode /* , getTeleport */,
} from "@antv/x6-vue-shape";
import Llm from "./block/Llm.vue";
import { useWorkflowStore } from "@/stores/workflow";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["nodeClick"]);

const workflowStore = useWorkflowStore();
const { mousePosition } = storeToRefs(useWorkflowStore());
// graph
const graphContainer = useTemplateRef("graph-container");
// const graphStencil = useTemplateRef("graph-stencil");
let graph;
const init = () => {
  // #region 初始化画布
  graph = new Graph({
    container: graphContainer.value,
    interacting: true,
    // grid: true,
    background: {
      color: "var(--vt-white)",
    },
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      // modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 3,
    },
    panning: {
      enabled: true,
      modifiers: [],
      eventTypes: ["leftMouseDown"],
    },
    connecting: {
      router: "manhattan",
      connector: {
        name: "rounded",
        args: {
          radius: 8,
        },
      },
      anchor: "center",
      connectionPoint: "anchor",
      allowBlank: false,
      allowMulti: false,
      allowLoop: false,
      allowEdge: false,
      allowNode: false,
      snap: {
        radius: 20,
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: "var(--vt-border)",
              strokeDasharray: "5 5",
              style: {
                animation: "running-line 30s infinite linear",
              },
              strokeWidth: 1,
              targetMarker: {
                name: "block",
                width: 8,
                height: 6,
              },
            },
          },
          zIndex: 0,
        });
      },
      // validateMagnet({ cell, magnet }) {
      //   console.log(cell, magnet);
      //   return true;
      // },
      // validateConnection({ targetMagnet }) {
      //   return !!targetMagnet;
      // },
    },
    highlighting: {
      magnetAdsorbed: {
        name: "stroke",
        args: {
          attrs: {
            fill: "var(--vt-primary-color)",
            stroke: "var(--vt-primary-color)",
          },
        },
      },
    },
  });
  // #endregion

  // #region 使用插件
  graph
    // .use(
    //   new Transform({
    //     resizing: true,
    //     rotating: true,
    //   }),
    // )
    .use(
      new Selection({
        rubberband: true,
        // showNodeSelectionBox: true,
        showEdgeSelectionBox: true,
        eventTypes: ["mouseWheelDown"],
      })
    )
    .use(new Snapline())
    .use(new Keyboard());
  // .use(new Clipboard())
  // .use(new History())
  // #endregion

  // #region 初始化图形
  // 自定义连接桩
  const customPorts = {
    groups: {
      top: {
        position: "top",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
      right: {
        position: "right",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
      bottom: {
        position: "bottom",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
      left: {
        position: "left",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
    },
    items: [
      {
        group: "top",
      },
      {
        group: "right",
      },
      {
        group: "bottom",
      },
      {
        group: "left",
      },
    ],
  };

  registerVueNode({
    shape: "custom-llm",
    width: 130,
    height: 72,
    x: 0,
    y: 0,
    component: Llm,
    ports: true ? { ...customPorts } : null,
  });

  // delete
  graph.bindKey(["backspace", "delete"], () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      console.log(cells);
      const hasNode = cells.find((cell) => cell.isNode());
      if (hasNode) return;
      graph.removeCells(cells);
    }
  });

  // 控制连接桩显示/隐藏
  const showPorts = (ports, show) => {
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = show ? "visible" : "hidden";
    }
  };
  graph.on("node:mouseenter", () => {
    const ports = graphContainer.value?.querySelectorAll(".x6-port-body");
    showPorts(ports, true);
  });
  graph.on("node:mouseleave", () => {
    const ports = graphContainer.value?.querySelectorAll(".x6-port-body");
    showPorts(ports, false);
  });
  graph.on("node:click", ({ node, view }) => {
    emit("nodeClick", node, view);
  });
  // graph.on("node:added", ({ cell /* index, options */ }) => {
  //   cell.prop("data", {
  //     isNewNode: true,
  //   });
  // });
  // #endregion
};
watch(
  () => workflowStore.newNode,
  (val) => {
    if (val) {
      const { type, data } = val;
      graph.addNode({
        shape: `custom-${type}`,
        x: mousePosition.value.elementX,
        y: mousePosition.value.elementY,
        data,
      });
      workflowStore.setNode(null);
    }
  }
);
onMounted(() => {
  init();
});
defineExpose({
  getData: () => {
    return graph.toJSON();
  },
  setData: (data) => {
    graph.fromJSON(data);
  },
  getGraph: () => {
    return graph;
  },
});
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  .graph-stencil {
    width: 185px;
    flex-shrink: 0;
    height: 100%;
    position: relative;
    border-right: 1px solid #dfe1e6;
    :deep(.x6-widget-stencil) {
      background: var(--vt-white);
      .x6-widget-stencil-title {
        background: var(--vt-white);
      }
    }
  }
  .graph-container {
    flex-grow: 1;
    height: 100% !important;
    :deep(.x6-widget-selection-box) {
      border-color: var(--vt-primary-color);
    }
  }
  .graph-container-view {
    :deep(.x6-port-body) {
      visibility: hidden !important;
    }
  }
}
</style>
<style>
@keyframes running-line {
  to {
    stroke-dashoffset: -1000;
  }
}
</style>
