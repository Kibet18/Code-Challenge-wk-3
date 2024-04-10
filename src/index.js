// Your code here
// Define the URL for the API
const URL = 'http://localhost:3000';
// Get the movie list element from the DOM
const movieList = document.getElementById('films');

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Remove the first movie item (assuming it's a placeholder)
  document.getElementsByClassName('film item')[0].remove();
  // Fetch movie details and movies
  fetchMovieDetails(URL);
  fetchMovies(URL);
});

// Function to fetch movie details
function fetchMovieDetails(url) {
  // Fetch movie details for a specific movie (ID 1)
  fetch(`${URL}/films/1`)
    .then((response) => response.json())
    .then((data) => {
      // Set up the movie details on the webpage
      setUpMovieDetails(data);
    });
}

// Function to fetch and display all movies
function fetchMovies(url) {
  // Fetch all movies
  fetch(`${URL}/films`)
    .then((resp) => resp.json())
    .then((movies) => {
      // For each movie, display it on the webpage
      movies.forEach((movie) => {
        displayMovie(movie);
      });
    });
}

// Function to display a single movie
function displayMovie(movie) {
  // Create a list item for the movie
  const list = document.createElement('li');
  list.classList.add('film', 'item');
  list.style.cursor = 'pointer';
  list.textContent = movie.title;
  list.dataset.id = movie.id;

  // Create a delete button for the movie
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-btn');
  list.appendChild(deleteButton);

  // Add the movie to the movie list
  movieList.appendChild(list);

  // Event listener for the delete button
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const confirmDelete = confirm('Are you sure you want to delete this movie');
    if (confirmDelete) {
      // If confirmed, delete the movie
      deleteFilm(movie.id);
    }
  });

  // Check if the movie is sold out and update the list item
  if (movie.tickets_sold >= movie.capacity) {
    list.classList.add('sold out');
  }
}

// Function to set up movie details on the webpage
function setUpMovieDetails(AmazingMovie) {
  // Set up movie details elements on the webpage
  const preview = document.getElementById('poster');
  preview.src = AmazingMovie.poster;

  const movieTitle = document.querySelector('#title');
  movieTitle.textContent = AmazingMovie.title;

  const movieTime = document.querySelector('#runtime');
  movieTime.textContent = `${AmazingMovie.runtime} minutes`;

  const movieDescription = document.querySelector('#film-info');
  movieDescription.textContent = AmazingMovie.description;

  const showTime = document.querySelector('#showtime');
  showTime.textContent = AmazingMovie.showtime;

  const remainingTickets = document.querySelector('#ticket-num');
  remainingTickets.textContent = AmazingMovie.capacity - AmazingMovie.tickets_sold;

  const buyTicketButton = document.getElementById('buy-ticket');
  buyTicketButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (remainingTickets.textContent > 0) {
      remainingTickets.textContent = parseInt(remainingTickets.textContent, 10) - 1;
      // Update tickets sold on the server
      fetch(`${URL}/films/${AmazingMovie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tickets_sold: AmazingMovie.tickets_sold + 1,
        }),
      });
      // Record ticket purchase
      fetch(`${URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          film_id: AmazingMovie.id,
          number_of_tickets: 1,
        }),
      });
    } else {
      buyTicketButton.textContent = 'Sold Out';
    }
  });
}

// Function to delete a movie
function deleteFilm(id) {
  // Send a DELETE request to the server to delete the movie
  fetch(`${URL}/films/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      // Remove the movie item from the DOM
      const filmItem = document.querySelector(`#films li[data-id="${id}"]`);
      filmItem.remove();
    })
    .catch((error) => console.error('Error deleting film:', error));
}