import { createRouter, createWebHistory } from 'vue-router';
import VisitorForm from '../components/VisitorForm.vue';
import VisitConfirmation from '../components/VisitConfirmation.vue';
import AdminLogin from '../components/AdminLogin.vue';
import AdminDashboard from '../components/AdminDashboard.vue';

// Fonction simulée pour vérifier l'authentification
const isAuthenticated = () => {
  return sessionStorage.getItem('isAuthenticated') === 'true';
};

// Définition des routes
const routes = [
  {
    path: '/',
    name: 'VisitorForm',
    component: VisitorForm,
  },
  {
    path: '/confirmation',
    name: 'VisitConfirmation',
    component: VisitConfirmation,
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }, // Route protégée
  },
];

// Création du routeur
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware pour gérer les routes protégées
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'AdminLogin' }); // Redirige vers la page de connexion
  } else {
    next(); // Continue vers la route demandée
  }
});

export default router;
