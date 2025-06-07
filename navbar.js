// navbar.js - Handles navbar generation, toggle, and logged-in popup interactions

// Toggles the mobile navbar view
function toggleNavbar() {
    const navbarLinks = document.querySelector('.navbar-links');
    if (navbarLinks) {
        navbarLinks.classList.toggle('active');
    } else {
        console.error("Navbar links container (.navbar-links) not found.");
    }
}

// Closes the mobile navbar if a click occurs outside of it
function closeNavbarOnClickOutside(event) {
    const navbarLinks = document.querySelector('.navbar-links');
    const hamburger = document.querySelector(".hamburger");
    // Check elements exist & click is outside navbar and hamburger
    if (navbarLinks && hamburger &&
        navbarLinks.classList.contains('active') && // Only close if active
        !navbarLinks.contains(event.target) &&
        !hamburger.contains(event.target))
    {
        navbarLinks.classList.remove('active');
    }
}
document.addEventListener('click', closeNavbarOnClickOutside);

// Closes popups specific to logged-in users (Profile, Bookings, Payments)
function closeLoggedInUserPopups() {
    const popupsToClose = [
        { popup: document.getElementById('profile-popup'), overlay: document.getElementById('profile-popup-overlay') },
        { popup: document.getElementById('bookings-popup'), overlay: document.getElementById('bookings-popup-overlay') },
        { popup: document.getElementById('payment-methods-popup'), overlay: document.getElementById('payment-methods-popup-overlay') }
        // Add other logged-in specific popups here if needed
    ];

    popupsToClose.forEach(item => {
        if (item.popup) item.popup.classList.remove('visible');
        if (item.overlay) item.overlay.classList.remove('visible');
    });

    // Optionally close the mobile navbar when a popup closes
    // const navbarLinks = document.querySelector('.navbar-links');
    // if (navbarLinks) navbarLinks.classList.remove('active');
}

// Updates the navbar content based on login status from localStorage
function updateNavbarBasedOnLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navbarLinks = document.querySelector('.navbar-links');
    const navbarButtons = document.querySelector('.navbar-buttons');

    if (!navbarLinks || !navbarButtons) {
        console.error("Navbar containers (.navbar-links or .navbar-buttons) not found.");
        return;
    }

    if (isLoggedIn) {
        // --- Logged-in state ---
        // Determine base path for hash links depending on current page
        const basePage = window.location.pathname.includes('dashboard.html') ? '' : 'project.html';
        navbarLinks.innerHTML = `
            <a href="dashboard.html">Dashboard</a>
            <a href="#" id="myProfileLink">My Profile</a>
            <a href="#" id="myBookingsLink">My Bookings</a>
            <a href="#" id="paymentMethodsLink">Payment Methods</a>
            <a href="${basePage}#how-it-works-section">How It Works</a>
            <a href="${basePage}#contact">Contacts</a>
        `;
        navbarButtons.innerHTML = `<button id="logoutBtn" class="logout-button">Logout</button>`;

        // Add Logout button listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                // Clear all relevant session data
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('loggedInUser');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userRole');
                window.location.href = 'project.html'; // Redirect to home page
            });
        } else { console.warn("Logout button (#logoutBtn) not found after generating navbar."); }

        // Add listeners for Profile, Bookings, Payment Methods links
        const myProfileLink = document.getElementById('myProfileLink');
        const myBookingsLink = document.getElementById('myBookingsLink');
        const paymentMethodsLink = document.getElementById('paymentMethodsLink');

        if (myProfileLink) {
            myProfileLink.addEventListener('click', function(event) {
                event.preventDefault();
                closeLoggedInUserPopups(); // Close others first
                const profilePopup = document.getElementById('profile-popup');
                const profilePopupOverlay = document.getElementById('profile-popup-overlay');
                if(profilePopup) profilePopup.classList.add('visible');
                if(profilePopupOverlay) profilePopupOverlay.classList.add('visible');
                // Add function call here to load profile data if needed: loadProfileData();
            });
        } else { console.warn("My Profile link (#myProfileLink) not found."); }

        if (myBookingsLink) {
            myBookingsLink.addEventListener('click', function(event) {
                event.preventDefault();
                closeLoggedInUserPopups();
                const bookingsPopup = document.getElementById('bookings-popup');
                const bookingsPopupOverlay = document.getElementById('bookings-popup-overlay');
                 // Assumes createBookingTable is globally available or imported
                 if (typeof createBookingTable === 'function') {
                    createBookingTable(); // Populate the table before showing
                 } else {
                    console.warn("createBookingTable function not found or accessible.");
                 }
                if (bookingsPopup) bookingsPopup.classList.add('visible');
                if (bookingsPopupOverlay) bookingsPopupOverlay.classList.add('visible');
            });
        } else { console.warn("My Bookings link (#myBookingsLink) not found."); }

         if (paymentMethodsLink) {
            paymentMethodsLink.addEventListener('click', function(event) {
                event.preventDefault();
                closeLoggedInUserPopups();
                const paymentMethodsPopup = document.getElementById('payment-methods-popup');
                const paymentMethodsPopupOverlay = document.getElementById('payment-methods-popup-overlay');
                 // Add function call here to load payment methods if needed: loadPaymentMethods();
                if(paymentMethodsPopup) paymentMethodsPopup.classList.add('visible');
                if(paymentMethodsPopupOverlay) paymentMethodsPopupOverlay.classList.add('visible');
            });
        } else { console.warn("Payment Methods link (#paymentMethodsLink) not found."); }

    } else {
        // --- Logged-out state ---
        // Generate links using hashes (#) - no extra JS needed for these links
        navbarLinks.innerHTML = `
            <a href="project.html">Home</a>
            <a href="#how-it-works-section">How It Works</a>
            <a href="#contact">Contacts</a>
            <a href="#register" class="login-button route-link">Sign Up</a> 
        `;
        navbarButtons.innerHTML = `
            <a href="#login" class="login-button route-link">Login</a>
        `;
    }
}

