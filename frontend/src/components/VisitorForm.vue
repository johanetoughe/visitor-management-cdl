<template>
  <div>
    <h1>Formulaire de Visite</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label>Nom:</label>
        <input v-model="name" type="text" required />
      </div>
      <div>
        <label>Téléphone:</label>
        <input v-model="tel" type="text" required />
      </div>
      <div>
        <label>Salle:</label>
        <select v-model="room" required>
          <option v-for="option in rooms" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
      <div>
        <label>Heure de visite:</label>
        <input v-model="visitTime" type="time" required />
      </div>
      <div>
        <label>Date de visite:</label>
        <input v-model="visitDate" type="date" required />
      </div>
      <button type="submit">Envoyer</button>
    </form>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
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

<style>
form {
  max-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
}
div {
  margin-bottom: 10px;
}
</style>
