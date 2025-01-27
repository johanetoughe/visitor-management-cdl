<template>
  <div class="background">
    <div class="form-container">
      <img src="../assets/logo1.png" alt="Logo" class="logo">
      <h1>Formulaire de Visite</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Nom et prénom</label>
          <div class="input-container">
            <i class="fas fa-user"></i>
            <input id="name" v-model="name" type="text" placeholder="Entrez votre nom complet" required />
          </div>
        </div>
        <div class="form-group">
          <label for="tel">Téléphone</label>
          <div class="input-container">
            <i class="fas fa-phone"></i>
            <input id="tel" v-model="tel" type="text" placeholder="Entrez votre numéro" required />
          </div>
        </div>
        <div class="form-group">
          <label for="room">Salle</label>
          <div class="input-container">
            <i class="fas fa-door-open"></i>
            <select id="room" v-model="room" required>
              <option v-for="option in rooms" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="visitTime">Heure de visite</label>
          <div class="input-container">
            <i class="fas fa-clock"></i>
            <input id="visitTime" v-model="visitTime" type="time" required />
          </div>
        </div>
        <div class="form-group">
          <label for="visitDate">Date de visite</label>
          <div class="input-container">
            <i class="fas fa-calendar-alt"></i>
            <input id="visitDate" v-model="visitDate" type="date" required />
          </div>
        </div>
        <button type="submit" class="submit-button">Enregistrer</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
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
}, {
  headers: {
    'Content-Type': 'application/json',  // Assurez-vous que le type de contenu est bien spécifié
  },
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
/* Arrière-plan */
.background {
  display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;  /* Prend toute la hauteur de l'écran */
    width: 100%;   /* Prend toute la largeur de l'écran */
    font-family: 'Poppins', sans-serif;
    background-image: url("../assets/logindisplay.jpg");
    background-repeat: no-repeat;
    background-size: cover;  /* L'image couvre tout l'écran */
    background-position: center;  /* L'image est centrée */
    position: absolute;  /* Assure que l'élément couvre toute la zone disponible */
    top: 0;
    left: 0;
}

/* Conteneur principal du formulaire */
.form-container {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

/* Titre */
h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333333;
}

/* Champs du formulaire */
.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  font-size: 14px;
  color: #333333;
  margin-bottom: 5px;
  display: block;
}

.input-container {
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  border-radius: 10px;
  padding: 10px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

input,
select {
  flex: 1;
  border: none;
  background: none;
  font-size: 14px;
  padding: 5px;
  color: #555555;
  outline: none;
}

input::placeholder {
  color: #aaaaaa;
}
.logo {
  max-width: 100px; /* Limite la taille du logo */
  margin-bottom: 5px; /* Espacement entre le logo et le formulaire */
}
/* Icônes */
input + i,
select + i {
  margin-right: 10px;
  color: #777777;
}

/* Bouton de soumission */
.submit-button {
  background: linear-gradient(135deg, #80deea, #26c6da);
  color: white;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  width: 100%;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-button:hover {
  background: #00acc1;
}

/* Message d'erreur */
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 10px;
}

/* Ajustement pour mobile */
@media screen and (max-width: 480px) {
  .form-container {
    padding: 20px;
  }

  h1 {
    font-size: 20px;
  }

  label {
    font-size: 12px;
  }
}
</style>

