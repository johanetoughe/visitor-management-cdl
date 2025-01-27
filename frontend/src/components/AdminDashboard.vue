<template>
    <div v-if="isAuthenticated">
      <h1>Tableau de bord de l'Admin</h1>
  
      <!-- Liste des visiteurs -->
      <h2>Liste des visiteurs</h2>
      <ul>
        <li v-for="visitor in visitors" :key="visitor.id">
          {{ visitor.name }} - {{ visitor.tel }} - {{ visitor.room }} - {{ visitor.visitDate }} à {{ visitor.visitTime }}
        </li>
      </ul>
  
      <button @click="logout">Déconnexion</button>
    </div>
  
    <div v-else>
      <p>Vous devez être connecté pour accéder à cette page.</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        isAuthenticated: false,
        visitors: []
      };
    },
    created() {
      // Vérification de l'authentification dès la création du composant
      this.isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  
      // Si l'utilisateur est authentifié, charger les visiteurs
      if (this.isAuthenticated) {
        this.fetchVisitors();
      }
    },
    methods: {
      async fetchVisitors() {
        try {
          const response = await axios.get('http://localhost:5000/api/visitors');
          this.visitors = response.data;
        } catch (error) {
          console.error("Erreur lors de la récupération des visiteurs:", error);
        }
      },
      logout() {
        sessionStorage.removeItem('isAuthenticated');
        this.$router.push({ name: 'AdminLogin' });
      }
    }
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    padding: 20px;
    text-align: center;
  }
  button {
    margin-top: 20px;
  }
  </style>  