export function processPayment(): void {
  const step1 = document.getElementById('step-1')!;
  const step2 = document.getElementById('step-2')!;
  const nextStepButton = document.getElementById('next-step')!;
  const paymentForm = document.getElementById('payment-form') as HTMLFormElement | null;

  // Step 1: Billing Details
  nextStepButton.addEventListener('click', () => {
    const cardName = (document.getElementById('card-name') as HTMLInputElement)?.value.trim();
    const address = (document.getElementById('address') as HTMLInputElement)?.value.trim();
    const city = (document.getElementById('city') as HTMLInputElement)?.value.trim();
    const state = (document.getElementById('state') as HTMLInputElement)?.value.trim();
    const phone = (document.getElementById('phone') as HTMLInputElement)?.value.trim();
    const email = (document.getElementById('email') as HTMLInputElement)?.value.trim();

    if (!cardName || !address || !city || !state || !phone || !email) {
      alert('Please fill in all required fields.');
      return;
    }

    // Save billing details to local storage
    localStorage.setItem('billingDetails', JSON.stringify({ cardName, address, city, state, phone, email }));

    // Show Step 2
    step1.classList.remove('active');
    step2.classList.add('active');
  });

  // Step 2: Payment Details
  if (!paymentForm) {
    console.error('Payment form not found.');
    return;
  }

  paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Fetch billing details
    const billingDetails = JSON.parse(localStorage.getItem('billingDetails') || '{}');

    // Collect payment details
    const cardNumber = (document.getElementById('card-number') as HTMLInputElement)?.value.trim();
    const cardExpiration = (document.getElementById('card-expiration') as HTMLInputElement)?.value.trim();

    if (!cardNumber || !cardExpiration) {
      alert('Please complete all payment details.');
      return;
    }

    // Simulate payment success
    const isPaymentSuccessful = Math.random() > 0.2; // 80% chance of success
    if (isPaymentSuccessful) {
      alert('Payment successful!');

      // Fetch cart data
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = cartData.reduce((sum: number, item: { quantity: number; price: number }) => sum + item.quantity * item.price, 0);

      // Display receipt
      displayReceipt({ ...billingDetails, cardNumber, cardExpiration }, cartData, total);

      // Send purchase details to backend
      sendPurchaseDetailsToBackend({ ...billingDetails, cardNumber, cardExpiration }, cartData, total);

      // Clear local storage
      localStorage.removeItem('billingDetails');
      localStorage.removeItem('cart');

      // Redirect to index.html
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 5000);
    } else {
      alert('Payment failed. Please try again.');
    }
  });
}

/**
 * Sends purchase details to the backend
 */
function sendPurchaseDetailsToBackend(details: Record<string, string>, cartData: any[], total: number): void {
  fetch('/api/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerDetails: {
        cardName: details.cardName,
        address: details.address,
        city: details.city,
        state: details.state,
        phone: details.phone,
        email: details.email,
      },
      paymentDetails: {
        cardNumber: details.cardNumber, // For simulation only
        cardExpiration: details.cardExpiration,
      },
      cart: cartData,
      total,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to send purchase details');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Purchase successfully sent to backend:', data);
    })
    .catch((error) => {
      console.error('Error sending purchase details to backend:', error);
    });
}

/**
 * Displays receipt with customer and payment details
 */
function displayReceipt(details: Record<string, string>, cartData: any[], total: number): void {
  const receiptContainer = document.getElementById('receipt-container')!;
  const customerNameElement = document.getElementById('customer-name')!;
  const paymentDateElement = document.getElementById('payment-date')!;
  const customerAddressElement = document.getElementById('customer-address')!;
  const customerPhoneElement = document.getElementById('customer-phone')!;
  const customerEmailElement = document.getElementById('customer-email')!;
  const productListElement = document.getElementById('product-list')!;
  const totalAmountElement = document.getElementById('total-amount')!;
  const printButton = document.getElementById('print-receipt-btn')!;

  // Populate receipt with billing details
  customerNameElement.textContent = `Cardholder: ${details.cardName}`;
  customerAddressElement.textContent = `Address: ${details.address}, ${details.city}, ${details.state}`;
  customerPhoneElement.textContent = `Phone: ${details.phone}`;
  customerEmailElement.textContent = `Email: ${details.email}`;

  // Generate payment date
  const paymentDate = new Date().toLocaleString();
  paymentDateElement.textContent = `Date: ${paymentDate}`;


  // Populate product list
  productListElement.innerHTML = '';
  cartData.forEach((item: { name: string; quantity: number; price: number }) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name} - ${item.quantity} pcs - €${item.price.toFixed(2)}`;
    productListElement.appendChild(listItem);
  });

  totalAmountElement.textContent = `Total: €${total.toFixed(2)}`;

  // Show receipt
  receiptContainer.style.display = 'block';

  // Enable print functionality
  printButton.onclick = () => window.print();
}

// Initialize the payment process
document.addEventListener('DOMContentLoaded', () => processPayment());


export function loadPayments(): void {
  fetch('/api/purchase') // Make sure this matches your backend URL
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      return response.json();
    })
    .then((payments) => {
      const tableBody = document.getElementById('payment-table-body')!;
      tableBody.innerHTML = ''; // Clear the table first

      payments.forEach((payment: any) => {
        const row = document.createElement('tr');

        // Create table cells for each payment detail
        row.innerHTML = `
          <td>${payment.cardName}</td>
          <td>${payment.email}</td>
          <td>€${payment.total.toFixed(2)}</td>
          <td>${new Date(payment.createdAt).toLocaleString()}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error('Error loading payments:', error);
    });
}
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;

  if (currentPage.includes('addProduct.html')) {
    loadPayments();
  }
});
