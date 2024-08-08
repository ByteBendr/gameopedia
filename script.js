document.getElementById('searchButton').addEventListener('click', function() {
    performSearch();
});

document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission if inside a form
        performSearch();
    }
});

function performSearch() {
    let query = document.getElementById('searchInput').value;

    // Replace 'YOUR_API_KEY' with the actual API key obtained from RAWG
    const apiKey = '2005b6aa77534992896a2d015073f606';

    if(query) {
        fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Attempt to parse the JSON
        })
        .then(data => {
            displayResults(data.results);
            prepareCSV(data.results);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('results').innerHTML = `<p>Error: ${error.message}</p>`;
        });
    }
}

function displayResults(games) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if(games && games.length > 0) {
        games.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('game');
            
            gameElement.innerHTML = `
                <img src="${game.background_image}" alt="${game.name}">
                <div class="game-details">
                    <h2>${game.name}</h2>
                    <p class="release-date">Released: ${game.released}</p>
                    <div class="rating">
                        <i class="fas fa-star"></i> ${game.rating}
                    </div>
                </div>
            `;

            resultsContainer.appendChild(gameElement);
        });
    } else {
        resultsContainer.innerHTML = '<p>No results found.</p>';
    }
}

function prepareCSV(games) {
    const csvRows = [
        ["Name", "Release Date", "Rating", "Image URL"]
    ];

    games.forEach(game => {
        const row = [
            game.name,
            game.released,
            game.rating,
            game.background_image
        ];
        csvRows.push(row);
    });

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    document.getElementById('downloadButton').onclick = () => downloadCSV(csvContent);
}

function downloadCSV(csvContent) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'games.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
