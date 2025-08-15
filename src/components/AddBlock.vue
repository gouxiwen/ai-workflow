<template>
  <div class="add-block-root">
    <a-popover v-model:open="visible" trigger="click" placement="right">
      <template #content>
        <div
          class="add-block-content"
          v-for="block in blockList"
          :key="block.name"
          @click="handleAddBlock(block)"
        >
          <div class="icon">
            <SvgIcon :name="block.icon" style="font-size: 22px" />
          </div>
          <div class="title">{{ block.title }}</div>
        </div>
      </template>
      <PlusCircleOutlined />
    </a-popover>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { PlusCircleOutlined } from "@ant-design/icons-vue";
import { useWorkflowStore } from "@/stores/workflow";

const workflowStore = useWorkflowStore();
const visible = ref(false);
const blockList = [
  { title: "LLM", type: "llm", icon: "llm", description: "大语言模型" },
];
const handleAddBlock = (block) => {
  const newNode = {
    type: block.type,
    data: {
      type: block.type,
      title: block.title,
      description: block.description,
      icon: block.icon,
      _isCandidate: true,
    },
    position: {
      x: 0,
      y: 0,
    },
  };
  workflowStore.setCandidateNode(newNode);
  visible.value = false;
};
</script>

<style lang="less" scoped>
.add-block-root {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
<style>
.add-block-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  .icon {
    width: 30px;
    flex-shrink: 0;
  }
  .title {
    flex-grow: 1;
  }
}
</style>
