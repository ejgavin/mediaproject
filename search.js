import words from "profane-words";

function containsProfanity(text) {
  return words.includes(text.toLowerCase());
}

async function searchMedia(searchQuery) {
  if (containsProfanity(searchQuery)) {
    alert("Inappropriate search terms are not allowed.");
    return;
  }

  try {
    const encodedSearch = encodeURIComponent(searchQuery);
    const url = `https://api.themoviedb.org/3/search/multi?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US&query=${encodedSearch}&page=1&include_adult=false`;

    const response = await fetch(url);
    const data = await response.json();

    const bigDiv = document.getElementById("bigDiv");
    bigDiv.innerHTML = ``;

    const resultsContainer = document.createElement("div");
    resultsContainer.id = "search-results";
    resultsContainer.className = "search-results-container";
    bigDiv.appendChild(resultsContainer);

    data.results.forEach((movie) =>
      createAndDisplayCard(movie, resultsContainer)
    );

    if (resultsContainer.innerHTML.trim() === "") {
      resultsContainer.innerHTML = '<p class="no-results">No results found</p>';
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
    document.getElementById("bigDiv").innerHTML =
      '<p class="error">Error fetching search results. Please try again.</p>';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let cooldown = false;
  const searchbar = document.getElementById("searchbar");
  const cooldownNotice = document.getElementById("cooldownNotice");

  searchbar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      if (cooldown) {
        cooldownNotice.style.display = "block";
        return;
      }

      const searchQuery = searchbar.value.trim();
      if (searchQuery) {
        searchMedia(searchQuery);
        cooldownNotice.style.display = "none";
        cooldown = true;
        setTimeout(() => {
          cooldown = false;
          cooldownNotice.style.display = "none";
        }, 2000);
      }
    }
  });
});

