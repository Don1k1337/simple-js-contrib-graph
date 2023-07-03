const fetchData = async () => {
    try {
        const response = await fetch('https://dpg.gg/test/calendar.json');
        const data = await response.json();

        const squaresUl = document.querySelector('.graph__squares');

        // Get the keys (dates) from the data object
        const dates = Object.keys(data);

        // Create an array of weekdays in the desired order (Sun to Sat)
        const weekdays = [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота',
        ];

        // Get the current date to determine the offset
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // Sunday is 0, Monday is 1, etc.

        // Calculate the offset to align the first day in the data with Sunday
        const offset = currentDay === 0 ? 0 : 7 - currentDay;

        let selectedElement = null;

        for (let i = 0; i < dates.length; i++) {
            // Calculate the correct index for the date taking into account the offset
            const dateIndex = (i + offset) % dates.length;

            // Get the date for the current index
            const date = dates[dateIndex];
            const level = data[date] || 0;

            const li = document.createElement('li');
            li.setAttribute('data-level', level);
            squaresUl.appendChild(li);

            let isSquareClicked = false;
            let isPopupDisplayed = false;

            // Logic for show / hide the popup based on click status
            const togglePopup = (event) => {
                const li = event.currentTarget;
                if (isPopupDisplayed) {
                    const popup = document.querySelector('.popup');
                    popup.style.display = 'none';
                    isPopupDisplayed = false;
                } else {
                    const commitCount = parseInt(li.getAttribute('data-level'));
                    const isDefaultColor =
                        getComputedStyle(li).backgroundColor === 'rgb(237, 237, 237)';

                    if (!isNaN(commitCount) && commitCount > 0 && !isDefaultColor) {
                        const commitDate = new Date(date);
                        const dayOfWeek = weekdays[commitDate.getDay()]; // Get the weekday name directly from the date
                        const month = commitDate.toLocaleDateString('ru-RU', {
                            month: 'long',
                        });
                        const day = commitDate.toLocaleDateString('ru-RU', { day: 'numeric' });
                        const popup = document.querySelector('.popup');

                        // Set the popup content and position
                        popup.innerHTML = `<div class="squares__contributions"><h2>${commitCount} contribution${
                            commitCount !== 1 ? 's' : ''
                        }</h2></div><p class="squares__contributions-date">${dayOfWeek}, ${month} ${day}, ${commitDate.getFullYear()}</p>`;
                        popup.style.left = `${event.pageX}px`;
                        popup.style.top = `${event.pageY}px`;

                        // Show the popup
                        popup.style.display = 'block';
                        isPopupDisplayed = true;
                    }
                }
            };

            li.addEventListener('click', (event) => {
                // Check if there is a previously selected square
                if (selectedElement) {
                    selectedElement.classList.remove('selected');
                }

                const li = event.currentTarget;
                li.classList.add('selected');

                selectedElement = li;

                togglePopup(event);
            });

            li.addEventListener('mouseover', (event) => {
                const li = event.currentTarget;
                li.classList.add('highlighted');
            });

            li.addEventListener('mouseleave', (event) => {
                const li = event.currentTarget;
                li.classList.remove('highlighted');
                if (!isSquareClicked) {
                    const popup = document.querySelector('.popup');
                    popup.style.display = 'none';
                    isPopupDisplayed = false;
                    li.classList.remove('selected');
                    selectedElement = null;
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
