<template>
    <div class="confirmation-container">
      <div class="confirmation-wrapper">
        <h2>Confirmation de la visite</h2>
        <p><strong>Nom :</strong> {{ visitor.name }}</p>
        <p><strong>Téléphone :</strong> {{ visitor.tel }}</p>
        <p><strong>Salle :</strong> {{ visitor.room }}</p>
        <p><strong>Heure de visite :</strong> {{ visitor.visitTime }}</p>
        <p><strong>Date de visite :</strong> {{ visitor.visitDate }}</p>
        <div class="qr-code">
          <img :src="qrCodeUrl" alt="QR Code" />
        </div>
        <button @click="goBack">Retour au formulaire</button>
      </div>
    </div>
  </template>
  
  <script>
  import QRCode from 'qrcode';
  
  export default {
    name: "VisitConfirmation",
    data() {
      return {
        visitor: {},
        qrCodeUrl: '',
      };
    },
    created() {
      // Récupère les données du visiteur via la navigation (props ou query)
      this.visitor = this.$route.query;
  
      // Génére le QR code basé sur les informations du visiteur
      const qrData = JSON.stringify(this.visitor);
      QRCode.toDataURL(qrData)
        .then(url => {
          this.qrCodeUrl = url;
        })
        .catch(err => {
          console.error(err);
        });
    },
    methods: {
      goBack() {
        this.$router.push('/');
      },
    },
  };
  </script>
  
  <style scoped>
  .confirmation-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .confirmation-wrapper {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
  }
  
  .confirmation-wrapper h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .confirmation-wrapper p {
    margin: 10px 0;
    font-size: 16px;
  }
  
  .qr-code img {
    margin-top: 20px;
    width: 150px;
    height: 150px;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    font-size: 14px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  