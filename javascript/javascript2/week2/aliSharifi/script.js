// Get DOM  Element
const moviePoster = document.getElementById("movie-poster");
const movieTitle = document.getElementById("movie-title");
const movieDescription = document.getElementById("movie-description");
const movieYear = document.getElementById("movie-year");
const movieDirector = document.getElementById("movie-director");
const moviePrice = document.getElementById("movie-price");
const movieActors = document.getElementById("movie-actors");
const stars = document.querySelectorAll(".stars i");
const ratingDisplay = document.getElementById("rating-display");
const commentInput = document.getElementById("comment-input");
const submitComment = document.getElementById("submit-comment");
const commentsList = document.getElementById("comments-list");

//Movies data
function getMovieRating(movieId) {
  const rating = localStorage.getItem(`movie-${movieId}-rating`);
  return rating ? parseInt(rating) : 0;
}

function displayRatingStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i class="fas fa-star ${i <= rating ? "active" : ""}"></i>`;
  }
  return stars;
}

function initializeMovies() {
  const moviesContainer = document.querySelector(".container");
  moviesContainer.innerHTML = "";

  // Create modal if it doesn't exist
  if (!document.querySelector(".modal")) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  movies.forEach((movie) => {
    const movieRating = getMovieRating(movie.id);
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    /* Notice 1 :(
    Since I didn’t have a database and had to store the data in the browser, I had to add the elements manually. Otherwise, the data could have been added in the backend, resulting in less code. I apologize for this.
    */
    movieCard.innerHTML = `
      <img src="${movie.poster_url}" alt="${
      movie.title
    } Poster" onerror="this.src='https://via.placeholder.com/600x900?text=No+Image+Available'" />
      <div class="movie-info">
        <h2>${movie.title}</h2>
        <p>${movie.description}</p>
        <div class="movie-brief">
          <p><strong>Year:</strong> ${movie.movie_year}</p>
          <p><strong>Director:</strong> ${movie.director}</p>
        </div>
        <div class="movie-rating">
          <p><strong>Rating:</strong></p>
          <div class="stars-display">
            ${displayRatingStars(movieRating)}
          </div>
        </div>
        <button class="read-more-btn" data-movie-id="${
          movie.id
        }">Read More</button>
      </div>
    `;

    moviesContainer.appendChild(movieCard);
  });

  // Set up event listeners for Read More buttons
  setupReadMoreListeners();
}

function setupReadMoreListeners() {
  const modal = document.querySelector(".modal");
  const modalContent = modal.querySelector(".modal-body");
  const closeBtn = modal.querySelector(".close-modal");

  // Remove any existing event listeners
  const readMoreButtons = document.querySelectorAll(".read-more-btn");
  readMoreButtons.forEach((button) => {
    button.replaceWith(button.cloneNode(true));
  });

  // Add new event listeners
  document.querySelectorAll(".read-more-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const movieId = parseInt(button.dataset.movieId);
      const movie = movies.find((m) => m.id === movieId);
      //Refer to Notice 1
      if (movie) {
        modalContent.innerHTML = `
          <h2>${movie.title}</h2>
          <p>${movie.description}</p>
          <div class="movie-details">
            <p><strong>Year:</strong> ${movie.movie_year}</p>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Price:</strong> $${movie.price}</p>
          </div>
          <div class="actors">
            <h3>Main Actors:</h3>
            <ul>${movie.actors
              .map((actor) => `<li>${actor}</li>`)
              .join("")}</ul>
          </div>
          
          <div class="rating-section">
            <h3>Rate this movie:</h3>
            <div class="stars">
              <i class="fas fa-star" data-rating="1"></i>
              <i class="fas fa-star" data-rating="2"></i>
              <i class="fas fa-star" data-rating="3"></i>
              <i class="fas fa-star" data-rating="4"></i>
              <i class="fas fa-star" data-rating="5"></i>
            </div>
            <p class="rating-display"></p>
          </div>

          <div class="comments-section">
            <h3>Comments:</h3>
            <div class="comment-form">
              <textarea class="comment-input" placeholder="Write your comment here..."></textarea>
              <button class="submit-comment">Submit Comment</button>
            </div>
            <div class="comments-list"></div>
          </div>
        `;

        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open (I found in internet )
        setupModalEventListeners(modalContent, movie.id);
      }
    });
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    closeModal(modal);
  });
  // e is a short form of event, which represents the event
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal(modal);
    }
  });
}

//close modal
function closeModal(modal) {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

function setupModalEventListeners(modalContent, movieId) {
  const stars = modalContent.querySelectorAll(".stars i");
  const ratingDisplay = modalContent.querySelector(".rating-display");
  const submitComment = modalContent.querySelector(".submit-comment");
  const commentInput = modalContent.querySelector(".comment-input");
  const commentsList = modalContent.querySelector(".comments-list");

  // Load existing ratings and comments for this movie
  const savedRating = localStorage.getItem(`movie-${movieId}-rating`);
  const savedComments =
    JSON.parse(localStorage.getItem(`movie-${movieId}-comments`)) || [];

  // Set up rating system
  if (savedRating) {
    highlightStars(stars, parseInt(savedRating));
    ratingDisplay.textContent = `Your rating: ${savedRating}/5`;
  }

  stars.forEach((star) => {
    star.addEventListener("mouseover", () => {
      highlightStars(stars, parseInt(star.dataset.rating));
    });

    star.addEventListener("mouseout", () => {
      if (savedRating) {
        highlightStars(stars, parseInt(savedRating));
      } else {
        clearStars(stars);
      }
    });

    star.addEventListener("click", () => {
      const rating = parseInt(star.dataset.rating);
      localStorage.setItem(`movie-${movieId}-rating`, rating);
      highlightStars(stars, rating);
      ratingDisplay.textContent = `Your rating: ${rating}/5`;
    });
  });

  // Load existing comments
  savedComments.forEach((comment) => {
    const commentElement = document.createElement("div");
    commentElement.className = "comment";
    commentElement.textContent = comment;
    commentsList.appendChild(commentElement);
  });

  // Set up comment submission
  submitComment.addEventListener("click", () => {
    const commentText = commentInput.value.trim();
    if (commentText) {
      const commentElement = document.createElement("div");
      commentElement.className = "comment";
      commentElement.textContent = commentText;
      commentsList.insertBefore(commentElement, commentsList.firstChild);

      // Save comment
      saveComment(movieId, commentText);

      commentInput.value = "";
    }
  });
}

function highlightStars(stars, rating) {
  stars.forEach((star) => {
    const starRating = parseInt(star.dataset.rating);
    if (starRating <= rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

function clearStars(stars) {
  stars.forEach((star) => star.classList.remove("active"));
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeMovies);

// Function to save comments to localStorage
function saveComment(movieId, comment) {
  let comments =
    JSON.parse(localStorage.getItem(`movie-${movieId}-comments`)) || [];
  comments.unshift(comment);
  localStorage.setItem(`movie-${movieId}-comments`, JSON.stringify(comments));
}

// Function to sort movies
function sortMovies(criteria) {
  const container = document.querySelector(".container");
  const movieCards = Array.from(container.children);

  movieCards.sort((a, b) => {
    switch (criteria) {
      case "name":
        const titleA = a.querySelector("h2").textContent.toLowerCase();
        const titleB = b.querySelector("h2").textContent.toLowerCase();
        return titleA.localeCompare(titleB);

      case "name-desc":
        const titleDescA = a.querySelector("h2").textContent.toLowerCase();
        const titleDescB = b.querySelector("h2").textContent.toLowerCase();
        return titleDescB.localeCompare(titleDescA);

      // I learn about  regular Expression
      // find https://regex-generator.olafneumann.org for this style
      case "year":
        const yearA = parseInt(
          a
            .querySelector(".movie-brief p:first-child")
            .textContent.match(/\d{4}/)
        );
        const yearB = parseInt(
          b
            .querySelector(".movie-brief p:first-child")
            .textContent.match(/\d{4}/)
        );
        return yearA - yearB;

      case "year-desc":
        const yearDescA = parseInt(
          a
            .querySelector(".movie-brief p:first-child")
            .textContent.match(/\d{4}/)
        );
        const yearDescB = parseInt(
          b
            .querySelector(".movie-brief p:first-child")
            .textContent.match(/\d{4}/)
        );
        return yearDescB - yearDescA;

      case "director":
        const directorA = a
          .querySelector(".movie-brief p:nth-child(2)")
          .textContent.toLowerCase();
        const directorB = b
          .querySelector(".movie-brief p:nth-child(2)")
          .textContent.toLowerCase();
        return directorA.localeCompare(directorB);

      default:
        return 0;
    }
  });

  // Remove all current cards
  movieCards.forEach((card) => container.removeChild(card));

  // Add sorted cards with animation
  movieCards.forEach((card, index) => {
    card.style.animation = "fadeIn 0.5s ease forwards";
    card.style.animationDelay = `${index * 0.1}s`;
    container.appendChild(card);
  });
}

// Add event listener for sort dropdown
document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.querySelector(".sort-select");

  if (sortSelect) {
    // Automatic sorting when dropdown value changes
    sortSelect.addEventListener("change", () => {
      const selectedValue = sortSelect.value;
      sortMovies(selectedValue);
    });
  }
});

// Add animation to CSS (this part copy from Code pen)
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize the page
initializeMovies();
