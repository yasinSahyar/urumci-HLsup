import axios from 'axios';

export function setupAuthListeners() {
  const signUpForm = document.querySelector('.sign-up-form') as HTMLFormElement | null;
  const loginForm = document.querySelector('.sign-in-form') as HTMLFormElement | null;
  const logoutButton = document.getElementById('logoutbtn') as HTMLButtonElement | null;

  if (signUpForm) {
    signUpForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const usernameInput = signUpForm.querySelector('input[placeholder="Username"]') as HTMLInputElement;
      const emailInput = signUpForm.querySelector('input[placeholder="Email"]') as HTMLInputElement;
      const passwordInput = signUpForm.querySelector('input[placeholder="Password"]') as HTMLInputElement;
      const phoneInput = signUpForm.querySelector('input[placeholder="Phone"]') as HTMLInputElement;

      try {
        const response = await axios.post('/api/auth/signup', {
          username: usernameInput.value.trim(),
          email: emailInput.value.trim(),
          password: passwordInput.value.trim(),
          phone: phoneInput.value.trim(),
        });

        if (response.status === 201) {
          console.log('Sign-up successful!');
          alert('Sign-up successful! Please sign in.');
        }
      } catch (error) {
        console.error('Sign-up error:', error);
        alert('Sign-up failed. Please try again.');
      }
    });
  }

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = (document.querySelector('input[placeholder="Email"]') as HTMLInputElement).value;
    const password = (document.querySelector('input[placeholder="Password"]') as HTMLInputElement).value;

    try {
      const response = await axios.post('/api/auth/signin', { email, password });

      if (response.status === 200) {
        const { userId, username } = response.data.user;

        if (!username) {
          console.error('Username is missing in the API response', response.data);
          alert('Login failed. Please try again.');
          return;
        }

        // Store user data in localStorage
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);

        // Display the username
        document.getElementById('username-display')!.innerText = `Welcome, ${username}`;
        document.getElementById('username-display')!.style.display = 'block';

        // Redirect to the homepage
        window.location.href = 'index.html';
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Sign-in failed. Please try again.');
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    logout();
  });
}

window.addEventListener('load', () => {
  const username = localStorage.getItem('username');
  const usernameDisplay = document.getElementById('username-display');

  if (username && usernameDisplay) {
    usernameDisplay.innerText = `Welcome, ${username}`;
    usernameDisplay.style.display = 'block';
  } else if (usernameDisplay) {
    usernameDisplay.style.display = 'none';
  }
});

}

// Logout Function
export function logout() {
  // Clear localStorage
  localStorage.removeItem('userId');
  localStorage.removeItem('username');

  // Update UI and redirect
  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay) {
    usernameDisplay.style.display = 'none';
  }
  alert('You have been logged out.');
  window.location.href = 'index.html';
}
