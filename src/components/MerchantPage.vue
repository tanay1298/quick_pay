<template>
  <div class="merchant-page">
    <h1>Create Payment Link</h1>
    <form @submit.prevent="generateQRCode">
      <div class="form-group">
        <label for="amount">Amount:</label>
        <input type="number" v-model="payment.amount" id="amount" name="amount" required>
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <input type="text" v-model="payment.description" id="description" name="description" required>
      </div>
      <button type="submit">Generate QR Code</button>
    </form>
    <div v-if="qrCode" class="qr-code">
      <img :src="qrCode" alt="QR Code">
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      payment: {
        amount: '',
        description: ''
      },
      qrCode: ''
    };
  },
  methods: {
    async generateQRCode() {
      try {
        const response = await axios.post('http://localhost:8000/generate-qr-code/', {
          amount: this.payment.amount,
          description: this.payment.description
        });

        if (response.data.qr_code_url) {
          this.qrCode = 'http://localhost:8000' + response.data.qr_code_url;
        } else {
          console.error('QR code URL not found in response');
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  }
};
</script>

<style scoped>
.merchant-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

input[type="number"],
input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.qr-code {
  margin-top: 20px;
}

.qr-code img {
  max-width: 100%;
}
</style>
