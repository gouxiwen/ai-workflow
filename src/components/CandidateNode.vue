<!-- 监听addblcok添加事件，跟随鼠标移动 -->
<template>
  <div
    v-if="candidateNode"
    class="candidate-node"
    :style="{
      left: mousePosition.elementX + 'px',
      top: mousePosition.elementY + 'px',
    }"
    @click.prevent="handleAddNode"
    @contextmenu.prevent="handleContextMenu"
  >
    <component :is="componentsMap[candidateNode.type]" :node="candidateNode" />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useWorkflowStore } from "@/stores/workflow";
import Llm from "./block/Llm.vue";

const componentsMap = {
  llm: Llm,
};
const workflowStore = useWorkflowStore();
const { mousePosition, candidateNode } = storeToRefs(useWorkflowStore());
const handleAddNode = () => {
  const newNode = candidateNode.value;
  workflowStore.setNode(newNode);
  workflowStore.setCandidateNode(undefined);
};
const handleContextMenu = () => {
  workflowStore.setCandidateNode(undefined);
};
</script>

<style lang="less" scoped>
.candidate-node {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
