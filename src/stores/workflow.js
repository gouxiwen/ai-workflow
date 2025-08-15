import { defineStore } from "pinia";
import { store } from "@/stores";

export const useWorkflowStore = defineStore("workflow", {
  state: () => ({
    mousePosition: {
      pageX: 0,
      pageY: 0,
      elementX: 0,
      elementY: 0,
    },
    candidateNode: undefined,
    newNode: null,
  }),
  getters: {},
  actions: {
    setMousePosition({ pageX, pageY, elementX, elementY }) {
      this.mousePosition = {
        pageX,
        pageY,
        elementX,
        elementY,
      };
    },
    setCandidateNode(node) {
      this.candidateNode = node;
    },
    setNode(node) {
      this.newNode = node;
    },
  },
});

// 在组件setup函数外使用
export function useWorkflowStoreWithOut() {
  return useWorkflowStore(store);
}
