import { createRouter, createWebHistory } from 'vue-router';

//Layouts
import DefaultLayout from '../layouts/DefaultLayout.vue'
//Pages
import Home from '../pages/Home.vue';
import About from '../pages/About.vue';
import Api from '../pages/Api.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: Home },
      { path: '/about', name: 'about', component: About },
      { path: '/api', name: 'api', component: Api },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;