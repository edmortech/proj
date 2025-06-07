// --- START OF FILE admin2.js ---

import getServerIP from './serveriip.js'; // Import the function

let backendUrl; // Variable to store the fetched backend URL

// --- Main Initialization Logic ---
document.addEventListener('DOMContentLoaded', async () => { // Make the main listener async
    try {
        backendUrl = await getServerIP(); // Fetch the backend URL once

        if (!backendUrl) {
            console.error("FATAL: Could not retrieve backend URL. Admin panel functionality disabled.");
            // Optionally display a user-friendly error message on the page
            alert("Error: Could not connect to the server. Admin features are unavailable.");
            return; // Stop further execution
        }

        console.log("Using backend URL:", backendUrl); // Log the fetched URL for debugging

        // Initialize all functionalities that depend on the backend URL
        initializeAdminFeatures();

    } catch (error) {
        console.error("Error during admin page initialization:", error);
        alert("An error occurred while initializing the admin panel.");
    }
});

// Function to set up all event listeners and dynamic content
function initializeAdminFeatures() {
    // --- Welcome Message --- (Doesn't strictly need backendUrl, but keep it organized)
    const loggedInUser = localStorage.getItem('loggedInUser');
    const welcomeMessageContainer = document.getElementById('welcomeMessageContainer'); // Assuming you have a container
    if (welcomeMessageContainer) {
      welcomeMessageContainer.innerHTML = `<h2>Welcome Back, ${loggedInUser || 'User'}!</h2>`;
    } else {
        // Find a suitable place to inject the welcome message if the container doesn't exist
        // Example: Prepending to the body or a specific main section
        const welcomeHeader = document.createElement('h2');
        welcomeHeader.textContent = `Welcome Back, ${loggedInUser || 'User'}!`;
        document.body.insertBefore(welcomeHeader, document.body.firstChild); // Example injection
        console.warn("Element with ID 'welcomeMessageContainer' not found for welcome message.");
    }


    // --- Logout Button ---
    const adminLogoutBtn = document.getElementById('logoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            // Clear login information
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');

            // Redirect to the main page
            window.location.href = 'project.html';
        });
    } else {
        console.warn("Logout button (logoutBtn) not found.");
    }


    // --- User Management ---
    const userManagementSection = document.getElementById('userManagementSection');
    const userManagementPopup = document.getElementById('userManagementPopup');
    const userTableContainer = document.getElementById('userTableContainer');
    const userCloseButton = userManagementPopup?.querySelector('.close'); // Use optional chaining for safety

    function fetchUsers() {
      fetch(`${backendUrl}/api/users`) // Use the dynamic URL
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
          }
          return response.json();
        })
        .then(users => {
          renderUserTable(users);
        })
        .catch(error => {
          console.error('Error fetching users:', error);
          userTableContainer.innerHTML = '<p>Error loading users. Please try again later.</p>';
        });
    }

    function renderUserTable(users) {
      const table = document.createElement('table');
      table.classList.add('user-table');
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      const headers = ['Full Name', 'Email', 'Phone Number', 'Role', 'Actions'];
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      users.forEach(user => {
        const row = document.createElement('tr');
        ['full_names', 'email', 'phone_number', 'role'].forEach(key => {
            const cell = document.createElement('td');
            cell.textContent = user[key] || 'N/A'; // Handle potential null/undefined values
            row.appendChild(cell);
        });
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deleteUser(user.user_id));
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      userTableContainer.innerHTML = '';
      userTableContainer.appendChild(table);
    }

    function deleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        fetch(`${backendUrl}/api/users/${userId}`, { // Use the dynamic URL
          method: 'DELETE'
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to delete user (${response.status})`);
            }
            fetchUsers(); // Refresh the user list
          })
          .catch(error => {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
          });
      }
    }

    if (userManagementSection && userManagementPopup && userTableContainer && userCloseButton) {
        userManagementSection.addEventListener('click', () => {
            fetchUsers();
            userManagementPopup.style.display = 'block';
        });
        userCloseButton.addEventListener('click', () => {
            userManagementPopup.style.display = 'none';
        });
        window.addEventListener('click', (event) => { // Close on outside click
            if (event.target == userManagementPopup) {
                userManagementPopup.style.display = 'none';
            }
        });
    } else {
        console.warn("One or more User Management elements are missing.");
    }


    // --- Location Management ---
    const locationManagementSection = document.getElementById('locationManagementSection');
    const locationManagementPopup = document.getElementById('locationManagementPopup');
    const locationTableContainer = document.getElementById('locationTableContainer');
    const locationCloseButton = locationManagementPopup?.querySelector('.close');
    const addLocationBtn = document.getElementById('addLocationBtn');
    const addLocationFormContainer = document.getElementById('addLocationFormContainer');

    async function fetchAndDisplayLocations() {
        try {
            const response = await fetch(`${backendUrl}/api/locations`); // Use the dynamic URL
            if (!response.ok) {
                throw new Error(`Failed to fetch locations (${response.status})`);
            }
            const locations = await response.json();
            renderLocationTable(locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
            locationTableContainer.innerHTML = '<p>Error loading locations.</p>';
        }
    }

    function renderLocationTable(locations) {
        locationTableContainer.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('location-table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Name','Address','City','State','ZIP','Lat','Lon','Desc','Phone','Type','Actions'];
        headers.forEach(headerText => {
            const th = document.createElement('th'); th.textContent = headerText; headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        locations.forEach(loc => {
            const row = document.createElement('tr');
            const keys = ['name','address','city','state','zip_code','latitude','longitude','description','contact_phone','parking_type'];
            keys.forEach(key => {
                const cell = document.createElement('td'); cell.textContent = loc[key] || ''; row.appendChild(cell);
            });
            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit'; editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => editLocation(loc));
            actionsCell.appendChild(editButton);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete'; deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteLocation(loc.location_id));
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        locationTableContainer.appendChild(table);
    }

    function editLocation(location) {
        const row = Array.from(locationTableContainer.querySelectorAll('table tbody tr'))
            .find(r => r.querySelector('td:first-child')?.textContent === location.name); // Safer check

        if (!row) { console.error('Row not found for location:', location.name); return; }

        const cells = row.querySelectorAll('td');
        const fields = ['name', 'address', 'city', 'state', 'zip_code', 'latitude', 'longitude', 'description', 'contact_phone', 'parking_type'];
        const inputs = {};

        fields.forEach((field, index) => {
            if (cells[index]) {
                const originalValue = location[field] || '';
                if (field === 'latitude' || field === 'longitude') {
                    cells[index].innerHTML = `<input type="number" step="any" value="${originalValue}">`;
                } else if (field === 'description') {
                    cells[index].innerHTML = `<textarea>${originalValue}</textarea>`;
                } else {
                    cells[index].innerHTML = `<input type="text" value="${originalValue}">`;
                }
                inputs[field] = cells[index].querySelector('input, textarea');
            }
        });

        const actionsCell = cells[fields.length]; // Actions cell is after the fields
        if (actionsCell) {
            actionsCell.innerHTML = `
                <button class="save-button">Save</button>
                <button class="cancel-button">Cancel</button>
            `;
            const saveButton = actionsCell.querySelector('.save-button');
            const cancelButton = actionsCell.querySelector('.cancel-button');

            saveButton.addEventListener('click', async () => {
                const updatedLocation = { location_id: location.location_id };
                fields.forEach(field => {
                    updatedLocation[field] = inputs[field]?.value; // Use optional chaining
                });

                try {
                    const response = await fetch(`${backendUrl}/api/locations/${location.location_id}`, { // Use the dynamic URL
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedLocation)
                    });
                    if (response.ok) { fetchAndDisplayLocations(); }
                    else { console.error('Failed to update location', await response.text()); alert('Failed to save location.');}
                } catch (error) { console.error('Error updating location:', error); alert('Error saving location.'); }
            });

            cancelButton.addEventListener('click', () => fetchAndDisplayLocations());
        }
    }

    async function deleteLocation(locationId) {
        if (confirm('Are you sure you want to delete this location?')) {
            try {
                const response = await fetch(`${backendUrl}/api/locations/${locationId}`, { // Use the dynamic URL
                    method: 'DELETE'
                });
                if (!response.ok) { throw new Error(`Failed to delete location (${response.status})`); }
                fetchAndDisplayLocations();
            } catch (error) { console.error('Error deleting location:', error); alert('Failed to delete location'); }
        }
    }

    if (locationManagementSection && locationManagementPopup && locationTableContainer && locationCloseButton && addLocationBtn && addLocationFormContainer) {
        locationManagementSection.addEventListener('click', () => { fetchAndDisplayLocations(); locationManagementPopup.style.display = 'block'; });
        locationCloseButton.addEventListener('click', () => { locationManagementPopup.style.display = 'none'; addLocationFormContainer.innerHTML = ''; }); // Clear form on close
        window.addEventListener('click', (event) => { if (event.target == locationManagementPopup) { locationManagementPopup.style.display = 'none'; addLocationFormContainer.innerHTML = ''; } }); // Clear form on close

        addLocationBtn.addEventListener('click', () => {
            addLocationFormContainer.innerHTML = `
                <h3>Add New Location</h3>
                <form id="addLocationForm">
                    <label>Name:<input type="text" id="name" name="name" required></label><br>
                    <label>Address:<input type="text" id="address" name="address" required></label><br>
                    <label>City:<input type="text" id="city" name="city" required></label><br>
                    <label>State:<input type="text" id="state" name="state" required></label><br>
                    <label>ZIP Code:<input type="text" id="zip_code" name="zip_code" required></label><br>
                    <label>Latitude:<input type="number" step="any" id="latitude" name="latitude"></label><br>
                    <label>Longitude:<input type="number" step="any" id="longitude" name="longitude"></label><br>
                    <label>Description:<textarea id="description" name="description"></textarea></label><br>
                    <label>Contact Phone:<input type="text" id="contact_phone" name="contact_phone"></label><br>
                    <label>Parking Type:<input type="text" id="parking_type" name="parking_type"></label><br>
                    <button type="submit">Add Location</button> <button type="button" id="cancelAddLocation">Cancel</button>
                </form>`;

            const addLocationForm = document.getElementById('addLocationForm');
            const cancelAddLocationBtn = document.getElementById('cancelAddLocation');

            addLocationForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(addLocationForm);
                const newLocation = Object.fromEntries(formData.entries());
                // Convert lat/lon to numbers or null
                newLocation.latitude = newLocation.latitude ? parseFloat(newLocation.latitude) : null;
                newLocation.longitude = newLocation.longitude ? parseFloat(newLocation.longitude) : null;


                try {
                    const response = await fetch(`${backendUrl}/api/locations`, { // Use the dynamic URL
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newLocation)
                    });
                    if (response.ok) {
                        fetchAndDisplayLocations();
                        addLocationFormContainer.innerHTML = ''; // Clear form on success
                    } else { console.error('Failed to add location', await response.text()); alert('Failed to add location.'); }
                } catch (error) { console.error('Error adding location:', error); alert('Error adding location.');}
            });
             cancelAddLocationBtn.addEventListener('click', () => {
                 addLocationFormContainer.innerHTML = ''; // Clear form on cancel
             });
        });
    } else { console.warn("One or more Location Management elements are missing."); }


    // --- Parking Slot Management ---
    const parkingSlotManagementSection = document.getElementById('parkingSlotManagementSection');
    const parkingSlotManagementPopup = document.getElementById('parkingSlotManagementPopup');
    const parkingSlotTableContainer = document.getElementById('parkingSlotTableContainer');
    const parkingSlotCloseButton = parkingSlotManagementPopup?.querySelector('.close');
    const addParkingSlotBtn = document.getElementById('addParkingSlotBtn');
    const addParkingSlotFormContainer = document.getElementById('addParkingSlotFormContainer');

    async function fetchAndDisplayParkingSlots() {
        try {
            const response = await fetch(`${backendUrl}/api/parking-slots`); // Use the dynamic URL
            if (!response.ok) { throw new Error(`Failed to fetch slots (${response.status})`); }
            const parkingSlots = await response.json();
            renderParkingSlotsTable(parkingSlots);
        } catch (error) { console.error('Error fetching slots:', error); parkingSlotTableContainer.innerHTML = '<p>Error loading parking slots.</p>';}
    }

    function renderParkingSlotsTable(parkingSlots) {
        parkingSlotTableContainer.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('parking-slot-table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Location ID', 'Lot Number', 'Availability', 'Actions'];
        headers.forEach(headerText => { const th = document.createElement('th'); th.textContent = headerText; headerRow.appendChild(th); });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        parkingSlots.forEach(slot => {
            const row = document.createElement('tr');
            ['location_id', 'lot_number'].forEach(key => {
                const cell = document.createElement('td'); cell.textContent = slot[key]; row.appendChild(cell);
            });
            const availabilityCell = document.createElement('td');
            availabilityCell.textContent = slot.is_available ? 'Available' : 'Occupied';
            row.appendChild(availabilityCell);
            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit'; editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => editParkingSlot(slot));
            actionsCell.appendChild(editButton);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete'; deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteParkingSlot(slot.slot_id));
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        parkingSlotTableContainer.appendChild(table);
    }

    function editParkingSlot(slot) {
       const row = Array.from(parkingSlotTableContainer.querySelectorAll('table tbody tr'))
           .find(r => r.querySelector('td:nth-child(2)')?.textContent === slot.lot_number && r.querySelector('td:nth-child(1)')?.textContent == slot.location_id); // Match lot and location ID

       if (!row) { console.error('Row not found for slot:', slot.lot_number); return; }

       const cells = row.querySelectorAll('td');
       const locationIdCell = cells[0];
       const lotNumberCell = cells[1];
       const availabilityCell = cells[2];
       const actionsCell = cells[3];

       locationIdCell.innerHTML = `<input type="number" value="${slot.location_id}" disabled>`; // Keep location ID, but disable editing usually
       lotNumberCell.innerHTML = `<input type="text" value="${slot.lot_number}">`;
       availabilityCell.innerHTML = `
         <select>
           <option value="1" ${slot.is_available ? 'selected' : ''}>Available</option>
           <option value="0" ${!slot.is_available ? 'selected' : ''}>Occupied</option>
         </select>
       `;
       actionsCell.innerHTML = `<button class="save-button">Save</button><button class="cancel-button">Cancel</button>`;
       const saveButton = actionsCell.querySelector('.save-button');
       const cancelButton = actionsCell.querySelector('.cancel-button');

       saveButton.addEventListener('click', async () => {
           const updatedLotNumber = lotNumberCell.querySelector('input').value;
           const updatedAvailability = availabilityCell.querySelector('select').value;
           const updatedSlot = {
               slot_id: slot.slot_id,
               location_id: slot.location_id, // Keep original location_id
               lot_number: updatedLotNumber,
               is_available: updatedAvailability === '1',
           };
           try {
               const response = await fetch(`${backendUrl}/api/parking-slots/${slot.slot_id}`, { // Use dynamic URL
                   method: 'PUT',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(updatedSlot)
               });
               if (response.ok) { fetchAndDisplayParkingSlots(); }
               else { console.error('Failed to update slot', await response.text()); alert('Failed to save slot.');}
           } catch (error) { console.error('Error updating slot:', error); alert('Error saving slot.');}
       });
       cancelButton.addEventListener('click', () => fetchAndDisplayParkingSlots());
    }

    async function deleteParkingSlot(slotId) {
        if (confirm('Are you sure you want to delete this parking slot?')) {
            try {
                const response = await fetch(`${backendUrl}/api/parking-slots/${slotId}`, { method: 'DELETE' }); // Use dynamic URL
                if (!response.ok) { throw new Error(`Failed to delete slot (${response.status})`); }
                fetchAndDisplayParkingSlots();
            } catch (error) { console.error('Error deleting slot:', error); alert('Failed to delete parking slot'); }
        }
    }

    if (parkingSlotManagementSection && parkingSlotManagementPopup && parkingSlotTableContainer && parkingSlotCloseButton && addParkingSlotBtn && addParkingSlotFormContainer) {
        parkingSlotManagementSection.addEventListener('click', () => { fetchAndDisplayParkingSlots(); parkingSlotManagementPopup.style.display = 'block'; });
        parkingSlotCloseButton.addEventListener('click', () => { parkingSlotManagementPopup.style.display = 'none'; addParkingSlotFormContainer.innerHTML = ''; });
        window.addEventListener('click', (event) => { if (event.target == parkingSlotManagementPopup) { parkingSlotManagementPopup.style.display = 'none'; addParkingSlotFormContainer.innerHTML = ''; } });

        addParkingSlotBtn.addEventListener('click', async () => {
            // Fetch locations to populate a dropdown
             let locationOptions = '<option value="">Select Location</option>';
             try {
                 const locResponse = await fetch(`${backendUrl}/api/locations`);
                 if (locResponse.ok) {
                     const locations = await locResponse.json();
                     locations.forEach(loc => {
                         locationOptions += `<option value="${loc.location_id}">${loc.name} (ID: ${loc.location_id})</option>`;
                     });
                 } else {
                     console.error("Could not fetch locations for dropdown");
                 }
             } catch(err) {
                  console.error("Error fetching locations:", err);
             }

            addParkingSlotFormContainer.innerHTML = `
                <h3>Add New Parking Slot</h3>
                <form id="addParkingSlotForm">
                    <label>Location:
                        <select id="location_id" name="location_id" required>
                            ${locationOptions}
                        </select>
                    </label><br>
                    <label>Lot Number:<input type="text" id="lot_number" name="lot_number" required></label><br>
                    <label>Availability:
                        <select id="is_available" name="is_available">
                            <option value="1">Available</option>
                            <option value="0">Occupied</option>
                        </select>
                    </label><br>
                    <button type="submit">Add Parking Slot</button> <button type="button" id="cancelAddSlot">Cancel</button>
                </form>`;

            const addParkingSlotForm = document.getElementById('addParkingSlotForm');
            const cancelAddSlotBtn = document.getElementById('cancelAddSlot');

            addParkingSlotForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(addParkingSlotForm);
                const newSlot = {
                    location_id: formData.get('location_id'),
                    lot_number: formData.get('lot_number'),
                    is_available: formData.get('is_available') === "1"
                };
                try {
                    const response = await fetch(`${backendUrl}/api/parking-slots`, { // Use dynamic URL
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newSlot)
                    });
                    if (response.ok) {
                        fetchAndDisplayParkingSlots();
                        addParkingSlotFormContainer.innerHTML = '';
                    } else { console.error('Failed to add slot', await response.text()); alert('Failed to add slot.');}
                } catch (error) { console.error('Error adding slot:', error); alert('Error adding slot.');}
            });
            cancelAddSlotBtn.addEventListener('click', () => {
                 addParkingSlotFormContainer.innerHTML = '';
            });
        });
    } else { console.warn("One or more Parking Slot Management elements are missing."); }


    // --- Reservation Management ---
    const reservationManagementSection = document.getElementById('reservationManagementSection');
    const reservationManagementPopup = document.getElementById('reservationManagementPopup');
    const reservationTableContainer = document.getElementById('reservationTableContainer');
    const reservationCloseButton = reservationManagementPopup?.querySelector('.close');

    async function fetchAndDisplayReservations() {
        try {
            const response = await fetch(`${backendUrl}/api/reservations`); // Use dynamic URL
            if (!response.ok) { throw new Error(`Failed to fetch reservations (${response.status})`); }
            const reservations = await response.json();
            renderReservationsTable(reservations);
        } catch (error) { console.error('Error fetching reservations:', error); reservationTableContainer.innerHTML = '<p>Error loading reservations.</p>'; }
    }

    function renderReservationsTable(reservations) {
        reservationTableContainer.innerHTML = '';
        const tableContainer = document.createElement('div');
        tableContainer.classList.add('table-responsive');
        const table = document.createElement('table');
        table.classList.add('reservation-table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Email','Location','Slot','Enter After','Exit Before','Price','Start','End','Package','Actions'];
        headers.forEach(headerText => { const th = document.createElement('th'); th.textContent = headerText; headerRow.appendChild(th); });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        reservations.forEach(res => {
            const row = document.createElement('tr');
            const keys = ['email','location_name','lot_number','enter_after','exit_before','total_price','start_date','end_date','package_type'];
            keys.forEach(key => {
                const cell = document.createElement('td'); cell.textContent = res[key] || 'N/A'; row.appendChild(cell);
            });
            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete'; deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteReservation(res.reservation_id));
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        reservationTableContainer.appendChild(tableContainer);
    }

    async function deleteReservation(reservationId) {
        if (confirm('Are you sure you want to delete this reservation?')) {
            try {
                const response = await fetch(`${backendUrl}/api/reservations/${reservationId}`, { method: 'DELETE' }); // Use dynamic URL
                if (!response.ok) { throw new Error(`Failed to delete reservation (${response.status})`); }
                fetchAndDisplayReservations();
            } catch (error) { console.error('Error deleting reservation:', error); alert('Failed to delete reservation'); }
        }
    }

     if (reservationManagementSection && reservationManagementPopup && reservationTableContainer && reservationCloseButton) {
        reservationManagementSection.addEventListener('click', () => { fetchAndDisplayReservations(); reservationManagementPopup.style.display = 'block'; });
        reservationCloseButton.addEventListener('click', () => { reservationManagementPopup.style.display = 'none'; });
        window.addEventListener('click', (event) => { if (event.target == reservationManagementPopup) { reservationManagementPopup.style.display = 'none'; } });
    } else { console.warn("One or more Reservation Management elements are missing."); }


    // --- Pricing Management ---
    const pricingManagementSection = document.getElementById('pricingManagementSection');
    const pricingManagementPopup = document.getElementById('pricingManagementPopup');
    const pricingTableContainer = document.getElementById('pricingTableContainer');
    const pricingCloseButton = pricingManagementPopup?.querySelector('.close');
    const addPriceBtn = document.getElementById('addPriceBtn');
    const addPriceFormContainer = document.getElementById('addPriceFormContainer');

    async function fetchAndDisplayPrices() {
        try {
            const response = await fetch(`${backendUrl}/api/prices`); // Use dynamic URL
            if (!response.ok) { throw new Error(`Failed to fetch prices (${response.status})`); }
            const prices = await response.json();
            renderPricingTable(prices);
        } catch (error) { console.error('Error fetching prices:', error); pricingTableContainer.innerHTML = '<p>Error loading prices.</p>'; }
    }

    function renderPricingTable(prices) {
      pricingTableContainer.innerHTML = '';
      const table = document.createElement('table');
      table.classList.add('pricing-table');
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      const headers = ['Location Name','Address','Lot Number','Hourly Rate','Monthly Rate','Actions'];
      headers.forEach(headerText => { const th = document.createElement('th'); th.textContent = headerText; headerRow.appendChild(th); });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      prices.forEach(price => {
          const row = document.createElement('tr');
          const keys = ['location_name','location_address','lot_number','hourly','monthly'];
          keys.forEach(key => {
              const cell = document.createElement('td'); cell.textContent = price[key] ?? 'N/A'; row.appendChild(cell); // Use ?? for nullish coalescing
          });
          const actionsCell = document.createElement('td');
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit'; editButton.classList.add('edit-button');
          editButton.addEventListener('click', () => editPrice(price));
          actionsCell.appendChild(editButton);
          // Add delete button if needed
          // const deleteButton = document.createElement('button'); ... actionsCell.appendChild(deleteButton);
          row.appendChild(actionsCell);
          tbody.appendChild(row);
      });
      table.appendChild(tbody);
      pricingTableContainer.appendChild(table);
    }

    function editPrice(price) {
        const row = Array.from(pricingTableContainer.querySelectorAll('table tbody tr'))
            .find(r =>
              r.querySelector('td:nth-child(1)')?.textContent === price.location_name &&
              r.querySelector('td:nth-child(2)')?.textContent === price.location_address &&
              r.querySelector('td:nth-child(3)')?.textContent === price.lot_number
            );

        if (!row) { console.error('Row not found for price:', price); return; }

        const cells = row.querySelectorAll('td');
        // Indices: 0:Name, 1:Address, 2:Lot, 3:Hourly, 4:Monthly, 5:Actions
        const hourlyRateCell = cells[3];
        const monthlyRateCell = cells[4];
        const actionsCell = cells[5];

        if (!hourlyRateCell || !monthlyRateCell || !actionsCell) {
            console.error("Could not find required cells for editing price.");
            return;
        }

        hourlyRateCell.innerHTML = `<input type="number" step="0.01" min="0" value="${price.hourly || 0}">`; // Set default to 0 if null
        monthlyRateCell.innerHTML = `<input type="number" step="0.01" min="0" value="${price.monthly || 0}">`; // Set default to 0 if null
        actionsCell.innerHTML = `<button class="save-button">Save</button><button class="cancel-button">Cancel</button>`;
        const saveButton = actionsCell.querySelector('.save-button');
        const cancelButton = actionsCell.querySelector('.cancel-button');

        saveButton.addEventListener('click', async () => {
            const updatedHourlyRate = hourlyRateCell.querySelector('input').value;
            const updatedMonthlyRate = monthlyRateCell.querySelector('input').value;
            const updatedPrice = {
                price_id: price.price_id,
                hourly: parseFloat(updatedHourlyRate) || 0, // Ensure it's a number
                monthly: parseFloat(updatedMonthlyRate) || 0, // Ensure it's a number
            };
            try {
                const response = await fetch(`${backendUrl}/api/prices/${price.price_id}`, { // Use dynamic URL
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedPrice)
                });
                if (response.ok) { fetchAndDisplayPrices(); }
                else { console.error('Failed to update price', await response.text()); alert('Failed to save price.');}
            } catch (error) { console.error('Error updating price:', error); alert('Error saving price.');}
        });
        cancelButton.addEventListener('click', () => fetchAndDisplayPrices());
    }

    async function fetchLocationsAndSlotsForPricing() {
        try {
            const [locRes, slotRes] = await Promise.all([
                fetch(`${backendUrl}/api/locations`), // Use dynamic URL
                fetch(`${backendUrl}/api/parking-slots`) // Use dynamic URL
            ]);
            if (!locRes.ok || !slotRes.ok) {
                console.error("Failed to fetch locations or slots for pricing");
                return { locations: [], parkingSlots: [] };
            }
            const locations = await locRes.json();
            const parkingSlots = await slotRes.json();
            return { locations, parkingSlots };
        } catch (error) {
            console.error('Error fetching locations and slots:', error);
            return { locations: [], parkingSlots: [] };
        }
    }

    if (pricingManagementSection && pricingManagementPopup && pricingTableContainer && pricingCloseButton && addPriceBtn && addPriceFormContainer) {
        pricingManagementSection.addEventListener('click', () => { fetchAndDisplayPrices(); pricingManagementPopup.style.display = 'block'; });
        pricingCloseButton.addEventListener('click', () => { pricingManagementPopup.style.display = 'none'; addPriceFormContainer.innerHTML = ''; });
        window.addEventListener('click', (event) => { if (event.target == pricingManagementPopup) { pricingManagementPopup.style.display = 'none'; addPriceFormContainer.innerHTML = ''; } });

        addPriceBtn.addEventListener('click', async () => {
            const { locations, parkingSlots } = await fetchLocationsAndSlotsForPricing();

            let locationOptions = '<option value="">Select Location</option>';
            locations.forEach(loc => { locationOptions += `<option value="${loc.location_id}">${loc.name} - ${loc.address}</option>`; });

            addPriceFormContainer.innerHTML = `
                <h3>Add New Price</h3>
                <form id="addPriceForm">
                  <label>Location:<select id="location_id" name="location_id" required>${locationOptions}</select></label><br>
                  <label>Lot Number:<select id="slot_id" name="slot_id" required><option value="">Select Location First</option></select></label><br>
                  <label>Hourly Rate:<input type="number" step="0.01" min="0" id="hourly" name="hourly" required></label><br>
                  <label>Monthly Rate:<input type="number" step="0.01" min="0" id="monthly" name="monthly" required></label><br>
                  <button type="submit">Add Price</button> <button type="button" id="cancelAddPrice">Cancel</button>
                </form>`;

            const locationSelect = document.getElementById('location_id');
            const slotSelect = document.getElementById('slot_id');
            const addPriceForm = document.getElementById('addPriceForm');
            const cancelAddPriceBtn = document.getElementById('cancelAddPrice');


            locationSelect.addEventListener('change', (event) => {
                const selectedLocationId = event.target.value;
                slotSelect.innerHTML = '<option value="">Select Lot Number</option>'; // Reset
                if (selectedLocationId) {
                    parkingSlots
                        .filter(slot => slot.location_id == selectedLocationId)
                        .forEach(slot => {
                            const option = document.createElement('option');
                            option.value = slot.slot_id; // Use slot_id as value for price table
                            option.textContent = slot.lot_number;
                            slotSelect.appendChild(option);
                        });
                }
            });

            addPriceForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(addPriceForm);
                const newPrice = {
                    slot_id: formData.get('slot_id'), // Changed from lot_number to slot_id
                    hourly: parseFloat(formData.get('hourly')) || 0,
                    monthly: parseFloat(formData.get('monthly')) || 0
                };

                // Basic validation
                if (!newPrice.slot_id) {
                    alert("Please select a Lot Number.");
                    return;
                }

                try {
                    const response = await fetch(`${backendUrl}/api/prices`, { // Use dynamic URL
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newPrice)
                    });
                    if (response.ok) {
                        fetchAndDisplayPrices();
                        addPriceFormContainer.innerHTML = '';
                    } else { console.error('Failed to add price', await response.text()); alert('Failed to add price.');}
                } catch (error) { console.error('Error adding price:', error); alert('Error adding price.');}
            });
            cancelAddPriceBtn.addEventListener('click', () => {
                 addPriceFormContainer.innerHTML = '';
            });
        });
    } else { console.warn("One or more Pricing Management elements are missing."); }

} 