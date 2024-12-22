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
  quantity?: number;
}

// Globaali tuotelista ja ostoskori
let products: Product[] = [];
let listCards: { [key: string]: Product & { quantity: number } | null } = {};

/**
 * Tuotteiden lataaminen API:sta
 * @param category Valinnainen kategoriasuodatin
 */
export async function loadProducts(category: string | null = null) {
  try {
    const url = category
      ? `/api/products/category/${category}`
      : `/api/products`;

    console.log(`Fetching products from: ${url}`); // Debugging log for URL

    const response = await axios.get(url);
    products = response.data.map((product: any) => ({
      ...product,
      discountPrice: product.discount > 0
        ? (product.price || 0) - ((product.price || 0) * ((product.discount || 0) / 100))
        : product.price || 0,
    }));

    displayProducts(products); // Näytä ladatut tuotteet
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

/**
 * Näytä tuotteet
 * @param products Tuotelista
 */
function displayProducts(products: Product[]) {
  const productContainer = document.getElementById('product-list') as HTMLElement | null;

  if (productContainer) {
    productContainer.innerHTML = ''; // Tyhjennä olemassa olevat tuotteet

    if (products.length === 0) {
      productContainer.innerHTML = '<p>No products found for this category.</p>';
      return;
    }

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product-item');

      const priceText = product.discount > 0
        ? `<p><del>$${product.price.toFixed(2)}</del> $${product.discountPrice.toFixed(2)}</p>`
        : `<p>Price: $${product.price.toFixed(2)}</p>`;

      productDiv.innerHTML = `
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        ${priceText}
        <img src="/uploads/${product.image}" alt="${product.name}" width="200">
        <button class="btn add-to-cart">Add to Cart</button>
      `;

      const addToCartButton = productDiv.querySelector('.add-to-cart');
      addToCartButton?.addEventListener('click', () => addToCart(product.id));

      productContainer.appendChild(productDiv);
    });
  } else {
    console.error('Product container not found');
  }
}

/**
 * Lataa ostoskori paikallisesta tallennustilasta
 */
export function loadCart(): void {
  const storedCart = localStorage.getItem('cart');

  if (storedCart) {
    try {
      const cartArray = JSON.parse(storedCart); // Muunna JSON-listaksi

      if (Array.isArray(cartArray)) {
        listCards = {};
        cartArray.forEach((item: Product & { quantity: number }) => {
          listCards[item.id] = item;
        });
      } else {
        console.error('Stored cart data is not an array:', cartArray);
        localStorage.removeItem('cart'); // Poista viallinen data
      }
    } catch (error) {
      console.error('Failed to parse stored cart data:', error);
      localStorage.removeItem('cart'); // Poista viallinen data
    }
  }

  reloadCart(); // Päivitä UI
}

/**
 * Tallenna ostoskori paikalliseen tallennustilaan
 */
function saveCart(): void {
  const cartArray = Object.values(listCards).filter(Boolean); // Muunna objektin arvot listaksi
  localStorage.setItem('cart', JSON.stringify(cartArray));
}

/**
 * Lisää tuote ostoskoriin
 * @param id Tuotteen ID
 */
export function addToCart(id: string): void {
  const product = products.find((product) => product.id === id);
  if (product) {
    const discountPrice = product.discount > 0 ? product.discountPrice : product.price;

    if (!listCards[id]) {
      listCards[id] = { ...product, quantity: 1, price: discountPrice };
    } else {
      listCards[id]!.quantity!++;
    }
  }
  saveCart();
  reloadCart();
}

/**
 * Päivitä ostoskori UI:ssa
 */
export function reloadCart(): void {
  const listCard = document.querySelector('.listCard') as HTMLUListElement;
  const total = document.querySelector('.total') as HTMLDivElement;
  const quantity = document.querySelector('.quantity') as HTMLSpanElement;

  if (listCard && total && quantity) {
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;

    for (const key in listCards) {
      const value = listCards[key];
      if (value) {
        const productPrice = value.price;
        totalPrice += productPrice * value.quantity!;
        count += value.quantity!;
        listCard.innerHTML += `
          <li>
            <div><img src="/uploads/${value.image}" alt="${value.name}" width="50"></div>
            <div>${value.name}</div>
            <div>${value.quantity} pcs</div>
            <div>
              <button onclick="changeQuantity('${value.id}', ${value.quantity! - 1})">-</button>
              <div class="count">${value.quantity}</div>
              <button onclick="changeQuantity('${value.id}', ${value.quantity! + 1})">+</button>
            </div>
          </li>`;
      }
    }
    total.innerText = `Total: $${totalPrice.toFixed(2)}`;
    quantity.innerText = count.toString();
  } else {
    console.error('Cart elements not found');
  }
}

/**
 * Muuta tuotteen määrää
 * @param id Tuotteen ID
 * @param newQuantity Uusi määrä
 */
export function changeQuantity(id: string, newQuantity: number): void {
  if (listCards[id]) {
    if (newQuantity <= 0) {
      delete listCards[id];
    } else {
      listCards[id]!.quantity = newQuantity;
    }
    saveCart();
    reloadCart();
  }
}

/**
 * Tyhjennä ostoskori
 */
export function clearCart(): void {
  listCards = {};
  localStorage.removeItem('cart');
  saveCart();
  reloadCart();
  console.log('Cart has been cleared.');
}
document.addEventListener('DOMContentLoaded', () => {
  // Kuuntele kategoriavalintaa
  const menuItems = document.querySelectorAll<HTMLDivElement>('.Menu');

  menuItems.forEach((item) => {
    item.addEventListener('click', () => {
      const category = item.getAttribute('data-category'); // Lue kategoriatieto
      if (category) {
        console.log(`Loading category: ${category}`);
        loadProducts(category); // Lataa tuotteet valitusta kategoriasta
      } else {
        console.error('Category attribute is missing for this menu item');
      }
    });
  });

  // Lataa oletustuotteet
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category'); // Hae kategoria URL-parametreista
  loadProducts(category); // Lataa tuotteet (jos kategoriaa ei ole, lataa kaikki)

  // Kuuntele ostoskorin tapahtumia
  const clearCartButton = document.querySelector('#clear-cart');
  if (clearCartButton) {
    clearCartButton.addEventListener('click', clearCart);
  }

  const checkoutButton = document.getElementById('checkout');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      console.log('Navigating to payment page...');
      window.location.href = 'maksu.html'; // Siirrytään maksusivulle
    });
  }
  const searchInput = document.getElementById('search-bar') as HTMLInputElement;
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    filterProducts(query);
  });
});

function filterProducts(query: string): void {
  const productItems = document.querySelectorAll('.product-item') as NodeListOf<HTMLElement>;

  productItems.forEach((item) => {
    const name = item.querySelector('h2')?.textContent?.toLowerCase() || '';
    const description = item.querySelector('p')?.textContent?.toLowerCase() || '';

    if (name.includes(query) || description.includes(query)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}
// Globaalit funktiot HTML-käyttöön
(window as any).clearCart = clearCart;
(window as any).changeQuantity = changeQuantity;
(window as any).addToCart = addToCart;

