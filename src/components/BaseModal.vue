<!-- 该组件可以对模态框的样式统一修改，根据UI规范可自行修改 -->
<template>
  <div>
    <a-modal
      v-if="modalType === 'modal'"
      v-model:open="modalOpen"
      v-bind="{ ...defaultProps, ...modalProps, getContainer: undefined }"
      :class="[!showFooter && 'hide-foot']"
      @cancel="handleCancel"
    >
      <slot name="body" />
      <template v-if="showFooter" #footer>
        <div style="text-align: right">
          <template v-if="$slots.footer">
            <slot name="footer" />
          </template>
          <template v-else>
            <a-button v-if="showCancel" @click="handleCustomCancel"
              >取消</a-button
            >
            <a-button
              :loading="modalProps?.confirmLoading"
              :disabled="disabled"
              type="primary"
              @click="handleOk"
              >确定</a-button
            >
          </template>
        </div>
      </template>
    </a-modal>
    <a-drawer
      v-else
      :open="modalOpen"
      class="custom-class"
      placement="right"
      v-bind="{ ...defaultDrawerProps, ...modalProps, getContainer: undefined }"
    >
      <template v-if="showFooter" #footer>
        <div style="text-align: right">
          <template v-if="$slots.footer">
            <slot name="footer" />
          </template>
          <template v-else>
            <a-button v-if="showCancel" @click="handleCustomCancel">
              {{ cancelBtnText }}
            </a-button>
            <a-button
              class="ml8"
              :loading="modalProps?.confirmLoading"
              :disabled="disabled"
              type="primary"
              @click="handleOk"
            >
              {{ confirmBtnText }}
            </a-button>
          </template>
        </div>
      </template>
      <template #extra>
        <a-button
          type="text"
          style="color: rgba(0, 0, 0, 0.45)"
          @click="handleCustomCancel"
          ><CloseOutlined
        /></a-button>
      </template>
      <slot name="body" />
    </a-drawer>
  </div>
</template>

<script setup>
import { CloseOutlined } from "@ant-design/icons-vue";
import { ref, watch } from "vue";

const defaultProps = {
  centered: true,
  destroyOnClose: true,
  maskClosable: false,
  closable: true,
  wrapClassName: "custom-wrap",
};
const defaultDrawerProps = {
  destroyOnClose: true,
  maskClosable: false,
  closable: false,
  width: 500,
  rootClassName: "root-class-name",
};
const props = defineProps({
  modalType: {
    type: String,
    default: "drawer",
  },
  open: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  modalProps: {
    type: Object,
    default: () => ({}),
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  confirmBtnText: {
    type: String,
    default: "确定",
  },
  cancelBtnText: {
    type: String,
    default: "取消",
  },
});

const modalOpen = ref(props.open);
watch(
  () => props.open,
  (v) => {
    modalOpen.value = v;
  }
);

const emit = defineEmits(["onOk", "onCancel", "update:open"]);
const handleOk = () => {
  emit("onOk");
};
const handleCancel = () => {
  emit("onCancel");
  emit("update:open", modalOpen.value);
};

const handleCustomCancel = () => {
  modalOpen.value = false;
  emit("onCancel");
  emit("update:open", modalOpen.value);
};
</script>

<style lang="less">
.custom-wrap {
  .ant-modal {
    // max-width: 724px;
    // max-height: 434px;
    .ant-modal-body {
      max-height: 60vh;
      overflow: auto;
    }
  }
  .hide-foot {
    .ant-modal-footer {
      margin-top: 0;
      // .ant-btn {
      //   padding: 2px 20px;
      // }
    }
  }
}
.custom-class {
  .ant-drawer-footer {
    padding: 10px 16px !important;
  }
}
</style>
