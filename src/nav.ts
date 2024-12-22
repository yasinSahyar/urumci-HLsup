export function setupNavListeners() {
    const navbar = document.querySelector('.navbar') as HTMLElement | null;
    const searchForm = document.querySelector('.search-form') as HTMLElement | null;
    const cartItem = document.querySelector('.cart-items-container') as HTMLElement | null;
    const userModal = document.querySelector("#user-modal") as HTMLDialogElement | null;
    const LoginModel = document.querySelector('#LoginBtn') as HTMLDialogElement | null;
    const logbar = document.querySelector('.logbar') as HTMLElement | null;
    const closeModalBtn = document.querySelector("#close-modal") as HTMLElement | null;
    const userbtn = document.querySelector("#user-btn") as HTMLElement | null;
    const loginbtn = document.querySelector(".login-btn") as HTMLElement | null;
    const searchButton = document.getElementById('search-btn') as HTMLElement | null;
    const searchInput = document.getElementById('search-box') as HTMLInputElement | null;
    const sign_in_btn = document.querySelector("#sign-in-btn") as HTMLElement;
    const sign_up_btn = document.querySelector("#sign-up-btn") as HTMLElement;
    const container = document.querySelector(".container") as HTMLElement;
    const closeshopping = document.querySelector(".closeShopping") as HTMLElement | null;
    // Toggle navbar visibility

    if (closeshopping) {
      closeshopping.onclick = () => {
        cartItem?.classList.remove('active');
      };
    }
    if (navbar && document.querySelector('#menu-btn')) {
      (document.querySelector('#menu-btn') as HTMLElement).onclick = () => {
        navbar?.classList.toggle('active');
        cartItem?.classList.remove('active');
        searchForm?.classList.remove('active');
        logbar?.classList.toggle('active');
      };
    }
    if (logbar && userbtn){
      userbtn.onclick = () => {
        logbar?.classList.toggle('active');
        navbar?.classList.remove('active');
        cartItem?.classList.remove('active');
        searchForm?.classList.remove('active');
      };
    }

    // Toggle cart item display
    if (document.querySelector('#cart-btn')) {
      (document.querySelector('#cart-btn') as HTMLElement).onclick = () => {
        cartItem?.classList.toggle('active');
        navbar?.classList.remove('active');
        searchForm?.classList.remove('active');
        logbar?.classList.remove('active');
      };
    }

    // Toggle search form display
    if (searchButton) {
      searchButton.onclick = () => {
        searchForm?.classList.toggle('active');
        navbar?.classList.remove('active');
        cartItem?.classList.remove('active');
        logbar?.classList.remove('active');
      };
    }

    // Open and close user modal
    if (LoginModel) {
      LoginModel.onclick = () => {
        userModal?.showModal();
        document.body.classList.add('fixed-body');

      };
    }
    if (closeModalBtn) {
      closeModalBtn.onclick = () => {
        userModal?.close();
        document.body.classList.remove('fixed-body');
      };
    }

    if (loginbtn) {
      loginbtn.onclick = () => {
        userModal?.showModal();
      };
    }

  if (sign_up_btn) {
    sign_up_btn.addEventListener("click", () => {
      container?.classList.add("sign-up-mode");
    });
  }

  if (sign_in_btn) {
    sign_in_btn.addEventListener("click", () => {
      container?.classList.remove("sign-up-mode");
    });
  }

    // Close navbar, cart, and search on scroll
    window.onscroll = () => {
      navbar?.classList.remove('active');
      cartItem?.classList.remove('active');
      searchForm?.classList.remove('active');
    };

    // Search input functionality
    if (searchInput) {
      searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          const searchTerm = searchInput.value.trim().toLowerCase();
          if (searchTerm) {
            window.location.href = `Menu.html?search=${encodeURIComponent(searchTerm)}`;
          }
        }
      });
    }
  }


