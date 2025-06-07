// Import the function to get the server URL (ensure HTML uses type="module")
import getServerIP from './serveriip.js';

document.addEventListener('DOMContentLoaded', async function() {
    let backendUrl;

    // --- 1. Initialization: Get Backend URL ---
    try {
        backendUrl = await getServerIP();
        if (!backendUrl) throw new Error("Backend URL not retrieved");
        console.log("Using backend URL:", backendUrl);
    } catch (error) {
        console.error("CRITICAL: Could not get server URL.", error);
        document.getElementById('dashboard-content').innerHTML = `<h2>Initialization Error</h2><p>Could not determine the server address.</p>`;
        return; // Stop execution
    }

    // --- Get Common DOM Elements ---
    const dashboardContentDiv = document.getElementById('dashboard-content');
    const addPaymentMethodPopup = document.getElementById('add-payment-method-popup');
    const profilePopup = document.getElementById('profile-popup');
    const overlay = document.getElementById('overlay');
    const profilePopupOverlay = document.getElementById('profile-popup-overlay'); // Assuming separate overlay for profile? If not, remove.
    const paymentMethodsContainer = document.getElementById('payment-methods-list');
    const bookingsContent = document.getElementById('bookings-content');
    const paymentMethodForm = document.getElementById('payment-method-form');
    const methodNameSelect = document.getElementById('method-name');
    const providerSelect = document.getElementById('provider');

    // --- Helper: Get Auth Token ---
    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token) console.warn("Authentication token missing from localStorage.");
        return token;
    };

    // --- Helper: Close Any Active Popup ---
    const closeGenericPopup = () => {
        if (addPaymentMethodPopup) addPaymentMethodPopup.style.display = 'none';
        if (profilePopup) profilePopup.classList.remove('visible');
        if (overlay) overlay.style.display = 'none';
        if (profilePopupOverlay) profilePopupOverlay.classList.remove('visible');
    };

    // --- 2. Welcome Message ---
    const loggedInUser = localStorage.getItem('loggedInUser'); // Keep for display name
    if (dashboardContentDiv) {
        dashboardContentDiv.innerHTML = `<h2>Welcome Back, ${loggedInUser || 'User'}!</h2>`;
    } else {
        console.error("dashboard-content div not found!");
    }

    // --- 3. Setup Popup Triggers & Closers ---
    // Open Add Payment Method Popup (Handles potentially duplicate buttons)
    document.querySelectorAll('#addPaymentMethodButton, #add-payment-method-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (addPaymentMethodPopup && overlay) {
                addPaymentMethodPopup.style.display = 'block';
                overlay.style.display = 'block';
            } else {
                console.error("Add payment popup or overlay not found!");
            }
        });
    });

    // Open Profile Popup
    const openProfileButton = document.getElementById('openProfileButton');
    if (openProfileButton) {
        openProfileButton.addEventListener('click', () => {
            if (profilePopup && profilePopupOverlay) {
                profilePopup.classList.add('visible');
                profilePopupOverlay.classList.add('visible');
            } else {
                console.error("Profile popup or its overlay not found!");
            }
        });
    }

    // Close Buttons (using specific selectors within popups)
    document.querySelectorAll('#add-payment-method-popup .close-btn, #profile-popup .close-btn').forEach(button => {
         button.addEventListener('click', closeGenericPopup);
    });

    // Overlay Click Closer
    if (overlay) overlay.addEventListener('click', closeGenericPopup);
    if (profilePopupOverlay && profilePopupOverlay !== overlay) { // Handle separate profile overlay if it exists
        profilePopupOverlay.addEventListener('click', closeGenericPopup);
    }

    // --- 4. Profile Section ---
    const profileUsernameInput = document.getElementById('profile-username');
    const profileEmailInput = document.getElementById('profile-email');
    const profileFullNameInput = document.getElementById('profile-fullName');
    const profilePhoneNumberInput = document.getElementById('profile-phoneNumber');
    const editProfileButton = document.getElementById('editProfileButton');

    // Fetch Profile Data
    const fetchProfileData = async () => {
        const token = getToken();
        if (!token || !profileUsernameInput) return; // No token or essential element missing

        try {
            const response = await fetch(`${backendUrl}/api/user`, {
                headers: { 'Authorization': `Bearer ${token}` } // Removed 'userid' header
            });
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const userData = await response.json();

            profileUsernameInput.value = userData.username || '';
            profileEmailInput.value = userData.email || '';
            profileFullNameInput.value = userData.full_names || '';
            profilePhoneNumberInput.value = userData.phone_number || '';
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert(`Error loading profile data: ${error.message}`);
        }
    };

    // Edit/Update Profile Logic
    if (editProfileButton) {
        editProfileButton.addEventListener('click', async function() {
            const isEditing = this.textContent === 'Update Profile';
            const token = getToken();

            if (isEditing && token) { // Handle Update action
                this.textContent = 'Updating...';
                this.disabled = true;
                try {
                    const updatedData = {
                        full_names: profileFullNameInput.value,
                        phone_number: profilePhoneNumberInput.value
                    };
                    const response = await fetch(`${backendUrl}/api/user`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Removed 'userid' header
                        },
                        body: JSON.stringify(updatedData)
                    });
                    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

                    profileFullNameInput.disabled = true;
                    profilePhoneNumberInput.disabled = true;
                    this.textContent = 'Edit Profile';
                    alert('Profile updated successfully!');

                } catch (error) {
                    console.error('Error updating profile:', error);
                    alert(`Failed to update profile: ${error.message}`);
                    this.textContent = 'Update Profile'; // Revert on failure
                } finally {
                    this.disabled = false;
                }
            } else { // Handle Edit action (switch to editable state)
                profileFullNameInput.disabled = false;
                profilePhoneNumberInput.disabled = false;
                this.textContent = 'Update Profile';
            }
        });
    }

    // --- 5. Bookings Section ---
    window.createBookingTable = async function() { // Keep global for now
        if (!bookingsContent) return console.error("bookings-content element not found.");
        bookingsContent.innerHTML = 'Loading bookings...';
        const token = getToken();
        if (!token) {
            bookingsContent.innerHTML = '<p>Authentication error loading bookings.</p>';
            return;
        }

        const userId = localStorage.getItem('userId'); // Needed for the URL path
        if (!userId) {
             bookingsContent.innerHTML = '<p>User ID missing, cannot load bookings.</p>';
             return;
        }


        try {
            const response = await fetch(`${backendUrl}/api/booking/${userId}`, { // userId required in path
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const reservations = await response.json();

            // Create table structure (simplified)
            const table = document.createElement('table');
            table.classList.add('reservation-table');
            table.innerHTML = `
                <thead><tr><th>Location</th><th>Lot</th><th>Dates</th><th>Times</th><th>Action</th></tr></thead>
                <tbody></tbody>`;
            const tbody = table.querySelector('tbody');

            if (reservations.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">No current bookings found.</td></tr>';
            } else {
                reservations.forEach(res => {
                    const row = document.createElement('tr');
                    const startDate = res.start_date ? new Date(res.start_date).toLocaleDateString() : 'N/A';
                    const endDate = res.end_date ? new Date(res.end_date).toLocaleDateString() : 'N/A';
                    row.innerHTML = `
                        <td data-label="Location">${res.location_name || 'N/A'}<br><small>${res.location_address || ''}</small></td>
                        <td data-label="Lot">${res.lot_number || 'N/A'}</td>
                        <td data-label="Dates">${startDate} - ${endDate}</td>
                        <td data-label="Times">${res.enter_after || 'N/A'} - ${res.exit_before || 'N/A'}</td>
                        <td data-label="Actions"><button class="cancel-button" data-reservation-id="${res.reservation_id}">Cancel</button></td>
                    `; // Simplified columns
                    tbody.appendChild(row);
                });
            }
            bookingsContent.innerHTML = ''; // Clear loading message
            bookingsContent.appendChild(table);

            // Attach cancel listeners
            tbody.querySelectorAll('.cancel-button').forEach(button => {
                button.addEventListener('click', handleCancelBookingClick); // Use named handler
            });

        } catch (error) {
            console.error('Error fetching or processing reservations:', error);
            bookingsContent.innerHTML = `<p>Error loading bookings: ${error.message}. Please try again.</p>`;
        }
    };

    // Handler for booking cancellation
    async function handleCancelBookingClick() {
        const reservationId = this.dataset.reservationId;
        const token = getToken();
        if (!token || !confirm(`Are you sure you want to cancel reservation ${reservationId}?`)) return;

        this.textContent = 'Cancelling...';
        this.disabled = true;

        try {
            const response = await fetch(`${backendUrl}/api/booking/${reservationId}`, { // Uses reservationId only
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Failed to cancel reservation. Status: ${response.status}`);

            console.log(`Reservation ${reservationId} cancelled successfully.`);
            alert(`Reservation ${reservationId} cancelled.`);
            createBookingTable(); // Refresh the table

        } catch (error) {
            console.error('Error cancelling reservation:', error);
            alert(error.message);
            this.textContent = 'Cancel'; // Revert button on failure/error
            this.disabled = false;
        }
    }


    // --- 6. Payment Methods Section ---
    const allowedMethodNames = ["Mobile Money", "Credit Card", "PayPal"];
    const allowedProviders = {
        "Mobile Money": ["M-Pesa (Kenya)", "Airtel Money (Kenya)"],
        "Credit Card": ["Visa", "Mastercard", "American Express"],
        "PayPal": ["PayPal"]
    };

    // Populate Method Dropdown
    if (methodNameSelect) {
        allowedMethodNames.forEach(method => {
            methodNameSelect.add(new Option(method, method));
        });
        methodNameSelect.addEventListener('change', function () {
            if (providerSelect) {
                providerSelect.innerHTML = '<option value="">Select Provider...</option>';
                const selectedMethod = this.value;
                (allowedProviders[selectedMethod] || []).forEach(provider => {
                    providerSelect.add(new Option(provider, provider));
                });
            }
        });
        methodNameSelect.dispatchEvent(new Event('change')); // Initial population
    }

    // Fetch and Display Payment Methods
    const fetchPaymentMethods = async () => {
        if (!paymentMethodsContainer) return console.error("payment-methods-list container not found.");
        paymentMethodsContainer.innerHTML = 'Loading payment methods...';
        const token = getToken();
        if (!token) {
             paymentMethodsContainer.innerHTML = '<p>Authentication error loading payment methods.</p>';
             return;
        }

        try {
            // Uses /api/payment-methods endpoint, backend gets user from token
            const response = await fetch(`${backendUrl}/api/payment-methods`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const paymentMethods = await response.json();

            // Create table structure
            const table = document.createElement('table');
            table.classList.add('payment-methods-table');
            table.innerHTML = `
                <thead><tr><th>Method</th><th>Provider</th><th>Account</th><th>Actions</th></tr></thead>
                <tbody></tbody>`;
            const tbody = table.querySelector('tbody');

            if (paymentMethods.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4">No payment methods added yet.</td></tr>';
            } else {
                paymentMethods.forEach(method => { // Expects 'id' alias from backend
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td data-label="Method">${method.method_name || 'N/A'}</td>
                        <td data-label="Provider">${method.provider || 'N/A'}</td>
                        <td data-label="Account" class="account-number-cell">****${method.account_number ? method.account_number.slice(-4) : ''}</td>
                        <td>
                            <button class="edit-payment-btn" data-method-id="${method.id}">Edit</button>
                            <button class="delete-payment-btn" data-method-id="${method.id}">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }
            paymentMethodsContainer.innerHTML = ''; // Clear loading
            paymentMethodsContainer.appendChild(table);

            // Attach listeners after table is in DOM
            attachPaymentMethodActionListeners();

        } catch (error) {
            console.error('Error fetching payment methods:', error);
            paymentMethodsContainer.innerHTML = `<p>Error loading payment methods: ${error.message}.</p>`;
        }
    };

    // Helper to Attach Edit/Delete Listeners (avoids duplication on refresh)
    function attachPaymentMethodActionListeners() {
        paymentMethodsContainer.querySelectorAll('.edit-payment-btn').forEach(button => {
            const clone = button.cloneNode(true);
            button.parentNode.replaceChild(clone, button); // Replace to remove old listeners
            clone.addEventListener('click', handleEditPaymentClick);
        });
        paymentMethodsContainer.querySelectorAll('.delete-payment-btn').forEach(button => {
             const clone = button.cloneNode(true);
             button.parentNode.replaceChild(clone, button);
             clone.addEventListener('click', handleDeletePaymentClick);
        });
    }

    // Handler for Edit Payment Button Click
    async function handleEditPaymentClick() {
        const button = this;
        const methodId = button.dataset.methodId;
        const row = button.closest('tr');
        const accountNumberCell = row.querySelector('.account-number-cell');
        const token = getToken();

        if (!token) return alert("Authentication error.");

        if (button.textContent === 'Edit') {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.placeholder = "Enter NEW Full Number";
            inputElement.classList.add('edit-account-number');
            accountNumberCell.innerHTML = '';
            accountNumberCell.appendChild(inputElement);
            inputElement.focus();
            button.textContent = 'Save';
            const deleteBtn = row.querySelector('.delete-payment-btn');
            if(deleteBtn) deleteBtn.disabled = true;
        } else if (button.textContent === 'Save') {
            const inputElement = accountNumberCell.querySelector('input');
            const updatedAccountNumber = inputElement.value.trim();

            if (!/^\d+$/.test(updatedAccountNumber) || updatedAccountNumber.length < 5) {
                return alert('Account number must be digits only and seems too short.');
            }

            button.textContent = 'Saving...';
            button.disabled = true;

            try {
                const response = await fetch(`${backendUrl}/paymentMethods/${methodId}`, { // Assuming this endpoint exists
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ account_number: updatedAccountNumber })
                });
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);

                console.log('Payment method updated.');
                accountNumberCell.textContent = '****' + updatedAccountNumber.slice(-4);
                button.textContent = 'Edit';
                alert('Payment method updated.');
            } catch (error) {
                console.error('Error updating payment method:', error);
                alert(`Failed to update: ${error.message}.`);
                // Attempt to revert (might need original masked value stored somewhere for perfect revert)
                button.textContent = 'Save'; // Allow retry
            } finally {
                button.disabled = false;
                const deleteBtn = row.querySelector('.delete-payment-btn');
                if(deleteBtn) deleteBtn.disabled = false;
            }
        }
    }

    // Handler for Delete Payment Button Click
    async function handleDeletePaymentClick() {
        const button = this;
        const methodId = button.dataset.methodId;
        const row = button.closest('tr');
        const token = getToken();

        if (!token || !confirm(`Are you sure you want to delete this payment method?`)) return;

        button.textContent = 'Deleting...';
        button.disabled = true;
        const editBtn = row.querySelector('.edit-payment-btn');
        if(editBtn) editBtn.disabled = true;

        try {
            const response = await fetch(`${backendUrl}/paymentMethods/${methodId}`, { // Assuming this endpoint exists
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
             // Check for specific conflict error from backend (if implemented)
            if (response.status === 409) {
                 const data = await response.json();
                 throw new Error(data.message || 'Cannot delete: Method likely used for payments.');
            }
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);

            console.log(`Payment method ${methodId} deleted.`);
            alert('Payment method deleted.');
            row.remove();
            const tbody = paymentMethodsContainer.querySelector('tbody');
            if (tbody && !tbody.hasChildNodes()) {
                tbody.innerHTML = '<tr><td colspan="4">No payment methods added yet.</td></tr>';
            }
        } catch (error) {
            console.error('Error deleting payment method:', error);
            alert(`Failed to delete: ${error.message}.`);
            button.textContent = 'Delete';
            button.disabled = false;
            if(editBtn) editBtn.disabled = false;
        }
    }

    
        // Add Payment Method Form Submission
        if (paymentMethodForm) {
            paymentMethodForm.addEventListener('submit', async function (event) { // Make handler async
                event.preventDefault();
    
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');
                const methodName = methodNameSelect.value;
                const provider = providerSelect.value;
                const accountNumberInput = document.getElementById('account-number');
                const accountNumber = accountNumberInput.value.trim();
    
                if (!userId || !token) {
                     alert("Authentication error. Cannot add payment method.");
                     return;
                }
                if (!methodName || !provider || !accountNumber) {
                    alert('Please fill in all fields.');
                    return;
                }
                if (!/^\d+$/.test(accountNumber)) {
                    alert('Account number must contain only digits.');
                    accountNumberInput.focus();
                    return;
                }
    
                 const submitButton = paymentMethodForm.querySelector('button[type="submit"]');
                 submitButton.textContent = 'Adding...';
                 submitButton.disabled = true;
    
    
                try {
                    const response = await fetch(`${backendUrl}/addPaymentMethod`, { // Use backendUrl
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            user_id: userId, // Send userId in the body as per original logic
                            method_name: methodName,
                            provider: provider,
                            account_number: accountNumber
                        })
                    });
    
                    if (response.ok) {
                        alert('Payment method added successfully.');
                        paymentMethodForm.reset(); // Clear the form
                        methodNameSelect.dispatchEvent(new Event('change')); // Reset provider dropdown
                        closeGenericPopup(); // Close the popup
                        await fetchPaymentMethods(); // Refresh the list of payment methods
                    } else {
                        console.error('Error adding payment method:', response.status, await response.text());
                        alert(`Failed to add payment method. Status: ${response.status}`);
                    }
                } catch (error) {
                    console.error('Error adding payment method:', error);
                    alert(`Error adding payment method: ${error.message}`);
                } finally {
                     submitButton.textContent = 'Add Method';
                     submitButton.disabled = false;
                }
            });
        } else {
            console.warn("Payment method form not found.");
        }

    // --- 7. Initial Data Load ---
    console.log("Page loaded. Fetching initial data...");
    await fetchProfileData(); // Load profile info
    await createBookingTable(); // Load bookings table
    await fetchPaymentMethods(); // Load payment methods table
    console.log("Dashboard initialization complete.");

}); // End of DOMContentLoaded listener