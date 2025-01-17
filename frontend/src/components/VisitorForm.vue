<template>
  <div class="background">
    <div class="container">
      <h1>Formulaire de Visite</h1>
      <form @submit.prevent="submitForm">
        <div>
          <label><i class="fas fa-user"></i> Nom et prénom</label>
          <input v-model="name" type="text" required />
        </div>
        <div>
          <label><i class="fas fa-phone"></i>Téléphone</label>
          <input v-model="tel" type="text" required />
        </div>
        <div>
          <label><i class="fas fa-door-open"></i>Salle</label>
          <select v-model="room" required>
            <option v-for="option in rooms" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
          <div>
            <label><i class="fas fa-clock"></i>Heure de visite</label>
            <input v-model="visitTime" type="time" required />
          </div>
        <div>
            <label><i class="fas fa-calendar-alt"></i>Date de visite</label>
            <input v-model="visitDate" type="date" required />
        </div>
        <button type="submit">Envoyer</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      tel: '',
      room: '',
      visitTime: '',
      visitDate: '',
      errorMessage: '',
      rooms: [
        "Boxe 1", "Boxe 2", "Malabo", "Dakar", "Woleu", 
        "Ntem", "Mpassa", "Lolo", "Ngounie", "Ogoué", 
        "Ivindo", "Nianga", "Komo", "Abanga", "Mbei"
      ],
    };
  },
  methods: {
    async submitForm() {
      try {
        // Vérification des horaires de visite autorisés
        const validTimes = [
          { start: "06:00", end: "08:00" },
          { start: "12:00", end: "14:00" },
          { start: "18:00", end: "20:00" },
        ];

        const isValidTime = validTimes.some(
          (interval) =>
            this.visitTime >= interval.start && this.visitTime <= interval.end
        );

        if (!isValidTime) {
          this.errorMessage = "L'heure de visite doit être entre 6h-8h, 12h-14h, ou 18h-20h.";
          return;
        }

        // Envoi des données au backend
        const response = await axios.post('http://localhost:5000/api/visitors', {
          name: this.name,
          tel: this.tel,
          room: this.room,
          visitTime: this.visitTime,
          visitDate: this.visitDate,
        });

        console.log(response.data);

        // Réinitialiser l'erreur (si elle existe)
        this.errorMessage = '';

        // Rediriger vers la page de confirmation avec les données du visiteur
        this.$router.push({
          name: 'VisitConfirmation',
          query: {
            name: this.name,
            tel: this.tel,
            room: this.room,
            visitTime: this.visitTime,
            visitDate: this.visitDate,
          },
        });
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erreur lors de l\'enregistrement.';
      }
    },
  },
};
</script>

<style scoped>
/* Arrière-plan d'image */
.background {
  display: flex;
  justify-content: flex-start;  /* Aligner à gauche */
  align-items: center;
  height: 100vh;
  background-image: url('../assets/display.png');
  background-size: cover;
  background-position: center;
  padding-left: 20px;  /* Ajoute de l'espace à gauche */
}

/* Conteneur du formulaire */
.container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
}

/* Style pour les labels avec icônes */
label {
  font-weight: bold;
  text-align: left;  /* Alignement à gauche */
  margin-bottom: 5px;  /* Marge en bas pour espacer du champ */
  display: flex; /* Utilisation de flex pour aligner l'icône avec le texte */
  align-items: center; /* Aligne l'icône verticalement avec le texte */
}

label i {
  margin-right: 8px; /* Marge à droite de l'icône */
  font-size: 18px; /* Taille de l'icône */
}

/* Pour les champs input et select */
input, select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px; /* Marge sous chaque champ */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 400px; /* Assurez-vous que la largeur est égale à celle des champs */
  padding: 10px;
  background: linear-gradient(to right, rgb(135,206,235), rgb(49, 182, 182)); /* Gradient du bleu clair au bleu-vert */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease; /* Transition douce lors du changement de couleur */
}

button:hover {
  background-color: rgb(49, 182, 182);
}

/* Message d'erreur */
.error {
  color: red;
  text-align: center;
  font-size: 14px;
}

/* Success message */
.success {
  color: green;
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
}

/* Ajustement des champs d'entrée pour être plus petits sur la ligne */
input[type="time"], input[type="date"] {
  flex: 1;  /* S'assurer qu'ils prennent tout l'espace disponible */
}

</style>
