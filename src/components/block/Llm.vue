<template>
  <div v-if="data" class="root">
    <div class="header">
      <div class="icon">
        <SvgIcon :name="data.icon" style="font-size: 22px" />
      </div>
      <div class="title">{{ data.title }}</div>
    </div>
    <div class="description">
      {{ data.description }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, inject, ref } from "vue";

const props = defineProps({
  node: {
    type: Object,
    default: null,
  },
});
const data = ref(undefined);
onMounted(() => {
  if (!props.node) {
    const getNode = inject("getNode");
    const node = getNode();
    data.value = node.data;
    node.on("change:data", ({ current }) => {
      data.value = current;
    });
  } else {
    data.value = props.node.data;
  }
});
</script>

<style lang="less" scoped>
.root {
  width: 100%;
  max-width: 130px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vt-primary-color);
  .header {
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
}
</style>
