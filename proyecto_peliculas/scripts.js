const apiKey = 'e61e4b945fdd41c62fa468771489b8b5'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
const removeFromFavoritesButton = document.getElementById('remove-from-favorites');
const favoriteBanner = document.getElementById('favorite-banner');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch and display popular movies
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
        if(!response.ok) throw new Error("Error al encontrar la pelicula: ");

        const data = await response.json();
        displayMovies(data.results); // Llama a displayMovies con los resultados
        
    } catch (error) {
        console.error('Error al buscar películas populares:', error);
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=es`);
        if(!response.ok) throw new Error("No se pudieron obtener los detalles de la película");
        
        const movie = await response.json();
        detailsContainer.innerHTML = `
            <h3>${movie.title}</h3>
            <p>${movie.overview}</p>
            <p><strong>Fecha de lanzamiento:</strong>${movie.release_date}</p>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        `;
        selectedMovieId = movieId;
        movieDetails.classList.remove('hidden');

        if (favoriteMovies.some(movie => movie.id === movieId)){
            addToFavoritesButton.classList.add('hidden');
            removeFromFavoritesButton.classList.remove('hidden');
        }else{
            addToFavoritesButton.classList.remove('hidden');
            removeFromFavoritesButton.classList.add('hidden');
        }
    } catch (error) {
        console.log('Error al recuperar los detalles de la película:', error);
        detailsContainer.innerHTML = `<p>No se pudieron cargar los detalles de la película. Por favor, inténtelo de nuevo más tarde.</p>`;
    }
}



// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
        try {
           const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=es`);
           if(!response.ok) throw new Error(`Error fetching search results`);

           const data = await response.json();
           if (data.results.length > 0){
                displayMovies(data.results);
           }else{
                movieList.innerHTML = `<p>No se encontraron películas para "${query}"</p>`;
           }
        } catch (error) {
            console.error('Error searching movies:', error);
            movieList.innerHTML = `<p>Hubo un error al buscar peliculas. Inténtalo de nuevo.</p>`;
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
            showBanner();

            addToFavoritesButton.classList.add('hidden');
            removeFromFavoritesButton.classList.remove('hidden');
        }
    }
});

removeFromFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        // Filtra la lista de favoritos para excluir la película seleccionada
        favoriteMovies = favoriteMovies.filter(movie => movie.id !== selectedMovieId);
        localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Actualiza localStorage
        displayFavorites(); // Muestra la lista actualizada de favoritos

        // Actualiza los botones de favoritos
        addToFavoritesButton.classList.remove('hidden');
        removeFromFavoritesButton.classList.add('hidden');
    }
});

function displayFavorites() {
    // Lógica para mostrar la lista de favoritos
    console.log('Favoritos actualizados:', favoriteMovies);
}

function showBanner(movieDetails) {
    favoriteBanner.textContent = `La película ha sido añadida a favoritos`;
    favoriteBanner.classList.remove('hidden');
    setTimeout(() => {
        favoriteBanner.classList.add('hidden');
    }, 2000); // Oculta el banner después de 3 segundos
}

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas