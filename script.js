// OMDB API Configuration
const API_KEY = 'c02b70f4';
const API_URL = 'https://www.omdbapi.com/';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const noResults = document.getElementById('noResults');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Search Handler
function handleSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        showError('Please enter a movie title');
        return;
    }
    
    searchMovies(searchTerm);
}

// Search Movies Function
async function searchMovies(searchTerm) {
    // Show loading state
    showLoading();
    
    try {
        const response = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        hideLoading();
        
        if (data.Response === 'True') {
            displayMovies(data.Search);
        } else {
            showNoResults();
        }
    } catch (error) {
        hideLoading();
        showError('Failed to fetch movies. Please check your connection and try again.');
        console.error('Error fetching movies:', error);
    }
}

// Display Movies
function displayMovies(movies) {
    hideAllStates();
    resultsContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        resultsContainer.appendChild(movieCard);
    });
    
    resultsContainer.style.display = 'grid';
}

// Create Movie Card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const posterElement = movie.Poster && movie.Poster !== 'N/A' 
        ? `<div class="movie-poster"><img src="${movie.Poster}" alt="${movie.Title}" onerror="this.parentElement.innerHTML='<div class=\"placeholder-poster\">🎬</div>'"></div>`
        : `<div class="placeholder-poster">?</div>`;
    
    card.innerHTML = `
        ${posterElement}
        <div class="movie-info">
            <h3 class="movie-title">${movie.Title}</h3>
            <p class="movie-year">${movie.Year}</p>
        </div>
    `;
    
    return card;
}

// State Management Functions
function showLoading() {
    hideAllStates();
    loadingState.style.display = 'block';
}

function hideLoading() {
    loadingState.style.display = 'none';
}

function showError(message) {
    hideAllStates();
    errorMessage.textContent = message;
    errorState.style.display = 'block';
}

function showNoResults() {
    hideAllStates();
    noResults.style.display = 'block';
}

function hideAllStates() {
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    noResults.style.display = 'none';
    resultsContainer.style.display = 'none';
}