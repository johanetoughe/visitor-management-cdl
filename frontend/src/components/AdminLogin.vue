<template>
    <div class="background">
      <div class="form-container">
        <img src="../assets/logo1.png" alt="Logo" class="logo" />
        <h1>Connexion Administrateur</h1>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Identifiant</label>
            <div class="input-container">
              <i class="fas fa-user"></i>
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Entrez votre identifiant"
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-container">
              <i class="fas fa-lock"></i>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>
          </div>
          <button type="submit" class="submit-button">Se connecter</button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await axios.post('http://localhost:5000/login', {
            username: this.username,
            password: this.password
          });
  
          if (response.status === 200) {
            // Connexion réussie, on enregistre l'authentification
            sessionStorage.setItem('isAuthenticated', 'true');
            // Redirection vers le tableau de bord
            this.$router.push({ name: 'AdminDashboard' });
          }
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Erreur lors de la connexion.';
        }
      }
    }
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
  
  input {
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
  input + i {
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
  body, html {
  margin: 0;  /* Retirer les marges par défaut du body et html */
  padding: 0; /* Retirer le padding du body et html */
  height: 100%; /* Assurer que le body prend toute la hauteur de l'écran */
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