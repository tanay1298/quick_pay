<template>
  <div class="buyer-page">
    <h1>Scan QR Code to Proceed with Payment</h1>
    <input type="file" accept="image/*" @change="handleFileChange" />
    <button @click="processPayment" :disabled="!paymentDetails">Process Payment</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
        this.decodeQR(imageData)
          .then((decodedQR) => {
            this.paymentDetails = decodedQR;
            this.errorMessage = null; // Reset error message
          })
          .catch((error) => {
            console.error('Error decoding QR:', error.message);
            this.errorMessage = 'No QR code found in the image';
            this.paymentDetails = null; // Reset payment details
          });
      };
      reader.readAsDataURL(file);
    },
    decodeQR(imageData) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();

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
        console.log('Initiating payment with details:', this.paymentDetails);
        
        const fields = this.paymentDetails.split(', ');
        
        const paymentInfo = {};        
        fields.forEach(field => {
          const [key, value] = field.split(': ');
          paymentInfo[key.trim()] = value;
        });
        
        const requiredFields = ['amount', 'description', 'order_id', 'merchant_id', 'customer_id'];
        if (requiredFields.every(field => Object.prototype.hasOwnProperty.call(paymentInfo, field))) {
          console.log('Payment Info:', paymentInfo);
          
          const requestBody = JSON.stringify({
            amount: parseFloat(paymentInfo['amount']),
            description: paymentInfo['description'],
            customer_id: parseInt(paymentInfo['customer_id']),
            merchant_id: parseInt(paymentInfo['merchant_id']),
            payment_method: 'upi', // Assuming payment_method is hardcoded to 'upi'
            order_id: parseInt(paymentInfo['order_id'])
          });
          
          fetch('http://localhost:8000/process-payment/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: requestBody
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Payment processed successfully:', data);
            // Redirect to success page or display success message
          })
          .catch(error => {
            console.error('Error processing payment:', error);
            this.errorMessage = 'Error processing payment';
          });
          
        } else {
          console.error('Missing required fields');
          this.errorMessage = 'Missing required fields';
        }
        
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

.error-message {
  color: red;
}
</style>
