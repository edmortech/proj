// --- START OF FILE searchf.js ---

import getServerIP from './serveriip.js'; // Import the function

let backendUrl; // Variable to store the fetched backend URL

// --- Main Initialization Logic ---
document.addEventListener("DOMContentLoaded", async function () {
    try {
        backendUrl = await getServerIP(); // Fetch the backend URL once

        if (!backendUrl) {
            console.error("FATAL: Could not retrieve backend URL. Search functionality disabled.");
            // Optionally display a user-friendly error message on the page
            alert("Error: Could not connect to the server. Parking search is unavailable.");
            // Disable critical UI elements if needed
            const findParkingButton = document.getElementById("find-parking-spot");
            if(findParkingButton) findParkingButton.disabled = true;
            return; // Stop further execution
        }

        console.log("Using backend URL for search:", backendUrl); // Log the fetched URL

        // Initialize all functionalities after URL is successfully fetched
        initializeSearchFeatures();

    } catch (error) {
        console.error("Error during search page initialization:", error);
        alert("An error occurred while initializing the search page.");
    }
});


// --- Function to setup all elements and listeners ---
function initializeSearchFeatures() {

    // --- Element References ---
    const findParkingButton = document.getElementById("find-parking-spot");
    const parkingSpotPopup = document.getElementById("parkingSpotPopup");
    const closeParkingPopup = document.getElementById("closeParkingPopup");

    const paymentMethodPopup = document.getElementById("paymentMethodPopup");
    const closePaymentPopup = document.getElementById("closePaymentPopup");
    const paymentOverlay = document.getElementById('paymentOverlay');

    const searchInput = document.getElementById('search-input');
    const packageOptions = document.querySelectorAll('.package-option');
    const parkingSpotsTable = document.getElementById('parking-spots-table')?.getElementsByTagName('tbody')[0]; // Added optional chaining

    const filterButton = document.getElementById('filter-button');
    const filterPopup = document.querySelector('.filter-popup');
    const closeBtn = filterPopup?.querySelector('.filter-close-btn'); // Optional chaining
    const applyFiltersButton = filterPopup?.querySelector('.filter-apply-filters'); // Optional chaining
    const overlay = document.querySelector('.filter-overlay');

    const priceFilter = document.getElementById('price-filter-popup');
    const parkingTypeFilter = document.getElementById('parking-type-filter-popup');

    // --- Basic Popup Setup ---
    if (findParkingButton && parkingSpotPopup && closeParkingPopup) {
        // Note: Button listener moved below to where fetch happens
        closeParkingPopup.addEventListener("click", () => {
            parkingSpotPopup.style.display = "none";
        });
    } else {
        console.error("One or more elements related to parking spot popup not found!");
    }

    if (closePaymentPopup && paymentMethodPopup && paymentOverlay) {
        closePaymentPopup.addEventListener("click", () => {
            paymentMethodPopup.style.display = "none"; // Might want to use classList toggle here too
            paymentOverlay.classList.remove('show');
        });
         // Also close if clicking overlay outside the payment popup
        paymentOverlay.addEventListener('click', (event) => {
            if (event.target === paymentOverlay) { // Ensure click is on overlay itself
                 paymentMethodPopup.classList.remove('show');
                 paymentOverlay.classList.remove('show');
            }
        });
    } else {
        console.error("One or more elements related to payment popup not found!");
    }


    // --- Function Definitions ---

    // Function to toggle the payment popup's visibility
    function togglePaymentPopup() {
        // Use classList for consistency
        if (paymentMethodPopup) {
            paymentMethodPopup.classList.toggle('show');
             console.log("Toggling show class on paymentMethodPopup", paymentMethodPopup.classList.contains('show'));
        } else {
            console.error("paymentMethodPopup not found in togglePaymentPopup");
        }

        if (paymentOverlay) {
            paymentOverlay.classList.toggle('show');
             console.log("Toggling show class on paymentOverlay", paymentOverlay.classList.contains('show'));
        } else {
            console.error("paymentOverlay not found in togglePaymentPopup");
        }
    }

    // Function to populate the table with parking spots
    function populateParkingSpotsTable(data) {
        if (!parkingSpotsTable) {
            console.error("Parking spots table body not found!");
            return;
        }
        parkingSpotsTable.innerHTML = ''; // Clear previous results

        if (data && data.length > 0) {
            data.forEach(spot => {
                const row = parkingSpotsTable.insertRow();
                const lotCell = row.insertCell();
                const locationCell = row.insertCell();
                const costCell = row.insertCell();
                const parkingTypeCell = row.insertCell();
                const actionCell = row.insertCell();

                lotCell.textContent = spot.lot_number || 'N/A';
                locationCell.textContent = spot.location_name || 'N/A';
                costCell.textContent = spot.total_cost ?? 'N/A'; // Handle potential 0 cost
                parkingTypeCell.textContent = spot.parking_type || 'N/A';

                const reserveButton = document.createElement('button');
                reserveButton.textContent = 'Reserve';
                reserveButton.classList.add('reserve-button');
                reserveButton.addEventListener('click', () => {
                    if (parkingSpotPopup) {
                        parkingSpotPopup.style.display = "none"; // Hide the search results popup
                    }
                    showPaymentPopup(spot.slot_id, spot.total_cost); // Proceed to payment
                });
                actionCell.appendChild(reserveButton);
            });
             // Show the popup *after* populating it
             if (parkingSpotPopup) {
                parkingSpotPopup.style.display = "block";
            }
        } else {
            const row = parkingSpotsTable.insertRow();
            const noResultsCell = row.insertCell();
            noResultsCell.colSpan = 5;
            noResultsCell.textContent = 'No parking spots available matching your criteria.';
             // Show the popup even if no results, to display the message
             if (parkingSpotPopup) {
                parkingSpotPopup.style.display = "block";
            }
        }
    }

     // Function to get user ID from local storage
    function getUserId() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
             console.error('User ID not found in local storage.');
             alert('You must be logged in to reserve a spot.'); // Inform user
        }
        return userId;
    }

    // Function to show the payment popup
    async function showPaymentPopup(slotId, totalCost) {
        const userId = getUserId();
        if (!userId) return; // Stop if user ID is not found

        try {
            console.log("Fetching payment methods for User ID:", userId);
            // *** USE DYNAMIC URL ***
            const response = await fetch(`${backendUrl}/paymentMethods?user_id=${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) { throw new Error(`Server Error: ${response.status}`); }
            const paymentMethods = await response.json();

            const paymentContainer = document.getElementById('paymentMethodsContainer');
            if (!paymentContainer) {
                 console.error("paymentMethodsContainer not found!");
                 return;
            }
            paymentContainer.innerHTML = ''; // Clear previous content

            const table = document.createElement('table');
            table.classList.add('payment-table');
            const thead = document.createElement('thead');
            thead.innerHTML = `<tr><th>Method Name</th><th>Provider</th><th>Account Number</th><th></th></tr>`;
            table.appendChild(thead);
            const tbody = document.createElement('tbody');

            if (paymentMethods && paymentMethods.length > 0) {
                paymentMethods.forEach(method => {
                    console.log("Processing Payment Method ID:", method.id);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${method.method_name || 'N/A'}</td>
                        <td>${method.provider || 'N/A'}</td>
                        <td>****${method.account_number ? method.account_number.slice(-4) : '****'}</td>
                        <td><button class="pay-button" data-slotid="${slotId}" data-cost="${totalCost}" data-methodid="${method.id}">Pay</button></td>
                    `;
                    // Add event listener directly here
                    row.querySelector('.pay-button').addEventListener('click', (event) => {
                        const btn = event.target;
                        console.log("Pay clicked - Slot:", btn.dataset.slotid, "Cost:", btn.dataset.cost, "Method ID:", btn.dataset.methodid);
                        processPayment(btn.dataset.slotid, btn.dataset.cost, btn.dataset.methodid);
                    });
                    tbody.appendChild(row);
                });
            } else {
                 const row = tbody.insertRow();
                 const cell = row.insertCell();
                 cell.colSpan = 4;
                 cell.textContent = "No payment methods found. Please add one in your profile.";
            }

            table.appendChild(tbody);
            paymentContainer.appendChild(table);

            console.log("Calling togglePaymentPopup from showPaymentPopup");
            togglePaymentPopup(); // Show the payment popup

        } catch (error) {
            console.error('Error fetching/displaying payment methods:', error);
            alert('Error fetching payment methods. Please ensure you are logged in and try again.');
            // Optionally hide popups if they were somehow shown
             if (paymentMethodPopup) paymentMethodPopup.classList.remove('show');
             if (paymentOverlay) paymentOverlay.classList.remove('show');
        }
    }

    // Function to process the payment
    async function processPayment(slotId, totalCost, paymethod_Id) {
        const userId = getUserId();
        if (!userId) return; // Double check user ID

        console.log("Processing Payment - Slot:", slotId, "Cost:", totalCost, "Method ID:", paymethod_Id);

        const payButton = document.querySelector(`.pay-button[data-methodid="${paymethod_Id}"]`); // Use correct data attribute
        let originalButtonText = 'Pay'; // Default
         if (payButton) {
            originalButtonText = payButton.textContent; // Store original text
            payButton.textContent = 'Processing...'; // Indicate loading
            payButton.disabled = true;
        }

        try {
            // Gather necessary reservation data again just before sending
            const enterAfterTime = document.getElementById('enter-after')?.value;
            const exitBeforeTime = document.getElementById('exit-before')?.value;
            const packageTypeElement = document.querySelector('.package-option.active');
            const locationValue = searchInput?.value;

            // Date validation/retrieval
            let selectedStartDateStr = null;
             if (window.selectedStartDate instanceof Date && !isNaN(window.selectedStartDate)) {
                 selectedStartDateStr = window.selectedStartDate.toISOString().split('T')[0];
             } else {
                 throw new Error("Invalid or missing start date.");
             }

            let selectedEndDateStr = selectedStartDateStr; // Default end date to start date
            if (window.selectedEndDate instanceof Date && !isNaN(window.selectedEndDate)) {
                selectedEndDateStr = window.selectedEndDate.toISOString().split('T')[0];
            }

            if (!packageTypeElement) { throw new Error("Package type not selected."); }
            const packageType = packageTypeElement.dataset.package;


            const requestBody = {
                slotId: slotId,
                totalCost: totalCost,
                paymethod_Id: paymethod_Id, // Ensure this key matches backend expectation
                enter_after: enterAfterTime,
                exit_before: exitBeforeTime,
                start_date: selectedStartDateStr,
                end_date: selectedEndDateStr,
                userId: userId,
                packageType: packageType,
                location: locationValue // Assuming backend needs location context for reservation
            };

             console.log("Sending to /processPayment:", JSON.stringify(requestBody, null, 2));


            // *** USE DYNAMIC URL ***
            const response = await fetch(`${backendUrl}/processPayment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            // It's good practice to check content type before parsing JSON
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                 let errorMsg = `Payment failed with status: ${response.status}`;
                 try {
                    const errorData = await response.json();
                    errorMsg += ` - ${errorData.message || 'Server error'}`;
                 } catch (e) {
                    errorMsg += ` - ${await response.text()}`; // Fallback to text if not JSON
                 }
                 throw new Error(errorMsg);
            }

             if (contentType && contentType.indexOf("application/json") !== -1) {
                 const paymentResult = await response.json();
                  console.log("Payment Result:", paymentResult);

                if (paymentResult.success) {
                    alert('Payment successful! Your parking spot is reserved.');

                    const paymentContainer = document.getElementById('paymentMethodsContainer'); // Get container again
                    if (paymentContainer && paymentResult.ticketHTML) {
                        // Create and append download link INSIDE the popup content area
                        const downloadLink = document.createElement('a');
                        downloadLink.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(paymentResult.ticketHTML);
                        downloadLink.download = `parking_ticket_${slotId}_${new Date().toISOString().split('T')[0]}.html`;
                        downloadLink.textContent = 'Download Your Ticket';
                        downloadLink.style.display = 'block'; // Make it visible
                        downloadLink.style.marginTop = '15px';
                        downloadLink.style.fontWeight = 'bold';
                        // Clear previous content and add link
                        paymentContainer.innerHTML = '';
                        paymentContainer.appendChild(downloadLink);
                        // Maybe add a message saying "Close this popup when done"
                         const closeMsg = document.createElement('p');
                         closeMsg.textContent = 'Please download your ticket and close this window.';
                         closeMsg.style.marginTop = '10px';
                         paymentContainer.appendChild(closeMsg);

                         // Do NOT automatically close the popup, let user download first.
                    } else {
                         // If no ticket HTML, just close
                         console.log("Payment successful, but no ticket HTML received or container not found.");
                          togglePaymentPopup(); // Hide the popup
                    }
                 } else {
                     // Use specific error message from backend if available
                    alert(`Payment failed: ${paymentResult.message || 'Please try again.'}`);
                 }
             } else {
                 // Handle non-JSON success response? Unlikely for this endpoint.
                 console.warn("Received non-JSON response from processPayment:", await response.text());
                 alert("Payment processed, but received an unexpected response format.");
                  togglePaymentPopup(); // Hide the popup
             }

        } catch (error) {
            console.error('Payment processing error:', error);
            alert(`Payment error: ${error.message || 'An unexpected error occurred.'}`);
             // Ensure popup is hidden on error if it was shown
            if (paymentMethodPopup?.classList.contains('show')) {
                togglePaymentPopup();
            }
        } finally {
            // Restore button state
            if (payButton) {
                 payButton.textContent = originalButtonText;
                payButton.disabled = false;
            }
        }
    }


    // --- Event Listeners Setup ---

    // Find Parking Spot Button Listener
    if (findParkingButton) {
        findParkingButton.addEventListener('click', async () => {
            const location = searchInput?.value || ''; // Default to empty string if null
            let packageType = '';
            packageOptions.forEach(option => {
                if (option.classList.contains('active')) {
                    packageType = option.dataset.package;
                }
            });

            // Date and Time retrieval
            const enterAfterTime = document.getElementById('enter-after')?.value;
            const exitBeforeTime = document.getElementById('exit-before')?.value;

            // Validation
            if (packageType === '') {
                alert("Please select a package type (Hourly or Monthly)."); return;
            }
            let selectedStartDateStr = null;
             if (window.selectedStartDate instanceof Date && !isNaN(window.selectedStartDate)) {
                 selectedStartDateStr = window.selectedStartDate.toISOString().split('T')[0];
             } else {
                 alert("Please select a valid start date."); return;
             }
             let selectedEndDateStr = selectedStartDateStr; // Default end date
             if (window.selectedEndDate instanceof Date && !isNaN(window.selectedEndDate)) {
                 selectedEndDateStr = window.selectedEndDate.toISOString().split('T')[0];
             }

            const requestData = {
                location: location,
                package: packageType,
                start_date: selectedStartDateStr,
                end_date: selectedEndDateStr,
                enter_after: enterAfterTime,
                exit_before: exitBeforeTime,
                 // Add filter values if they exist (check if filter logic needs adjustment)
                 priceFilterValue: priceFilter?.value, // Send filter values
                 parkingTypeFilterValue: parkingTypeFilter?.value // Send filter values
            };

             console.log("Finding parking with data:", JSON.stringify(requestData, null, 2));

            try {
                // Add a loading indicator maybe?
                findParkingButton.textContent = 'Searching...';
                findParkingButton.disabled = true;

                // *** USE DYNAMIC URL ***
                const response = await fetch(`${backendUrl}/findParking`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData)
                });

                if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
                const data = await response.json();

                populateParkingSpotsTable(data); // This will now show the popup

            } catch (error) {
                console.error('Error finding parking:', error);
                // Display error within the popup or as an alert
                 if (parkingSpotsTable) {
                     parkingSpotsTable.innerHTML = ''; // Clear previous results
                     const row = parkingSpotsTable.insertRow();
                     const errorCell = row.insertCell();
                     errorCell.colSpan = 5; // Adjust colspan as needed
                     errorCell.textContent = `Failed to fetch parking spots: ${error.message}. Please try again.`;
                     if (parkingSpotPopup) parkingSpotPopup.style.display = "block"; // Show popup with error
                 } else {
                     alert(`Failed to fetch parking spots: ${error.message}. Please try again.`);
                 }

            } finally {
                 // Restore button state
                 findParkingButton.textContent = 'Find Parking Spot';
                 findParkingButton.disabled = false;
            }
        });
    } else {
        console.error("Find Parking Button Element Not Found!");
    }


    // Filter Popup Listeners
    if (filterButton && filterPopup && closeBtn && applyFiltersButton && overlay) {
        filterButton.addEventListener('click', () => {
            filterPopup.style.display = 'block';
            overlay.style.display = 'block';
        });

        closeBtn.addEventListener('click', () => {
            filterPopup.style.display = 'none';
            overlay.style.display = 'none';
        });

        applyFiltersButton.addEventListener('click', () => {
            // Filter values are now read *inside* the findParkingButton listener just before fetch
            console.log("Applying filters - Price:", priceFilter?.value, "Type:", parkingTypeFilter?.value);
            filterPopup.style.display = 'none';
            overlay.style.display = 'none';

            // Trigger the search again
            if (findParkingButton) {
                 findParkingButton.click(); // Programmatically click the search button
            }
        });

        // Close filter popup on overlay click
        overlay.addEventListener('click', (event) => {
             if (event.target === overlay) { // Click on overlay itself
                 filterPopup.style.display = "none";
                 overlay.style.display = "none";
             }
        });

    } else {
         console.warn("One or more filter popup elements are missing.");
    }

     // Listener for package option selection (example)
     packageOptions.forEach(option => {
         option.addEventListener('click', () => {
             packageOptions.forEach(opt => opt.classList.remove('active')); // Remove active from all
             option.classList.add('active'); // Add active to clicked one
             console.log("Selected package:", option.dataset.package);
         });
     });


} 