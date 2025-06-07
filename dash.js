// Import the function to get the server URL
// Make sure the <script> tag in your HTML has type="module"
import getServerIP from './serveriip.js';

// Use a single async DOMContentLoaded listener to handle initialization order
document.addEventListener('DOMContentLoaded', async function() {
    let backendUrl;

    // --- Get Backend URL ---
    try {
        backendUrl = await getServerIP(); // Fetch the backend URL first
        if (!backendUrl) {
            throw new Error("Failed to retrieve backend URL from serveriip.js");
        }
        console.log("Using backend URL:", backendUrl);
    } catch (error) {
        console.error("CRITICAL: Could not get server URL.", error);
        const dashboardContentDiv = document.getElementById('dashboard-content');
        if (dashboardContentDiv) {
            dashboardContentDiv.innerHTML = `<h2>Initialization Error</h2><p>Could not determine the server address. Please contact support or try again later.</p>`;
        }
        // Stop further execution if the backend URL is missing
        return;
    }

    // --- Display welcome message ---
    const loggedInUser = localStorage.getItem('loggedInUser');
    const welcomeMessage = `<h2>Welcome Back, ${loggedInUser || 'User'}!</h2>`;
    const dashboardContentDiv = document.getElementById('dashboard-content');
    if (dashboardContentDiv) {
        dashboardContentDiv.innerHTML = welcomeMessage;
    } else {
        console.error("dashboard-content div not found!");
    }

    // --- Close Section Buttons ---
    const closeSectionButtons = document.querySelectorAll('.close-section-btn');
    closeSectionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
    });

    // --- Add Payment Method Popup Logic ---
    const addPaymentMethodPopup = document.getElementById('add-payment-method-popup');
    const overlay = document.getElementById('overlay');
    const addPaymentMethodButton = document.getElementById('addPaymentMethodButton');
    const addPaymentMethodBtn = document.getElementById('add-payment-method-btn'); // The duplicated button
    const closePopupButtons = document.querySelectorAll('#add-payment-methods-section .close-btn, #profile-popup .close-btn'); // Combine close buttons if structure allows

    // Function to close the generic popup (add payment or profile)
    const closeGenericPopup = () => {
        if (addPaymentMethodPopup) addPaymentMethodPopup.style.display = 'none';
        if (profilePopup) profilePopup.classList.remove('visible'); // Use class for profile popup
        if (overlay) overlay.style.display = 'none';
        if (profilePopupOverlay) profilePopupOverlay.classList.remove('visible'); // Use class for profile overlay
    };

    // Close button for add payment method popup
    const closePaymentPopupButton = document.querySelector('#add-payment-methods-section .close-btn');
    if (closePaymentPopupButton) {
        closePaymentPopupButton.addEventListener('click', closeGenericPopup);
    } else {
        console.warn("Close button for add payment method popup not found");
    }

    // Show the add payment method popup
    const showPaymentMethodPopup = () => {
        if (addPaymentMethodPopup && overlay) {
            addPaymentMethodPopup.style.display = 'block';
            overlay.style.display = 'block';
        } else {
             console.error("Add payment popup or overlay not found!");
        }
    };

    if (addPaymentMethodButton) {
        addPaymentMethodButton.addEventListener('click', showPaymentMethodPopup);
    }
    if (addPaymentMethodBtn) {
        addPaymentMethodBtn.addEventListener('click', showPaymentMethodPopup);
    }

    // Close popup when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', closeGenericPopup);
    }

    // --- Profile Popup Logic ---
    const openProfileButton = document.getElementById('openProfileButton');
    const closeProfileButton = document.getElementById('closeProfileButton');
    const profilePopup = document.getElementById('profile-popup');
    const profilePopupOverlay = document.getElementById('profile-popup-overlay');
    const editProfileButton = document.getElementById('editProfileButton');

    // Function to open the profile popup
    function openProfilePopup() {
        if (profilePopup && profilePopupOverlay) {
            profilePopup.classList.add('visible');
            profilePopupOverlay.classList.add('visible');
        } else {
             console.error("Profile popup or its overlay not found!");
        }
    }

    // Event listeners to open and close profile popup
    if (openProfileButton) openProfileButton.addEventListener('click', openProfilePopup);
    if (closeProfileButton) closeProfileButton.addEventListener('click', closeGenericPopup); // Use generic closer
    if (profilePopupOverlay) profilePopupOverlay.addEventListener('click', closeGenericPopup); // Use generic closer


    // --- Fetch Profile Data ---
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
            throw new Error("User ID or Token not found in localStorage.");
        }

        const response = await fetch(`${backendUrl}/api/user`, { // Use backendUrl
            headers: {
                'Authorization': `Bearer ${token}`,
                'userid': userId // Keep header if backend expects it, otherwise remove
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error fetching profile! Status: ${response.status}`);
        }

        const userData = await response.json();
        document.getElementById('profile-username').value = userData.username || '';
        document.getElementById('profile-email').value = userData.email || '';
        document.getElementById('profile-fullName').value = userData.full_names || '';
        document.getElementById('profile-phoneNumber').value = userData.phone_number || '';

    } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally display an error message in the profile popup
        alert(`Error loading profile data: ${error.message}`);
    }

    // --- Edit Profile Button Functionality ---
    if (editProfileButton) {
        editProfileButton.addEventListener('click', async function() { // Make handler async
            const fullNameInput = document.getElementById('profile-fullName');
            const phoneInput = document.getElementById('profile-phoneNumber');

            if (this.textContent === 'Edit Profile') {
                fullNameInput.disabled = false;
                phoneInput.disabled = false;
                this.textContent = 'Update Profile';
            } else {
                // Update profile logic
                const updatedData = {
                    full_names: fullNameInput.value,
                    phone_number: phoneInput.value
                };

                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');

                if (!userId || !token) {
                     console.error("User ID or Token missing for profile update.");
                     alert("Authentication error. Please log in again.");
                     return;
                }

                this.textContent = 'Updating...'; // Provide feedback
                this.disabled = true;

                try {
                    const response = await fetch(`${backendUrl}/api/user`, { // Use backendUrl
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'userid': userId // Keep header if backend expects it
                        },
                        body: JSON.stringify(updatedData)
                    });

                    if (response.ok) {
                        fullNameInput.disabled = true;
                        phoneInput.disabled = true;
                        this.textContent = 'Edit Profile';
                        alert('Profile updated successfully!');
                    } else {
                        console.error('Error updating profile:', response.status, await response.text());
                        alert(`Failed to update profile. Status: ${response.status}`);
                        this.textContent = 'Update Profile'; // Revert button text on failure
                    }
                } catch (error) {
                    console.error('Error updating profile:', error);
                    alert(`Error updating profile: ${error.message}`);
                    this.textContent = 'Update Profile'; // Revert button text on error
                } finally {
                    this.disabled = false; // Re-enable button
                }
            }
        });
    } else {
         console.warn("Edit profile button not found");
    }


    // --- Booking Table Functionality ---
    // Define function within this scope to access backendUrl
    window.createBookingTable = async function() {
        const bookingsContent = document.getElementById('bookings-content');
        if (!bookingsContent) {
            console.error("bookings-content element not found.");
            return;
        }
        bookingsContent.innerHTML = 'Loading bookings...'; // Loading indicator

        // Create table structure
        const table = document.createElement('table');
        table.classList.add('reservation-table');
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Location Name</th><th>Address</th><th>Lot Number</th>
                <th>Start Date</th><th>End Date</th><th>Enter After</th>
                <th>Exit Before</th><th>Action</th>
            </tr>`;
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        tbody.id = 'bookings-table-body';
        table.appendChild(tbody);

        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            if (!userId || !token) throw new Error("User ID or Token not found.");

            const response = await fetch(`${backendUrl}/api/booking/${userId}`, { // Use backendUrl
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`HTTP error fetching bookings! Status: ${response.status}`);

            const reservations = await response.json();
            tbody.innerHTML = ''; // Clear loading indicator only on success

            if (reservations.length === 0) {
                 tbody.innerHTML = '<tr><td colspan="8">No current bookings found.</td></tr>';
            } else {
                reservations.forEach(res => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td data-label="Location Name">${res.location_name || 'N/A'}</td>
                        <td data-label="Address">${res.location_address || 'N/A'}</td>
                        <td data-label="Lot Number">${res.lot_number || 'N/A'}</td>
                        <td data-label="Start Date">${res.start_date ? new Date(res.start_date).toLocaleDateString() : 'N/A'}</td>
                        <td data-label="End Date">${res.end_date ? new Date(res.end_date).toLocaleDateString() : 'N/A'}</td>
                        <td data-label="Enter After">${res.enter_after || 'N/A'}</td>
                        <td data-label="Exit Before">${res.exit_before || 'N/A'}</td>
                        <td data-label="Actions"><button class="cancel-button" data-reservation-id="${res.reservation_id}">Cancel</button></td>
                    `;
                    tbody.appendChild(row);
                });
            }

            // Add event listeners AFTER populating the table
            tbody.querySelectorAll('.cancel-button').forEach(button => {
                button.addEventListener('click', async function() { // Make handler async
                    const reservationId = this.dataset.reservationId;
                    const token = localStorage.getItem('token');
                    if (!confirm(`Are you sure you want to cancel reservation ${reservationId}?`)) return;

                    this.textContent = 'Cancelling...'; // Feedback
                    this.disabled = true;

                    try {
                        const deleteResponse = await fetch(`${backendUrl}/api/booking/${reservationId}`, { // Use backendUrl
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (deleteResponse.ok) {
                            console.log(`Reservation ${reservationId} cancelled successfully.`);
                            alert(`Reservation ${reservationId} cancelled.`);
                            createBookingTable(); // Refresh the table
                        } else {
                            console.error(`Failed to cancel reservation ${reservationId}: ${deleteResponse.status}`, await deleteResponse.text());
                            alert(`Failed to cancel reservation. Status: ${deleteResponse.status}`);
                            this.textContent = 'Cancel'; // Revert button on failure
                            this.disabled = false;
                        }
                    } catch (error) {
                        console.error('Error cancelling reservation:', error);
                        alert(`Error cancelling reservation: ${error.message}`);
                        this.textContent = 'Cancel'; // Revert button on error
                        this.disabled = false;
                    }
                });
            });

        } catch (error) {
            console.error('Error fetching or processing reservations:', error);
            tbody.innerHTML = `<tr><td colspan="8">Error loading bookings: ${error.message}. Please try again later.</td></tr>`;
        } finally {
             // Append table to the DOM unless it was already showing an error before fetch
             if (bookingsContent.textContent === 'Loading bookings...') { // Check if fetch failed early
                 bookingsContent.innerHTML = ''; // Clear loading message
                 bookingsContent.appendChild(table);
             } else if (bookingsContent.firstChild?.nodeName !== 'TABLE') {
                  // If fetch failed later but table structure wasn't added, add it now
                  bookingsContent.innerHTML = '';
                  bookingsContent.appendChild(table); // Append table with error message inside tbody
             }
        }
    };


    // --- Payment Method Dropdown & Form Logic ---
    const allowedMethodNames = ["Mobile Money", "Credit Card", "Bank Transfer", "PayPal"];
    const allowedProviders = {
        "Mobile Money": ["M-Pesa (Kenya)", "Airtel Money (Kenya)", "Tigo Pesa (Tanzania)", "MTN Mobile Money (Uganda)", "EcoCash (Zimbabwe)"],
        "Credit Card": ["Visa", "Mastercard", "American Express"],
        "Bank Transfer": ["Equity Bank (Kenya)", "Co-operative Bank (Kenya)", "Standard Chartered (Kenya)", "Absa Bank (South Africa)", "Ecobank (Pan-African)"],
        "PayPal": ["PayPal"]
    };

    const methodNameSelect = document.getElementById('method-name');
    const providerSelect = document.getElementById('provider');
    const paymentMethodForm = document.getElementById('payment-method-form');
    const paymentMethodsContainer = document.getElementById('payment-methods-list');

    // Populate Method Name dropdown
    if (methodNameSelect) {
        allowedMethodNames.forEach(method => {
            const option = document.createElement('option');
            option.value = method;
            option.textContent = method;
            methodNameSelect.appendChild(option);
        });

        // Populate Provider dropdown based on selected Method Name
        methodNameSelect.addEventListener('change', function () {
            if (providerSelect) {
                providerSelect.innerHTML = '<option value="">Select Provider...</option>'; // Clear previous options, add placeholder
                const selectedMethod = this.value;
                if (allowedProviders[selectedMethod]) {
                    allowedProviders[selectedMethod].forEach(provider => {
                        const option = document.createElement('option');
                        option.value = provider;
                        option.textContent = provider;
                        providerSelect.appendChild(option);
                    });
                }
            }
        });
        // Trigger initial population
        methodNameSelect.dispatchEvent(new Event('change'));
    } else {
        console.warn("Payment method name select dropdown not found.");
    }

        // --- Fetch and Display Existing Payment Methods ---
        const fetchPaymentMethods = async () => {
            if (!paymentMethodsContainer) {
                console.error("payment-methods-list container not found.");
                return;
            }
            paymentMethodsContainer.innerHTML = 'Loading payment methods...';
    
            try {
                // *** FIX AREA ***
                // We no longer need userId here because the backend uses the token.
                // Remove the line getting userId and adjust the check.
    
                // const userId = localStorage.getItem('userId'); // REMOVE OR COMMENT OUT THIS LINE
                const token = localStorage.getItem('token');
    
                // OLD check might have been: if (!userId || !token)
                // NEW check: only need the token
                if (!token) {
                     throw new Error("Authentication token not found."); // Check only for token
                }
    
                // Fetch call remains the same (uses the correct endpoint)
                const response = await fetch(`${backendUrl}/api/payment-methods`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (!response.ok) {
                    // This will now correctly show backend errors (like 500) or actual 404s if the route *really* doesn't exist
                    throw new Error(`HTTP error fetching payment methods! Status: ${response.status}`);
                }
    
                const paymentMethods = await response.json();
                paymentMethodsContainer.innerHTML = ''; // Clear loading message
    
                // Create the table structure
                const table = document.createElement('table');
                table.classList.add('payment-methods-table');
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Method Name</th><th>Provider</th><th>Account Number</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>`;
                const tbody = table.querySelector('tbody');
    
                if (paymentMethods.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4">No payment methods added yet.</td></tr>';
                } else {
                    paymentMethods.forEach(method => {
                        const row = document.createElement('tr');
                        // Ensure method.id exists (should come from the backend alias)
                        row.innerHTML = `
                            <td data-column="Method Name">${method.method_name || 'N/A'}</td>
                            <td data-column="Provider">${method.provider || 'N/A'}</td>
                            <td data-column="Account Number" class="account-number-cell">****${method.account_number ? method.account_number.slice(-4) : '****'}</td>
                            <td>
                                <button class="edit-payment-btn" data-method-id="${method.id}">Edit</button>
                                <button class="delete-payment-btn" data-method-id="${method.id}">Delete</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }
                paymentMethodsContainer.appendChild(table);
    
                // Attach listeners AFTER table is in DOM
                attachPaymentMethodActionListeners(backendUrl);
    
            } catch (error) {
                // This catch block now handles the token check error OR fetch errors
                console.error('Error fetching payment methods:', error);
                paymentMethodsContainer.innerHTML = `<p>Error loading payment methods: ${error.message}. Please try again.</p>`;
            }
        }; // End of fetchPaymentMethods

    // --- Helper Function to Attach Edit/Delete Listeners ---
    // Defined separately for clarity and potentially reuse if needed
    function attachPaymentMethodActionListeners(apiUrl) {
        const editButtons = document.querySelectorAll('.edit-payment-btn');
        editButtons.forEach(button => {
             // Remove any existing listener before adding a new one to prevent duplicates on refresh
             button.replaceWith(button.cloneNode(true)); // Simple way to remove all listeners
        });
        // Re-select buttons after cloning
        document.querySelectorAll('.edit-payment-btn').forEach(button => {
            button.addEventListener('click', handleEditPaymentClick); // Use named handler
        });


        const deleteButtons = document.querySelectorAll('.delete-payment-btn');
         deleteButtons.forEach(button => {
             button.replaceWith(button.cloneNode(true));
         });
        document.querySelectorAll('.delete-payment-btn').forEach(button => {
            button.addEventListener('click', handleDeletePaymentClick); // Use named handler
        });
    }

    // --- Handler for Edit Payment Button Click ---
    async function handleEditPaymentClick() {
        const button = this; // Store reference
        const methodId = button.dataset.methodId;
        const row = button.closest('tr');
        const accountNumberCell = row.querySelector('.account-number-cell');
        const originalMaskedValue = accountNumberCell.textContent; // Store masked value

        if (button.textContent === 'Edit') {
            // --- Switch to Edit Mode ---
            // Create input element
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            // We don't have the full original number here, prompt user to re-enter? Or just allow editing last 4?
            // For simplicity, let's just prompt for the *new* full number.
            inputElement.placeholder = "Enter NEW Full Account Number";
            inputElement.classList.add('edit-account-number'); // Add style class
            inputElement.value = ''; // Start empty

            // Replace the text content with input
            accountNumberCell.innerHTML = '';
            accountNumberCell.appendChild(inputElement);
            inputElement.focus();

            // Change button to "Save"
            button.textContent = 'Save';
            // Disable delete button while editing
            const deleteBtn = row.querySelector('.delete-payment-btn');
            if(deleteBtn) deleteBtn.disabled = true;

        } else if (button.textContent === 'Save') {
            // --- Save Changes ---
            const inputElement = accountNumberCell.querySelector('input');
            const updatedAccountNumber = inputElement.value.trim(); // Get the value from the input

             if (!/^\d+$/.test(updatedAccountNumber)) {
                alert('Account number must contain only digits.');
                inputElement.focus();
                return; // Stop saving
            }
             if (updatedAccountNumber.length < 5) { // Basic length check
                 alert('Account number seems too short.');
                 inputElement.focus();
                 return;
             }


            button.textContent = 'Saving...';
            button.disabled = true;

            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Authentication token not found.");

                const response = await fetch(`${backendUrl}/paymentMethods/${methodId}`, { // Use backendUrl
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ account_number: updatedAccountNumber }) // Send full new number
                });

                if (response.ok) {
                    console.log('Payment method updated successfully.');
                    accountNumberCell.textContent = '****' + updatedAccountNumber.slice(-4); // Update cell with new masked value
                    button.textContent = 'Edit';
                    alert('Payment method updated.');
                } else {
                    console.error('Error updating payment method:', response.status, await response.text());
                    alert(`Failed to update. Status: ${response.status}. Please try again.`);
                    accountNumberCell.textContent = originalMaskedValue; // Revert cell content
                    button.textContent = 'Save'; // Keep button as Save to allow retry
                }

            } catch (error) {
                console.error('Error updating payment method:', error);
                alert(`Error updating: ${error.message}. Please try again later.`);
                accountNumberCell.textContent = originalMaskedValue; // Revert cell content
                button.textContent = 'Save'; // Keep button as Save to allow retry
            } finally {
                button.disabled = false; // Re-enable button
                 // Re-enable delete button
                const deleteBtn = row.querySelector('.delete-payment-btn');
                if(deleteBtn) deleteBtn.disabled = false;
                 // If failed, keep in Save mode. If succeeded, button text is already Edit.
                 if (button.textContent === 'Saving...') { // If error occurred before text change
                     button.textContent = 'Save';
                 }

            }
        }
    }

    // --- Handler for Delete Payment Button Click ---
    async function handleDeletePaymentClick() {
        const button = this;
        const methodId = button.dataset.methodId;
        const row = button.closest('tr');

        if (!confirm(`Are you sure you want to delete this payment method?`)) return;

        button.textContent = 'Deleting...';
        button.disabled = true;
         const editBtn = row.querySelector('.edit-payment-btn');
         if(editBtn) editBtn.disabled = true;


        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Authentication token not found.");

            const response = await fetch(`${backendUrl}/paymentMethods/${methodId}`, { // Use backendUrl
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                console.log(`Payment method with ID ${methodId} deleted successfully.`);
                alert('Payment method deleted.');
                row.remove(); // Remove the row from the table
                // Check if table body is now empty
                const tbody = paymentMethodsContainer.querySelector('tbody');
                if (tbody && !tbody.hasChildNodes()) {
                     tbody.innerHTML = '<tr><td colspan="4">No payment methods added yet.</td></tr>';
                }
            } else {
                console.error(`Failed to delete payment method with ID ${methodId}: ${response.status}`, await response.text());
                alert(`Failed to delete. Status: ${response.status}. Please try again.`);
                button.textContent = 'Delete'; // Revert button text
                button.disabled = false;
                 if(editBtn) editBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error deleting payment method:', error);
            alert(`Error deleting: ${error.message}. Please try again later.`);
            button.textContent = 'Delete'; // Revert button text
            button.disabled = false;
            if(editBtn) editBtn.disabled = false;
        }
    }


    // --- Add Payment Method Form Submission ---
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

    // --- Initial Data Loading Calls ---
    console.log("Page loaded. Fetching initial data...");
    await createBookingTable(); // Load bookings table
    await fetchPaymentMethods(); // Load payment methods table

    console.log("Dashboard initialization complete.");

}); // End of async DOMContentLoaded listener