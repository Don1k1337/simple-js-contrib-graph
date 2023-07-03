const fetchData = async () => {
    try {
        const response = await fetch('https://dpg.gg/test/calendar.json');
        const data = await response.json();

        const squaresUl = document.querySelector('.squares');

        // Sort the dates in ascending order
        const sortedDates = Object.keys(data).sort();

        // Create an array of weekdays in the desired order (Sunday to Saturday)
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Get the current date to determine the offset
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // Sunday is 0, Monday is 1, etc.

        // Calculate the offset to align the first day in the data with Sunday
        const offset = currentDay === 0 ? 0 : 7 - currentDay;

        for (let i = offset; i < sortedDates.length + offset; i++) {
            // Get the index of the weekday, modulo 7 to handle wrap-around
            const weekdayIndex = i % 7;

            // Get the corresponding weekday name
            const weekdayName = weekdays[weekdayIndex];

            // Get the date for the current weekday
            const dateIndex = i - offset;
            const date = sortedDates[dateIndex];
            const level = data[date] || 0; // Use the level from the data or default to 0

            const li = document.createElement('li');
            li.setAttribute('data-level', level);
            squaresUl.appendChild(li);

            let isSquareClicked = false;
            let isPopupDisplayed = false;

            // Function to show or hide the popup based on click status
            const togglePopup = () => {
                if (isPopupDisplayed) {
                    const popup = document.querySelector('.popup');
                    popup.style.display = 'none';
                    isPopupDisplayed = false;
                } else {
                    const commitCount = parseInt(level);
                    const hasDataLevel = li.hasAttribute('data-level');
                    const isDefaultColor = getComputedStyle(li).backgroundColor === 'rgb(237, 237, 237)';

                    if (hasDataLevel && commitCount > 0 && !isDefaultColor) {
                        const commitDate = new Date(date);
                        const dayOfWeek = weekdayName;
                        const month = commitDate.toLocaleDateString('en-US', { month: 'long' });
                        const day = commitDate.toLocaleDateString('en-US', { day: 'numeric' });
                        const popup = document.querySelector('.popup');

                        // Set the popup content and position
                        popup.innerHTML = `<div class="squares__contributions"><h2>${commitCount} contribution${commitCount !== 1 ? 's' : ''}</h2></div><p class="squares__contributions-date">${dayOfWeek}, ${month} ${day}, ${commitDate.getFullYear()}</p>`;
                        popup.style.left = `${event.pageX}px`;
                        popup.style.top = `${event.pageY}px`;

                        // Show the popup
                        popup.style.display = 'block';
                        isPopupDisplayed = true;
                    }
                }
            };

            // Add click event listener to each square
            li.addEventListener('click', (event) => {
                isSquareClicked = true;
                togglePopup();
            });

            li.addEventListener('mouseenter', (event) => {
                if (!isSquareClicked) {
                    togglePopup();
                }
            });

            li.addEventListener('mouseleave', (event) => {
                if (!isSquareClicked) {
                    const popup = document.querySelector('.popup');
                    popup.style.display = 'none';
                    isPopupDisplayed = false;
                }
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

(async () => {
    await fetchData();
})();
