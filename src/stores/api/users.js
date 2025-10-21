// src/stores/api/users.js
import { defineStore } from 'pinia';
import { useApiStore } from './index';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchUsers() {
      const apiStore = useApiStore();
      this.loading = true;
      this.error = null;
      try {
        const data = await apiStore.fetchFromApi('users');
        this.users = data;
      } catch (err) {
        this.error = 'Không thể tải danh sách users.';
      } finally {
        this.loading = false;
      }
    },
  },
});