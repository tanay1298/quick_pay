<template>
  <div class="buyer-page">
    <h1>Scan QR Code to Proceed with Payment</h1>
    <input type="file" accept="image/*" @change="handleFileChange" />
    <button @click="processPayment" :disabled="!paymentDetails">Process Payment</button>
  </div>
</template>

<script>
import jsQR from 'jsqr';

export default {
  data() {
    return {
      paymentDetails: null,
      errorMessage: null
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        const decodedQR = this.decodeQR(imageData);
        if (decodedQR) {
          this.paymentDetails = decodedQR;
        } else {
          this.errorMessage = 'No QR code found in the image';
        }
      };
      reader.readAsDataURL(file);
    },
    decodeQR(imageData) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const image = new Image();

      return new Promise((resolve, reject) => {
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, image.width, image.height);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            resolve(code.data);
          } else {
            reject(new Error('No QR code found'));
          }
        };
        image.onerror = (error) => reject(error);
        image.src = imageData;
      });
    },
    processPayment() {
      if (this.paymentDetails) {
        // integrate API to initiate payment process
        console.log('Initiating payment with details:', this.paymentDetails);
        // After payment is processed, redirect to success page or display success message
      } else {
        console.error('Payment details not available');
        this.errorMessage = 'Payment details not available';
      }
    }
  }
};
</script>

<style scoped>
.buyer-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
