// --- START OF FILE dashbackup.js ---

import getServerIP from './serveriip.js'; // Import the function to get the backend URL

let backendUrl; // Variable to store the fetched backend URL

// Define createBookingTable in a scope accessible after backendUrl is set
let createBookingTable;

// --- Helper Functions --- (Minimal needed based on original code's direct usage)
function getToken() { return localStorage.getItem('token'); }
function getUserId() { return localStorage.getItem('userId'); }


// --- Global Event Listener (Main Entry Point) ---

document.addEventListener('DOMContentLoaded', async () => {
    // --- Fetch Backend URL ---
    try {
        backendUrl = await getServerIP(); // Assign to the outer scope variable

        if (!backendUrl) {
            console.error("FATAL: Could not retrieve backend URL.");
            document.body.innerHTML = '<p style="color: red; padding: 20px;"><strong>Critical Error:</strong> Cannot connect to server.</p>';
            return; // Stop further execution
        }
        // console.log("Using backend URL:", backendUrl); // Keep if needed

        // --- Authentication Check ---
        const token = getToken();
        const userId = getUserId();
        if (!token || !userId) {
            console.warn("Auth check failed: No token or userId. Stopping dashboard script.");
            document.body.innerHTML = '<p style="color: orange; padding: 20px;">Access Denied. Please <a href="project.html">log in</a>.</p>'; // Adjust link
            return;
        }

        // --- Execute Original Code Sections (Inside the main listener now) ---

        // --- Section 1: Welcome Message, Generic Close Buttons, Payment Popup Setup (from first listener) ---

        // Display welcome message
        const loggedInUser = localStorage.getItem('loggedInUser');
        const welcomeMessage = `<h2>Welcome Back, ${loggedInUser || 'User'}!</h2>`;
        const dashboardContentDiv = document.getElementById('dashboard-content');
        if (dashboardContentDiv) {
            // Using innerHTML as per original, ensure this doesn't wipe other content if needed
            // dashboardContentDiv.insertAdjacentHTML('afterbegin', welcomeMessage); // Alternative
             dashboardContentDiv.innerHTML = welcomeMessage;
        } else {
            console.error("dashboard-content div not found!");
        }

        // Generic section close buttons
        const closeSectionButtons = document.querySelectorAll('.close-section-btn');
        closeSectionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sectionId = this.dataset.section;
                const section = document.getElementById(sectionId);
                if (section) section.style.display = 'none';
                else console.warn(`Target section '#${sectionId}' not found for close button.`);
            });
        });

        // Payment method popup add/close setup
        const addPaymentPopup = document.getElementById('add-payment-method-popup');
        const overlay = document.getElementById('overlay');
        // Note: Original code had two separate close buttons, consolidating slightly
        const closePopupButtons = document.querySelectorAll('#add-payment-methods-section .close-btn, #add-payment-method-popup .close-btn'); // Select both potential close buttons
        const addPaymentMethodButton = document.getElementById('addPaymentMethodButton');
        const addPaymentMethodBtn = document.getElementById('add-payment-method-btn'); // The duplicated button ID

        const showPaymentMethodPopup = () => {
            if (addPaymentPopup && overlay) {
                addPaymentPopup.style.display = 'block';
                overlay.style.display = 'block';
            } else { console.error("Cannot show Add Payment popup - elements missing."); }
        };

        const hidePaymentMethodPopup = () => {
            if (addPaymentPopup) addPaymentPopup.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
        };

        if (addPaymentMethodButton) addPaymentMethodButton.addEventListener('click', showPaymentMethodPopup);
        if (addPaymentMethodBtn) addPaymentMethodBtn.addEventListener('click', showPaymentMethodPopup); // Handle both buttons
        closePopupButtons.forEach(btn => { if(btn) btn.addEventListener('click', hidePaymentMethodPopup); });
        if (overlay) {
            overlay.addEventListener('click', function(event) {
                // Close ONLY if clicking overlay itself AND the add payment popup is visible
                 if (event.target === overlay && addPaymentPopup?.style.display === 'block') {
                    hidePaymentMethodPopup();
                 }
                 const profilePopup = document.getElementById('profile-popup');
                 if (event.target === overlay && profilePopup?.classList.contains('visible')) {
                     profilePopup.classList.remove('visible');
                     const profileOverlay = document.getElementById('profile-popup-overlay');
                     if(profileOverlay) profileOverlay.classList.remove('visible');
                 }
            });
        }


        // --- Profile Popup Open/Close Setup (from second listener) ---
        const openProfileButton = document.getElementById('openProfileButton');
        const closeProfileButton = document.getElementById('closeProfileButton');
        const profilePopup = document.getElementById('profile-popup');
        const profilePopupOverlay = document.getElementById('profile-popup-overlay');

        // Function to open the popup (used by listener)
        function openProfilePopup() {
            if(profilePopup && profilePopupOverlay) {
                profilePopup.classList.add('visible');
                profilePopupOverlay.classList.add('visible');
            } else { console.error("Cannot open profile popup - elements missing."); }
        }

        // Function to close the popup (used by listener)
        function closeProfilePopup() {
             if(profilePopup && profilePopupOverlay) {
                profilePopup.classList.remove('visible');
                profilePopupOverlay.classList.remove('visible');
                 // Reset edit state if needed
                 const editProfileButton = document.getElementById('editProfileButton');
                 if (editProfileButton && editProfileButton.textContent === 'Update Profile') {
                     const fullNameInput = document.getElementById('profile-fullName'); if(fullNameInput) fullNameInput.disabled = true;
                     const phoneInput = document.getElementById('profile-phoneNumber'); if(phoneInput) phoneInput.disabled = true;
                     editProfileButton.textContent = 'Edit Profile'; editProfileButton.disabled = false;
                }
            }
        }

        // Event listeners to open and close
        if (openProfileButton) openProfileButton.addEventListener('click', openProfilePopup);
        // Close button listener might be redundant if it has class 'close-section-btn' and data-section='profile-popup'
        if (closeProfileButton) closeProfileButton.addEventListener('click', closeProfilePopup);

        // --- Profile Data, Bookings, Payment Methods  ---
 // Fetch initial profile data
 //use token and userid from initial check
        fetch(`${backendUrl}/api/user`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'userid': userId
            }
        })
        .then(response => {
            if (!response.ok) { throw new Error(`HTTP error ${response.status}`); }
            return response.json();
        })
        .then(userData => {
            const usernameEl = document.getElementById('profile-username'); if (usernameEl) usernameEl.value = userData.username || '';
            const emailEl = document.getElementById('profile-email'); if (emailEl) emailEl.value = userData.email || '';
            const fullNameEl = document.getElementById('profile-fullName'); if (fullNameEl) fullNameEl.value = userData.full_names || '';
            const phoneEl = document.getElementById('profile-phoneNumber'); if (phoneEl) phoneEl.value = userData.phone_number || '';
        })
        .catch(error => {
            console.error('Error fetching initial user data:', error);
            alert(`Failed to load profile data: ${error.message}`);
            const fullNameEl = document.getElementById('profile-fullName'); if (fullNameEl) fullNameEl.value = 'Error';
            const phoneEl = document.getElementById('profile-phoneNumber'); if (phoneEl) phoneEl.value = 'Error';
        });

        // Edit Profile button functionality
        const editProfileButton = document.getElementById('editProfileButton'); 
        if (editProfileButton) {
            editProfileButton.addEventListener('click', function() {
                const fullNameInput = document.getElementById('profile-fullName');
                const phoneInput = document.getElementById('profile-phoneNumber');
                if (!fullNameInput || !phoneInput) { console.error("Profile input elements missing."); return; }

                if (this.textContent === 'Edit Profile') {
                    fullNameInput.disabled = false; phoneInput.disabled = false;
                    fullNameInput.focus(); this.textContent = 'Update Profile';
                } else if (this.textContent === 'Update Profile') {
                    const updatedData = { full_names: fullNameInput.value, phone_number: phoneInput.value };
                    if (!updatedData.full_names.trim()) { alert("Full Name cannot be empty."); return; }

                    this.textContent = "Updating..."; this.disabled = true;

                    fetch(`${backendUrl}/api/user`, { // <--- URL UPDATED
                        method: 'PUT',
                        headers: { // Rebuild headers based on original requirements
                             'Content-Type': 'application/json',
                             'Authorization': 'Bearer ' + getToken(), // Get fresh token
                             'userid': getUserId() // Get fresh userId
                        },
                        body: JSON.stringify(updatedData)
                    })
                    .then(response => {
                        if (response.ok) {
                            fullNameInput.disabled = true; phoneInput.disabled = true;
                            editProfileButton.textContent = 'Edit Profile'; alert("Profile Updated!");
                        } else {
                            console.error('Error updating profile:', response.status); alert(`Error updating profile (${response.status}).`);
                            editProfileButton.textContent = 'Update Profile';
                        }
                    })
                    .catch(error => { console.error('Error updating profile:', error); alert(`Error: ${error.message}.`); editProfileButton.textContent = 'Update Profile'; })
                    .finally(() => { this.disabled = false; });
                }
            });
        } else { console.warn("editProfileButton not found."); }

        // Booking Table Logic (Define and Call)
        createBookingTable = async function() {
            const bookingsContent = document.getElementById('bookings-content');
            if (!bookingsContent) { console.error("BOOKINGS ERROR: bookings-content not found."); return; }
            bookingsContent.innerHTML = '<p>Loading bookings...</p>';

            const table = document.createElement('table'); table.classList.add('reservation-table');
            const thead = document.createElement('thead');
            table.appendChild(thead);
            const tbody = document.createElement('tbody'); tbody.id = 'bookings-table-body'; table.appendChild(tbody);

            try {
                const currentUserId = getUserId(); // Get fresh userId/token
                const currentToken = getToken();
                if (!currentUserId || !currentToken) { throw new Error("Auth details missing."); }

                const response = await fetch(`${backendUrl}/api/booking/${currentUserId}`, { 
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                if (!response.ok) { throw new Error(`HTTP error ${response.status}`); }
                const reservations = await response.json();

                bookingsContent.innerHTML = ''; bookingsContent.appendChild(table); // Add table structure

                if (reservations && reservations.length > 0) {
                    reservations.forEach(reservation => {
                        const row = tbody.insertRow();
                        const startDate = reservation.start_date ? new Date(reservation.start_date).toLocaleDateString() : 'N/A';
                        const endDate = reservation.end_date ? new Date(reservation.end_date).toLocaleDateString() : 'N/A';
                        row.innerHTML = `
                            <td data-label="Location Name">${reservation.location_name || 'N/A'}</td>
                            <td data-label="Address">${reservation.location_address || 'N/A'}</td>
                            <td data-label="Lot Number">${reservation.lot_number || 'N/A'}</td>
                            <td data-label="Start Date">${startDate}</td>
                            <td data-label="End Date">${endDate}</td>
                            <td data-label="Enter After">${reservation.enter_after || 'N/A'}</td>
                            <td data-label="Exit Before">${reservation.exit_before || 'N/A'}</td>
                            <td data-label="Actions"><button class="cancel-button" data-reservation-id="${reservation.reservation_id}">Cancel</button></td>
                        `;
                    });
                    tbody.querySelectorAll('.cancel-button').forEach(button => {
                         button.addEventListener('click', handleCancelBooking); // Use named handler
                    });
                } else { tbody.innerHTML = '<tr><td colspan="8">You have no active bookings.</td></tr>'; }
            } catch (error) {
                console.error('Error in createBookingTable:', error);
                bookingsContent.innerHTML = `<p style="color: red;">Error loading bookings: ${error.message}.</p>`;
            }
        } // End definition of createBookingTable

        // Define the cancel handler separately
        async function handleCancelBooking(event) {
            const button = event.target; const reservationId = button.dataset.reservationId;
            const currentToken = getToken();
            if (!currentToken) { alert("Auth error."); return; }
            if (!confirm(`Are you sure?`)) return;
            button.textContent = "Cancelling..."; button.disabled = true;
            try {
                const deleteResponse = await fetch(`${backendUrl}/api/booking/${reservationId}`, { // <--- URL UPDATED
                    method: 'DELETE', headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                if (deleteResponse.ok) {
                    alert("Reservation Cancelled.");
                    if (typeof createBookingTable === 'function') createBookingTable(); // Refresh
                    else console.error("Cannot refresh bookings, createBookingTable not defined.");
                } else {
                     let errorMsg = `Failed to cancel (${deleteResponse.status})`;
                     try{ const err = await deleteResponse.json(); errorMsg += `: ${err.message||'Server error'}`; } catch(e){}
                    console.error(errorMsg); alert(errorMsg); button.textContent = "Cancel";
                }
            } catch (error) { console.error('Error cancelling reservation:', error); alert(`Error: ${error.message}.`); button.textContent = "Cancel"; }
            finally { button.disabled = false; }
        }

        // Call createBookingTable for initial load
        if (typeof createBookingTable === 'function') createBookingTable();
        else console.error("createBookingTable was not defined before initial call.");


        // Payment Methods Logic 
        const methodNameSelect = document.getElementById('method-name');
        const providerSelect = document.getElementById('provider');
        const allowedMethodNames = ["Mobile Money", "Credit Card", "Bank Transfer", "PayPal"];
        const allowedProviders = {
              "Mobile Money": ["M-Pesa (Kenya)", "Airtel Money (Kenya)"],
              "Credit Card": ["Visa", "Mastercard", "American Express"],
              "Bank Transfer": ["Equity Bank (Kenya)", "Co-operative Bank (Kenya)", "Standard Chartered (Kenya)", "Absa Bank (South Africa)", "Ecobank (Pan-African)"],
              "PayPal": ["PayPal"]
            };

        // Populate Dropdowns
        if (methodNameSelect && providerSelect){
            allowedMethodNames.forEach(method => { methodNameSelect.add(new Option(method, method)); });
            methodNameSelect.addEventListener('change', function () {
                providerSelect.innerHTML = ''; // Clear previous options
                const selectedMethod = this.value;
                if (allowedProviders[selectedMethod]) {
                    allowedProviders[selectedMethod].forEach(provider => { providerSelect.add(new Option(provider, provider)); });
                }
            });
            methodNameSelect.dispatchEvent(new Event('change')); // Trigger initial population
        } else { console.warn("Payment method select dropdowns not found."); }

        // Fetch existing payment methods
        fetch(`${backendUrl}/paymentMethods?user_id=${userId}`, { // <--- URL UPDATED
            headers: { 'Authorization': 'Bearer ' + token } // Use initial token/userId
          })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.json();
        })
        .then(paymentMethods => {
            const paymentMethodsContainer = document.getElementById('payment-methods-list');
            if (!paymentMethodsContainer) { console.error("payment-methods-list container not found."); return; }

            const table = document.createElement('table'); table.classList.add('payment-methods-table');
            const thead = document.createElement('thead'); /* ... create header ... */ table.appendChild(thead);
            const tbody = document.createElement('tbody'); table.appendChild(tbody);

            if (paymentMethods && paymentMethods.length > 0) {
                paymentMethods.forEach(method => {
                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td data-column="Method Name">${method.method_name || 'N/A'}</td>
                        <td data-column="Provider">${method.provider || 'N/A'}</td>
                        <td data-column="Account Number" class="account-number-cell">****${(method.account_number || '').slice(-4)}</td>
                        <td>
                            <button class="edit-payment-btn" data-method-id="${method.id}">Edit</button>
                            <button class="delete-payment-btn" data-method-id="${method.id}">Delete</button>
                        </td>
                    `;
                });
            } else { tbody.innerHTML = '<tr><td colspan="4">No methods found.</td></tr>'; }

            paymentMethodsContainer.innerHTML = ''; // Clear previous
            paymentMethodsContainer.appendChild(table);

            // Attach Edit listeners
            paymentMethodsContainer.querySelectorAll('.edit-payment-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const methodId = this.dataset.methodId;
                    const row = this.closest('tr');
                    const accountNumberCell = row?.querySelector('.account-number-cell');
                    if (!accountNumberCell || this.textContent === 'Save') return; // Already editing or cell missing

                    const originalValue = accountNumberCell.textContent; // Store original masked value
                    // Find original full number (requires storing it somehow, e.g., find matching method in paymentMethods array)
                    const currentMethod = paymentMethods.find(m => m.id == methodId);
                    const fullNumber = currentMethod ? currentMethod.account_number : '';

                    accountNumberCell.innerHTML = `<input type="text" value="${fullNumber}" class="edit-account-number" style="width:80%;" />`;
                    const inputElement = accountNumberCell.querySelector('input'); inputElement?.focus();
                    this.textContent = 'Save';
                    const deleteBtn = row.querySelector('.delete-payment-btn'); if(deleteBtn) deleteBtn.style.display='none';
                    // Add Cancel button dynamically or change Delete button to Cancel? Simpler: change Save back to Edit on fail.

                    const saveListener = async () => {
                        const updatedAccountNumber = inputElement.value;
                        if (!/^\d+$/.test(updatedAccountNumber)) { alert("Digits only."); inputElement.focus(); return; }

                        this.textContent = "Saving..."; this.disabled = true;
                        try {
                            const saveResponse = await fetch(`${backendUrl}/paymentMethods/${methodId}`, { // <--- URL UPDATED
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
                                body: JSON.stringify({ account_number: updatedAccountNumber })
                            });
                            if (saveResponse.ok) {
                                accountNumberCell.textContent = '****' + updatedAccountNumber.slice(-4);
                                button.textContent = 'Edit';
                                // Ideally, refresh the whole payment methods list for consistency
                                // fetchAndDisplayPaymentMethods();
                            } else {
                                console.error('Error updating payment method:', saveResponse.status); alert('Failed to update.');
                                accountNumberCell.textContent = originalValue; // Revert on fail
                                button.textContent = 'Edit';
                            }
                        } catch (error) {
                            console.error('Error updating payment method:', error); alert('Error updating.');
                            accountNumberCell.textContent = originalValue; button.textContent = 'Edit';
                        } finally {
                             button.disabled = false;
                             // Remove this specific listener to prevent multiple saves
                             button.removeEventListener('click', saveListener);
                             // Re-attach the main edit listener (complex, easier to refresh list)
                             if (deleteBtn) deleteBtn.style.display='inline-block';
                        }
                    };
                    button.addEventListener('click', saveListener, { once: true });
                });
            });

            // Attach Delete listeners
            paymentMethodsContainer.querySelectorAll('.delete-payment-btn').forEach(button => {
                button.addEventListener('click', async function () {
                    const methodId = this.dataset.methodId;
                    const row = this.closest('tr');
                    if (!confirm("Are you sure you want to delete this method?")) return;

                    this.textContent = "Deleting..."; this.disabled = true;
                    const editBtn = row.querySelector('.edit-payment-btn'); if(editBtn) editBtn.disabled=true;

                    try {
                        const deleteResponse = await fetch(`${backendUrl}/paymentMethods/${methodId}`, { // <--- URL UPDATED
                            method: 'DELETE',
                            headers: { 'Authorization': 'Bearer ' + getToken() }
                        });
                        if (deleteResponse.ok) {
                            row.remove(); alert("payment Method deleted successfully.");
                           
                        } else {
                            console.error(`Failed to delete method ${methodId}: ${deleteResponse.status}`); alert('Failed to delete.');
                            this.textContent = "Delete"; // Restore text
                        }
                    } catch (error) {
                        console.error('Error deleting method:', error); alert('Error deleting.');
                        this.textContent = "Delete"; 
                    } finally {
                         this.disabled = false; if(editBtn) editBtn.disabled=false;
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching payment methods:', error);
            const container = document.getElementById('payment-methods-list');
            if (container) container.innerHTML = `<p style="color: red;">Error loading payment methods.</p>`;
        });

        // Add Payment Method Form Submission
        const paymentMethodForm = document.getElementById('payment-method-form');
        if (paymentMethodForm && methodNameSelect && providerSelect) { // Check selects exist too
            paymentMethodForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const currentUserId = getUserId(); // Get fresh ID
                const currentToken = getToken(); // Get fresh token
                if (!currentUserId || !currentToken) { alert("Auth error."); return; }

                const methodName = methodNameSelect.value;
                const provider = providerSelect.value;
                const accountNumber = document.getElementById('account-number').value;
                if (!methodName || !provider || !accountNumber || !/^\d+$/.test(accountNumber)) { alert('Please complete all fields correctly.'); return; }

                const submitBtn = this.querySelector('button[type="submit"]');
                if(submitBtn) { submitBtn.textContent="Adding..."; submitBtn.disabled=true; }

                fetch(`${backendUrl}/addPaymentMethod`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + currentToken },
                  body: JSON.stringify({ user_id: currentUserId, method_name: methodName, provider: provider, account_number: accountNumber })
                })
                .then(response => {
                    if (response.ok) {
                      alert('Payment method added successfully.');
                      hidePaymentMethodPopup(); // Close popup
                   
                    } else {
                      console.error('Error adding payment method:', response.status);
                      alert(`Error adding method (${response.status}).`);
                    }
                })
                .catch(error => { console.error('Error adding payment method:', error); alert(`Error: ${error.message}`); })
                .finally(() => { if(submitBtn) { submitBtn.textContent="Add Payment Method"; submitBtn.disabled=false; } });
            });
        } else { console.warn("Payment method form or selects not found."); }

        // --- End of Section 3 ---

    } catch (error) {
        console.error("CRITICAL ERROR during dashboard initialization:", error);
        document.body.innerHTML = `<p style="color: red; padding: 20px;"><strong>Critical Error:</strong> Dashboard failed to load (${error.message}).</p>`;
    }
});
