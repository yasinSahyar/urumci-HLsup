const API = '/api';

// DELETE: Yleisfunktio poistamiseen
export async function deleteItem(endpoint: string, itemId: string): Promise<void> {
  if (!itemId) {
    console.error(`Invalid ID for ${endpoint}`);
    alert(`Cannot delete ${endpoint}: invalid ID`);
    return;
  }

  try {
    const response = await fetch(`${API}/${endpoint}/${itemId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert(`${endpoint} deleted successfully!`);
      if (endpoint === 'products') {
        await loadProducts();
      } else if (endpoint === 'feedback') {
        await fetchFeedback();
      } else if (endpoint === 'purchase') {
        await fetchPayments();
      }
    } else {
      const errorData = await response.json();
      console.error(`Failed to delete ${endpoint}:`, errorData);
      alert(`Failed to delete ${endpoint}: ${errorData.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(`Error deleting ${endpoint}:`, error);
    alert(`An error occurred while deleting ${endpoint}`);
  }
}

// Lataa tuotteet ja lisää Delete-toiminto
export async function loadProducts(): Promise<void> {
  try {
    const response = await fetch(`${API}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await response.json();
    const productList = document.getElementById('product');

    if (productList) {
      productList.innerHTML = '';
      if (products.length === 0) {
        productList.innerHTML = '<p>No products found.</p>';
        return;
      }

      products.forEach((product: any) => {
        const li = document.createElement('li');
        li.textContent = product.name;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteItem('products', product.id)); // Korjattu ID

        li.appendChild(deleteButton);
        productList.appendChild(li);
      });
    }
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Failed to load products');
  }
}

// Lataa palautteet ja lisää Delete-toiminto
export async function fetchFeedback(): Promise<void> {
  try {
    const response = await fetch(`${API}/feedback`);
    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    const feedbacks = await response.json();
    const feedbackContainer = document.getElementById('feedback');

    if (feedbackContainer) {
      feedbackContainer.innerHTML = '';
      if (feedbacks.length === 0) {
        feedbackContainer.innerHTML = '<p>No feedback found</p>';
        return;
      }

      feedbacks.forEach((feedback: any) => {
        const li = document.createElement('li');
        li.textContent = feedback.message;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteItem('feedback', feedback.id)); // Korjattu ID

        li.appendChild(deleteButton);
        feedbackContainer.appendChild(li);
      });
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    alert('Failed to fetch feedback');
  }
}

// Lataa maksuhistoria ja lisää Delete-toiminto
export async function fetchPayments(): Promise<void> {
  try {
    const response = await fetch(`${API}/purchase`);
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }

    const payments = await response.json();
    const paymentTableBody = document.getElementById('payment');

    if (paymentTableBody) {
      paymentTableBody.innerHTML = '';
      if (payments.length === 0) {
        paymentTableBody.innerHTML = '<tr><td colspan="5">No payments found</td></tr>';
        return;
      }

      payments.forEach((payment: any) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${payment.cardName || 'N/A'}</td>
          <td>${payment.email || 'N/A'}</td>
          <td>€${payment.total || '0.00'}</td>
          <td>${payment.createdAt || 'Unknown'}</td>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteItem('purchase', payment.id)); // Korjattu ID

        const td = document.createElement('td');
        td.appendChild(deleteButton);
        tr.appendChild(td);
        paymentTableBody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error('Error fetching payments:', error);
    alert('Failed to fetch payments');
  }
}

// Lataa tiedot sivun latauksen yhteydessä
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  fetchFeedback();
  fetchPayments();
});
