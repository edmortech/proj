// log-reg.js - Handles login/registration form logic and hash-based routing display
import getServerIP from './serveriip.js'; // Ensure this path is correct

document.addEventListener('DOMContentLoaded', async () => {

    // Select container and form elements
    const authContainer = document.querySelector('.auth-container-page');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const registerMessageDiv = document.getElementById('register-message');
    const loginMessageDiv = document.getElementById('login-register-message');

    // Fetch backend URL
    let backendUrl;
    try {
        backendUrl = await getServerIP();
        if (!backendUrl) {
            console.error("Failed to fetch backend URL.");
            if(registerMessageDiv) registerMessageDiv.textContent = "Error: Cannot reach server configuration.";
            if(loginMessageDiv) loginMessageDiv.textContent = "Error: Cannot reach server configuration.";
        } else {
             console.log("Backend URL:", backendUrl);
        }
    } catch (error) {
        console.error("Error fetching server IP:", error);
        if(registerMessageDiv) registerMessageDiv.textContent = "Error: Failed fetching server config.";
        if(loginMessageDiv) loginMessageDiv.textContent = "Error: Failed fetching server config.";
    }

    // --- Hash-Based Routing Logic ---

    // Map hash values (without '#') to the target sections
    const routeTargets = {
        'login': document.getElementById('login-section'),
        'register': document.getElementById('register-section')
    };

    // Hides the container and the specific sections within it
    function hideAllRoutedSections() {
        Object.values(routeTargets).forEach(section => {
            if (section) section.classList.remove('active');
        });
        if (authContainer) authContainer.classList.remove('active');
    }

    // Shows the container and the correct section based on the current URL hash
    function showSectionFromHash() {
        const currentHash = window.location.hash.slice(1) || ''; // Get hash value ('login', 'register', or '')
        const activeSection = routeTargets[currentHash];

        hideAllRoutedSections(); // Hide everything first

        if (activeSection && authContainer) {
            activeSection.classList.add('active'); // Show the target section
            authContainer.classList.add('active'); // Show the container
        }
        // If hash is empty or invalid, the container remains hidden
    }

    // --- Routing Event Listeners ---
    window.addEventListener('hashchange', showSectionFromHash); // Listen for hash changes
    showSectionFromHash(); // Check hash on initial page load

    // --- Form Submission Logic ---

    // Registration Form
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!backendUrl) { if(registerMessageDiv) registerMessageDiv.textContent = "Error: Server connection failed."; return; }

            const username = document.getElementById('register-username')?.value;
            const email = document.getElementById('register-email')?.value;
            const password = document.getElementById('register-password')?.value;
            const fullName = document.getElementById('register-fullName')?.value;
            const phoneNumber = document.getElementById('register-phoneNumber')?.value;
            const confirmPassword = document.getElementById('register-confirmPassword')?.value;

            const usernameError = document.getElementById('register-username-error');
            const passwordError = document.getElementById('register-confirmPassword-error');
            const phoneError = document.getElementById('register-phoneNumber-error');

            // Clear previous errors/messages
            if(usernameError) usernameError.textContent = '';
            if(passwordError) passwordError.textContent = '';
            if(phoneError) phoneError.textContent = '';
            if(registerMessageDiv) {
                registerMessageDiv.textContent = '';
                registerMessageDiv.classList.remove('error');
            }

            // Client-side validation
            let isValid = true;
            if (password !== confirmPassword) { if(passwordError) passwordError.textContent = 'Passwords do not match.'; isValid = false; }
            if (!/^\d{10}$/.test(phoneNumber)) { if(phoneError) phoneError.textContent = 'Phone number must be 10 digits.'; isValid = false; }
            // Add more validation as needed (e.g., password complexity)
            if (!isValid) return;

            try {
                const response = await fetch(`${backendUrl}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, email, fullName, phoneNumber })
                });
                const data = await response.json();

                if (response.ok) {
                    if(registerMessageDiv) registerMessageDiv.textContent = data.message + " Redirecting to login...";
                    // Navigate to login view using hash change after a delay
                    setTimeout(() => { window.location.hash = '#login'; }, 1500);
                } else {
                     if(registerMessageDiv) {
                        registerMessageDiv.textContent = `Error: ${data.message || response.statusText}`;
                        registerMessageDiv.classList.add('error'); // Style as error
                     }
                     if (data.message?.toLowerCase().includes('username already exists') && usernameError) {
                        usernameError.textContent = 'Username already taken.';
                     }
                     // Handle other potential errors (e.g., invalid email format from backend)
                }
            } catch (error) {
                console.error("Registration fetch error:", error);
                if(registerMessageDiv) {
                    registerMessageDiv.textContent = `Error: ${error.message || 'Network request failed'}`;
                    registerMessageDiv.classList.add('error');
                }
            }
        });
    } else { console.warn("Register form (#registerForm) not found."); }

    // Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!backendUrl) { if(loginMessageDiv) loginMessageDiv.textContent = "Error: Server connection failed."; return; }

            const userInput = document.getElementById('userInput')?.value;
            const password = document.getElementById('password')?.value;

            // Clear previous message
             if(loginMessageDiv) {
                loginMessageDiv.textContent = '';
                loginMessageDiv.classList.remove('error');
             }

            try {
                const response = await fetch(`${backendUrl}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usernameOrEmail: userInput, password }) // Backend expects this structure
                });
                const data = await response.json();

                if (response.ok && data.token) {
                    if(loginMessageDiv) loginMessageDiv.textContent = 'Login successful';

                    // Store user data in localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('loggedInUser', data.username || userInput); // Prefer username from response
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('userRole', data.role || 'user'); // Store role

                    // Update navbar immediately if possible
                    if (typeof updateNavbarBasedOnLoginState === 'function') {
                        updateNavbarBasedOnLoginState();
                    }

                    // Redirect to appropriate dashboard (leaves hash routing)
                    const userRole = data.role || 'user';
                    window.location.href = (userRole === 'admin') ? 'admin.html' : 'dashboard.html';

                } else {
                     if(loginMessageDiv) {
                        loginMessageDiv.textContent = `Login Error: ${data.message || 'Invalid credentials or server error'}`;
                        loginMessageDiv.classList.add('error');
                     }
                    console.log(`Login failed: ${data.message || response.statusText}`);
                }
            } catch (error) {
                console.error("Login fetch error:", error);
                 if(loginMessageDiv) {
                    loginMessageDiv.textContent = `Login Error: ${error.message || 'Network request failed'}`;
                    loginMessageDiv.classList.add('error');
                 }
            }
        });
     } else { console.warn("Login form (#loginForm) not found."); }

}); // End DOMContentLoaded