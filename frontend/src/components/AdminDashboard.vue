<template>
  <div v-if="isAuthenticated">
    <div class="dashboard-container">
      <div class="side-menu">
        <div class="logo">
          <img src="../assets/logo1.png" alt="Logo" />
        </div>
        <ul>
          <li @click="setActiveTab('dashboard')" :class="{ active: activeTab === 'dashboard' }">Dashboard</li>
          <li @click="setActiveTab('visitors')" :class="{ active: activeTab === 'visitors' }">Visiteurs</li>
          <li class="logout" @click="logout">Déconnexion</li>
        </ul>
      </div>

      <div class="content">
        <div v-if="activeTab === 'dashboard'">
          <h2>Dashboard</h2>
          <div class="kpi-cards">
            <div class="card" @click="generateGraph('totalVisits')">
              <h3>Total des visites</h3>
              <p>{{ totalVisits }}</p>
            </div>
            <div class="card" @click="generateGraph('visitsByRoom')">
              <h3>Total des salles</h3>
              <p>{{ visitsByRoom ? Object.keys(visitsByRoom).length : 0 }} salles</p>
            </div>
            <div class="card" @click="generateGraph('visitsToday')">
              <h3>Visites aujourd'hui</h3>
              <p>{{ visitsToday }}</p>
            </div>
          </div>

          <!-- Affichage des visites par salle -->
          <div v-if="visitsByRoom && Object.keys(visitsByRoom).length">
            <h3>Visites par salle</h3>
            <div class="room-cards">
              <div class="room-card" v-for="(visits, room) in visitsByRoom" :key="room">
                <h4>{{ room }}</h4>
                <p>{{ visits }} visite(s)</p>
              </div>
            </div>
          </div>

          <div v-if="showGraph">
            <LineChartComponent :data="graphData" />
          </div>
        </div>

        <div v-if="activeTab === 'visitors'">
          <h2>Liste des visiteurs</h2>
          <ul>
            <li v-for="visitor in paginatedVisitors" :key="visitor.id">
              {{ visitor.name }} - {{ visitor.tel }} - {{ visitor.room }} - {{ visitor.visitDate }} à {{ visitor.visitTime }}
            </li>
          </ul>
          <div class="pagination">
            <button @click="previousPage" :disabled="currentPage === 1">Précédent</button>
            <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p>Vous devez être connecté pour accéder à cette page.</p>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import LineChartComponent from './LineChartComponent.vue';

export default {
  data() {
    return {
      isAuthenticated: false,
      visitors: [],
      activeTab: 'dashboard',
      currentPage: 1,
      itemsPerPage: 5,
      totalVisits: 0,
      visitsByRoom: {},
      visitsToday: 0,
      graphData: [],
      showGraph: false
    };
  },
  mounted() {
    this.isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    if (this.isAuthenticated) {
      this.fetchVisitors();
      this.fetchKPI();
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
    async fetchKPI() {
      try {
        const response = await axios.get('http://localhost:5000/api/kpi');
        console.log("Données KPI reçues :", response.data);

        this.totalVisits = response.data.totalVisits || 0;
        this.visitsByRoom = response.data.visitsByRoom || {}; // Assurez-vous que c'est un objet
        this.visitsToday = response.data.visitsToday || 0;
      } catch (error) {
        console.error("Erreur lors de la récupération des KPI:", error);
      }
    },
    logout() {
      sessionStorage.removeItem('isAuthenticated');
      this.$router.push({ name: 'AdminLogin' });
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    generateGraph(type) {
      this.showGraph = true;
      switch (type) {
        case 'totalVisits':
          this.graphData = this.generateMockData(30, 50, 500);
          break;
        case 'visitsByRoom':
          this.graphData = this.generateMockData(10, 100, 200);
          break;
        case 'visitsToday':
          this.graphData = this.generateMockData(1, 5, 50);
          break;
      }
    },
    generateMockData(days, min, max) {
      return Array.from({ length: days }, (_, i) => ({
        day: `Jour ${i + 1}`,
        value: Math.floor(Math.random() * (max - min) + min)
      }));
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.visitors.length / this.itemsPerPage);
    },
    paginatedVisitors() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.visitors.slice(start, end);
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  top: 0;
}

.side-menu ul {
  list-style: none;
  padding: 0;
}
.side-menu ul li {
  padding: 15px;
  cursor: pointer;
  font-weight: bold;
  color: white;
}
.side-menu ul li.logout {
  color: red;
}
.side-menu ul li.active {
  background-color: #00acc1;
}
.content {
  margin-left: 250px;
  padding: 20px;
  background-color: #f9f9f9;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}
.kpi-cards .card {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}
.kpi-cards .card:hover {
  transform: translateY(-5px);
  background-color: #00acc1; /* Changer la couleur de fond au survol */
  color: white;
}
.side-menu .logo img {
  max-width: 80%;
  max-height: 100px;
  object-fit: contain;
  margin-bottom: 30px;
}
.side-menu {
  width: 250px;
  background-color: #2D3E50;
  height: 100vh;
  padding-top: 20px;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.room-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Utilisation de `auto-fill` pour remplir l'espace disponible avec des cartes de 200px de large */
  gap: 10px;
  margin-top: 20px;
}

.room-card {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s; /* Transition pour l'effet de survol */
  height: 120px; /* Ajustez la hauteur des cartes si nécessaire */
}

.room-card:hover {
  transform: translateY(-5px);
  background-color: #00acc1; /* Changer la couleur de fond au survol */
  color: white; /* Changer la couleur du texte pour un meilleur contraste */
}
</style>
