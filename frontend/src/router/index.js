import { createRouter, createWebHistory } from 'vue-router';
import VisitorForm from '../components/VisitorForm.vue';
import VisitConfirmation from '../components/VisitConfirmation.vue';
const routes = [
  {
    path: '/',
    name: 'VisitorForm',
    component: VisitorForm,
  },
  { path: '/confirmation', name: 'VisitConfirmation', component: VisitConfirmation },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
