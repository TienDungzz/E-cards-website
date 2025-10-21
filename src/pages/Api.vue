<template>
  <div class="api-container">
    <h1>Danh sách API</h1>
    <div>
      <h2>Users</h2>
      <button @click="fetchUsers">Lấy danh sách Users</button>
      <div v-if="usersLoading">Đang tải Users...</div>
      <div v-if="usersError" class="error">{{ usersError }}</div>
      <ul v-if="users.length">
        <li v-for="user in users" :key="user.id">
          {{ user.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useUsersStore } from '../stores/api/users';

export default {
  name: 'Api',
  setup() {
    const usersStore = useUsersStore();

    const fetchUsers = () => usersStore.fetchUsers();

    return {
      users: usersStore.users,
      usersLoading: usersStore.loading,
      usersError: usersStore.error,
      fetchUsers,
    };
  },
};
</script>