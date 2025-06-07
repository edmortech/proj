document.addEventListener('DOMContentLoaded', function () {
    const datetimeContainer = document.querySelector('.datetime-container');
    const datetimeLabel = document.querySelector('.datetime-label');
    const datetimePicker = document.getElementById('datetime-picker');
    const datetimePlaceholder = document.getElementById('datetime-placeholder');
    const datetimeSubmit = document.getElementById('datetime-submit');
    const calendar = document.getElementById('calendar');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    // Initialize date and time variables
    window.selectedStartDate = null;
    window.selectedEndDate = null; // Make sure it is a window property
    let enterAfterTime = null;
    let exitBeforeTime = null;

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectionCount = 0;

    // Array of day names
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Toggle datetime picker visibility
    datetimeLabel.addEventListener('click', function () {
        datetimePicker.style.display = (datetimePicker.style.display === 'none' || datetimePicker.style.display === '') ?
            'block' : 'none';
        generateCalendar(currentYear, currentMonth);
    });

    // Set initial placeholder
    function setInitialPlaceholder() {
        const now = new Date();
        const startHour = now.getHours();
        const startMinutes = now.getMinutes();
        const endHour = (startHour + 2) % 24;
        const endMinutes = startMinutes;
        const formattedStartTime = String(startHour).padStart(2, '0') + ':' + String(startMinutes).padStart(2, '0');
        const formattedEndTime = String(endHour).padStart(2, '0') + ':' + String(endMinutes).padStart(2, '0');
        datetimePlaceholder.innerHTML = `Where do you need to park?<br>Today, ${formattedStartTime} - ${formattedEndTime}`;
    }

    setInitialPlaceholder();

    // Hide datetime picker on submit
    datetimeSubmit.addEventListener('click', function () {
        datetimePicker.style.display = 'none';

        enterAfterTime = document.getElementById('enter-after').value;
        exitBeforeTime = document.getElementById('exit-before').value;

        if (!window.selectedStartDate) {
            alert("Please select a start date.");
            return;
        }

        if (!enterAfterTime || !exitBeforeTime) {
            alert("Please select enter and exit times.");
            return;
        }

        // Format Dates
        const formattedStartDate = window.selectedStartDate.toISOString().split('T')[0];
        const formattedEndDate = window.selectedEndDate ? window.selectedEndDate.toISOString().split('T')[0] : formattedStartDate; // Use start date as default for end date

       console.log("Formatted Start Date:", formattedStartDate);
       console.log("Formatted End Date:", formattedEndDate);
       console.log("Enter After Time:", enterAfterTime);
       console.log("Exit Before Time:", exitBeforeTime);

        // Update the placeholder text with selected dates and times
        updatePlaceholderText(formattedStartDate, formattedEndDate, enterAfterTime, exitBeforeTime);
    });

    // Helper function to update the placeholder text
    function updatePlaceholderText(startDate, endDate, enterTime, exitTime) {
        if (startDate === endDate) {
            // Single day selection
            const formattedDate = new Date(startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            datetimePlaceholder.textContent = `${formattedDate}, ${enterTime} - ${exitTime}`;
        } else {
            // Multi-day selection
            const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            datetimePlaceholder.textContent = `${formattedStartDate}, ${enterTime} - ${formattedEndDate}, ${exitTime}`;
        }
    }

    // Generate calendar
    function generateCalendar(year, month) {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDayOfWeek = firstDayOfMonth.getDay();
        const today = new Date();

        calendar.innerHTML = '';

        document.getElementById('current-month-year').textContent = new Date(year, month).toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });

        // Create day name header
        for (let i = 0; i < dayNames.length; i++) {
            const dayNameCell = document.createElement('div');
            dayNameCell.classList.add('day-name');
            dayNameCell.textContent = dayNames[i];
            calendar.appendChild(dayNameCell);
        }

        // Empty cells before the first day
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day', 'empty');
            calendar.appendChild(emptyCell);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.textContent = day;

            const currentDate = new Date(year, month, day);
            if (currentDate < today.setHours(0, 0, 0, 0)) {
                dayCell.classList.add('inactive');
            } else {
                dayCell.addEventListener('click', function () {
                    handleDateSelection(currentDate);
                });
            }

            calendar.appendChild(dayCell);
        }
    }

    // Handle date selection
    function handleDateSelection(date) {
        selectionCount++;

        if (selectionCount === 1) {
            window.selectedStartDate = date;
            window.selectedEndDate = null;
        } else if (selectionCount === 2) {
            if (date >= window.selectedStartDate) {
                window.selectedEndDate = date;
            } else {
                window.selectedStartDate = date;
                window.selectedEndDate = null;
                selectionCount = 1;
            }
        } else {
            window.selectedStartDate = date;
            window.selectedEndDate = null;
            selectionCount = 1;
        }
        highlightSelectedRange();
    }

    // Highlight selected date range
    function highlightSelectedRange() {
        const dayCells = document.querySelectorAll('.calendar .day');
        dayCells.forEach(cell => {
            cell.classList.remove('start-date', 'end-date', 'in-range');
        });

        if (!window.selectedStartDate) return;

        const startCellDate = new Date(window.selectedStartDate.getFullYear(), window.selectedStartDate.getMonth(),
            window.selectedStartDate.getDate());
        const endCellDate = window.selectedEndDate ? new Date(window.selectedEndDate.getFullYear(), window.selectedEndDate.getMonth(),
            window.selectedEndDate.getDate()) : null;

        dayCells.forEach(cell => {
            if (cell.classList.contains('empty') || cell.classList.contains('inactive')) return;

            const cellDate = new Date(currentYear, currentMonth, cell.textContent);

            if (cellDate.getTime() === startCellDate.getTime()) {
                cell.classList.add('start-date');
            } else if (endCellDate && cellDate.getTime() === endCellDate.getTime()) {
                cell.classList.add('end-date');
            } else if (endCellDate && cellDate > startCellDate && cellDate < endCellDate) {
                cell.classList.add('in-range');
            }
        });
    }

    // Previous and next month navigation
    prevMonthButton.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentYear, currentMonth);
    });

    nextMonthButton.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentYear, currentMonth);
    });

    // Custom Time Selector Logic
    function generateTimeOptions(selectElementId) {
        const timeOptions = document.getElementById(selectElementId + '-options');
        timeOptions.innerHTML = '';

        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const formattedHour = String(hour).padStart(2, '0');
                const formattedMinute = String(minute).padStart(2, '0');
                const time = `${formattedHour}:${formattedMinute}`;

                const timeButton = document.createElement('button');
                timeButton.textContent = time;
                timeButton.addEventListener('click', function () {
                    document.getElementById(selectElementId).value = time;
                    timeOptions.classList.remove('show');
                });
                timeOptions.appendChild(timeButton);
            }
        }

        const timeSelect = document.getElementById(selectElementId);
        timeSelect.addEventListener('click', function (event) {
            event.stopPropagation();
            timeOptions.classList.toggle('show');
        });
    }

    generateTimeOptions('enter-after');
    generateTimeOptions('exit-before');

    // Prevent time selector from closing when clicking outside
    document.addEventListener('click', function (event) {
        const enterAfterOptions = document.getElementById('enter-after-options');
        const exitBeforeOptions = document.getElementById('exit-before-options');

        if (!datetimeContainer.contains(event.target) &&
            event.target !== document.getElementById('datetime-input') &&
            !enterAfterOptions.contains(event.target) &&
            event.target !== document.getElementById('enter-after') &&
            !exitBeforeOptions.contains(event.target) &&
            event.target !== document.getElementById('exit-before')
        ) {
            datetimePicker.style.display = 'none';
        }
    });

    // Initialization
    generateCalendar(currentYear, currentMonth);
});