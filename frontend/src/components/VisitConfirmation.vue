<template>
    <div id="contain">
      <h1>Badge visiteur</h1>
      <div id="badge">

        <p><strong>Nom :</strong> {{ visitor.name }}</p>
        <p><strong>Téléphone :</strong> {{ visitor.tel }}</p>
        <p><strong>Salle :</strong> {{ visitor.room }}</p>
        <p><strong>Heure de visite :</strong> {{ visitor.visitTime }}</p>
        <p><strong>Date de visite :</strong> {{ visitor.visitDate }}</p>
        <div class="qr-code">
          <img :src="qrCodeUrl" alt="QR Code" />
        </div>
      </div>
      <div class="button-container">
      <button @click="goBack">Retour au formulaire</button>
      <button @click="printBadge">Imprimer le badge</button>
    </div>
    </div>
  </template>
  
  <script>
  import QRCode from "qrcode";
  import axios from 'axios';
  
  export default {
    name: "VisitConfirmation",
    data() {
      return {
        visitor: this.$route.query, // Données transmises via la route
        qrCodeUrl: "", // URL du QR code
      };
    },
    methods: {
      async generateQRCode() {
        // Génération du QR code à partir des données du visiteur
        const qrData = JSON.stringify(this.visitor);
        this.qrCodeUrl = await QRCode.toDataURL(qrData);
      },
      printBadge() {
        // Préparer le contenu pour l'impression
        const badge = document.getElementById("badge");
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <html>
            <head>
              <title>Badge de visite</title>
              <style>
                @page {
                  size: 80mm auto; /* Largeur 80mm, hauteur ajustée */
                  margin: 0;
                }
                body {
                  font-family: Arial, sans-serif;
                  font-size: 12px;
                  width: 80mm;
                  margin: 0;
                
                  text-align: center;
                }
                #badge {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  text-align: center; 
                }
                .qr-code img {
                  max-width: 45mm;
                  margin: 10px 0;
                }
                p {
                  margin: 5px 0;
                }
                strong {
                  font-weight: bold;
                }
              </style>
            </head>
            <body>${badge.innerHTML}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      },
      // Méthode pour revenir au formulaire
    goBack() {
      this.$router.push({ name: 'VisitorForm' }); // 'visitorForm' est le nom de la route du formulaire
    },
    },
    async mounted() {
      await this.generateQRCode();
    },
  };
  
  </script>
  
  <style>
  .button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #2b4bb3;
  color:#fff;
}

button:hover {
 
  background-color: #28b156;
  color: white;
}

button:first-child {
  background-color: #30d0e6; /* Couleur rouge pour le bouton retour */
  color: white;
}

button:first-child:hover {
  background-color: #2b4bb3; /* Effet de survol pour le bouton retour */
}
  #badge {
    width: 80mm;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  </style>
  