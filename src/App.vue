<template>
  <div ref="rootRef" class="root">
    <ProcessGraph ref="processGraphRef" @node-click="handleNodeClick" />
    <TeleportContainer />
    <CandidateNode />
    <AddBlock />
    <BaseModal
      v-model:open="open"
      :showFooter="false"
      :modal-props="{
        title: currentNode?.data?.title,
      }"
      @onCancel="currentNode = null"
    >
      <template #body>
        {{ currentNode?.data?.description }}
        <div class="edit-wrap">
          <Editor ref="editor" :options="options" />
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref, useTemplateRef, watch } from "vue";
import { useMouse } from "@vueuse/core";
import Editor from "./components/MonacoEditor.vue";
import ProcessGraph from "./components/ProcessGraph.vue";
import { getTeleport } from "@antv/x6-vue-shape";
import AddBlock from "./components/AddBlock.vue";
import CandidateNode from "./components/CandidateNode.vue";
import { useWorkflowStore } from "./stores/workflow";
import BaseModal from "./components/BaseModal.vue";

const options = {
  language: "javascript",
  value: "'Hello World'",
};
// const editor = ref(null);
// const setValue = () => {
//   editor.value?.setValue("console.log(456)");
// };
// const getValue = () => {
//   console.log(editor.value?.getValue());
// };

const TeleportContainer = getTeleport();
const processGraphRef = useTemplateRef("processGraphRef");
const rootRef = useTemplateRef("rootRef");
const open = ref(false);
const currentNode = ref(null);
const handleNodeClick = (node) => {
  console.log(node);
  currentNode.value = node;
  open.value = true;
};

const mouseDefault = reactive(useMouse({ touch: false }));
const workflowStore = useWorkflowStore();
watch(
  () => mouseDefault,
  (val) => {
    if (val) {
      const containerClientRect = rootRef.value?.getBoundingClientRect();
      workflowStore.setMousePosition({
        pageX: val.x,
        pageY: val.y,
        elementX: val.x - containerClientRect.left,
        elementY: val.y - containerClientRect.top,
      });
    }
  },
  { deep: true }
);
</script>

<style scoped lang="less">
.root {
  width: 100%;
  height: 100vh;
}
</style>
<style>
.edit-wrap {
  width: 300px;
  height: 300px;
}
</style>
