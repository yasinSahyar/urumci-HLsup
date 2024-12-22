import { processPayment, loadPayments } from './payment';
import { setupAuthListeners, logout } from './auth';
import { loadCart, reloadCart, clearCart, loadProducts } from './cartAndProduct';
import { setupFeedbackForm } from './feedback';
import { setupNavListeners } from './nav';
import './indexProducts' // Import the indexProducts.ts file to run the code inside it
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;

    // General setup for all pages
    setupAuthListeners();
    setupNavListeners();
    loadCart();
    reloadCart();
    loadProducts();
    setupFeedbackForm();

    // Page-specific setup
    if (currentPage.includes('maksu.html')) {
        processPayment();
        loadPayments();
    }

    // Attach global functions to the window for accessibility in HTML
    (window as any).logout = logout;
    (window as any).clearCart = clearCart;


});
