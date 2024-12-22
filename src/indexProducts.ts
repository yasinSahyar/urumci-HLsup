import axios from 'axios';

// Tuotteen määrittely
interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  discountPrice: number;
  description: string;
  image: string;
  category: string;
}

// Globaali ostoskori
let cart: { [key: string]: Product & { quantity: number } } = {};

// Lataa ja näytä parhaat tuotteet
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const products = await fetchProducts();

    // Suodata tuotteet, joiden kategoria on "best product"
    const bestProducts = products.filter(product => product.category.toLowerCase() === 'best product');

    // Näytä tuotteet index.html-sivulla
    displayBestProducts(bestProducts);

    // Lataa ja päivitä ostoskori
    loadCart();
    reloadCart();
  } catch (error) {
    console.error('Error loading products:', error);
  }
});

/**
 * Lataa kaikki tuotteet API:sta
 */
async function fetchProducts(): Promise<Product[]> {
  const response = await axios.get('/api/products');
  return response.data.map((product: any) => ({
    ...product,
    discountPrice: product.discount > 0
      ? (product.price || 0) - ((product.price || 0) * ((product.discount || 0) / 100))
      : product.price || 0,
  }));
}

/**
 * Näytä tuotteet, joiden kategoria on "best product"
 */
function displayBestProducts(products: Product[]): void {
  const container = document.getElementById('best-products') as HTMLElement;

  if (container) {
    container.innerHTML = ''; // Tyhjennä olemassa olevat tuotteet

    products.forEach((product) => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product-item');

      productDiv.innerHTML = `
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <img src="/uploads/${product.image}" alt="${product.name}" width="200">
        <p>Price: $${product.discountPrice.toFixed(2)}</p>
        <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;

      const addToCartButton = productDiv.querySelector('.add-to-cart');
      addToCartButton?.addEventListener('click', () => {
        addToCart(product);
      });

      container.appendChild(productDiv);
    });
  } else {
    console.error('Best products container not found');
  }
}

/**
 * Lisää tuote ostoskoriin
 */
function addToCart(product: Product): void {
  if (!cart[product.id]) {
    cart[product.id] = { ...product, quantity: 1 };
  } else {
    cart[product.id].quantity++;
  }

  // Tallenna ostoskori paikalliseen tallennustilaan ja päivitä käyttöliittymä
  saveCart();
  reloadCart();
  console.log(`${product.name} added to cart.`);
}

/**
 * Päivitä ostoskori käyttöliittymässä
 */
function reloadCart(): void {
  const cartContainer = document.querySelector('.listCard') as HTMLElement;
  const total = document.querySelector('.total') as HTMLElement;
  const quantity = document.querySelector('.quantity') as HTMLElement;

  if (!cartContainer || !total || !quantity) {
    console.error('Cart elements not found');
    return;
  }

  cartContainer.innerHTML = ''; // Tyhjennä vanhat tuotteet
  let totalPrice = 0;
  let totalQuantity = 0;

  Object.values(cart).forEach((item) => {
    totalPrice += item.discountPrice * item.quantity;
    totalQuantity += item.quantity;

    const cartItem = document.createElement('li');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <div><img src="/uploads/${item.image}" alt="${item.name}" width="50"></div>
      <div>${item.name}</div>
      <div>${item.quantity} pcs</div>
      <div>
        <button onclick="changeQuantity('${item.id}', ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity('${item.id}', ${item.quantity + 1})">+</button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });

  total.textContent = `Total: $${totalPrice.toFixed(2)}`;
  quantity.textContent = `${totalQuantity}`;
}

/**
 * Lataa ostoskori paikallisesta tallennustilasta
 */
function loadCart(): void {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart).reduce((acc: typeof cart, item: Product & { quantity: number }) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }
}

/**
 * Tallenna ostoskori paikalliseen tallennustilaan
 */
function saveCart(): void {
  localStorage.setItem('cart', JSON.stringify(Object.values(cart)));
}