// --- Run on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
    // Set the initial state of the navbar on page load
    updateNavbarBasedOnLoginState();

    // --- Setup Listeners for Closing Logged-in Popups ---
    const closeProfileButton = document.getElementById('closeProfileButton');
    const profilePopupOverlay = document.getElementById('profile-popup-overlay');
    const closeBookingsButton = document.getElementById('closeBookingsButton');
    const bookingsPopupOverlay = document.getElementById('bookings-popup-overlay');
    const closePaymentMethodsButton = document.getElementById('closePaymentMethodsButton');
    const paymentMethodsPopupOverlay = document.getElementById('payment-methods-popup-overlay');

    // Helper to add listeners if elements exist
    const setupCloseListener = (button, overlay) => {
        if (button) button.addEventListener('click', closeLoggedInUserPopups);
        else console.warn(`Close button for a logged-in popup not found.`);
        if (overlay) overlay.addEventListener('click', closeLoggedInUserPopups);
        else console.warn(`Overlay for a logged-in popup not found.`);
    };
    setupCloseListener(closeProfileButton, profilePopupOverlay);
    setupCloseListener(closeBookingsButton, bookingsPopupOverlay);
    setupCloseListener(closePaymentMethodsButton, paymentMethodsPopupOverlay);

    // --- Package Selection Logic ---
    const packageOptions = document.querySelectorAll('.package-option');
    packageOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            packageOptions.forEach(opt => opt.classList.remove('active')); // Deselect others
            event.target.classList.add('active'); // Select clicked one
            // Optional: Do something with the selected package immediately
            // console.log("Selected package:", event.target.dataset.package);
        });
    });

    // --- Admin Check & Redirect ---
    // Checks if user is admin based on localStorage token and redirects if necessary
    function checkAdminAndRedirect() {
        const token = localStorage.getItem('token');
        const currentFilename = window.location.pathname.split('/').pop(); // Get e.g., 'project.html'

        // Only check if we have a token and are NOT already on admin.html
        if (token && currentFilename !== 'admin.html') {
            try {
                // Basic JWT decode (use a library for production for better validation)
                const payloadBase64 = token.split('.')[1];
                const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
                const payload = JSON.parse(payloadJson);

                // Check role from token
                if (payload && payload.role === 'admin') {
                    console.log("Admin user detected, redirecting to admin.html");
                    window.location.href = 'admin.html'; // Perform redirect
                }
            } catch (error) {
                console.error("Error decoding token or checking admin status:", error);
                // Could indicate invalid token, log out potentially?
                // localStorage.clear(); updateNavbarBasedOnLoginState(); // Example
            }
        }
    }
    // Run the check when the DOM is ready
    checkAdminAndRedirect();

}); // End DOMContentLoaded