<template>
  <XForm labelWidth="100px"> <XField label="字段名称"></XField></XForm>
  <h1>标题</h1>
</template>
<script lang="ts">
  // @ts-nocheck
  import { defineComponent, reactive } from 'vue';
  import { XForm, XField } from '@vtj/ui';
  import { useProvider } from '@vtj/renderer';
  export default defineComponent({
    name: 'Test',
    components: { XForm, XField },
    setup(props) {
      const provider = useProvider({ id: '1clnqsre', version: '1763092042634' });
      const state = reactive({});
      return { state, props, provider };
    }
  })
</script>
<style lang="css" scoped>
  /* 组件样式内容 */
</style>
