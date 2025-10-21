import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state() {
    return {
      count: 0,
    };
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});