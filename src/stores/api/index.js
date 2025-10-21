// src/stores/api/index.js
import { defineStore } from 'pinia';
import axios from 'axios';

// Xuất các store API
export * from './users';

// Tùy chọn: Tạo một store tổng hợp nếu cần
export const useApiStore = defineStore('api', {
  state: () => ({
    baseUrl: 'https://jsonplaceholder.typicode.com', // URL cơ sở cho API
  }),
  actions: {
    async fetchFromApi(endpoint) {
      try {
        const response = await axios.get(`${this.baseUrl}/${endpoint}`);
        return response.data;
      } catch (error) {
        console.error(`Lỗi khi gọi API ${endpoint}:`, error);
        throw error;
      }
    },
  },
});