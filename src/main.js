const fetchData = async () => {
    try {
        const response = await fetch('https://dpg.gg/test/calendar.json');
        const data = await response.json();

        const squaresUl = document.querySelector('.squares');

        for (const date in data) {
            const level = data[date];
            const li = document.createElement('li');
            li.setAttribute('data-level', level);
            squaresUl.appendChild(li);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

(async () => {
    await fetchData();
})();