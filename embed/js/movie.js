async function getMovie() {
  const ID = new URLSearchParams(window.location.search).get("id");

  if (!ID) {
    window.location.href = "/";
    return;
  }

  const url = `https://api.themoviedb.org/3/movie/${ID}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const movie = await response.json();
    document.getElementById("titletext").innerText = movie.title;
    document.getElementById("iframe").src = `https://vidfast.pro/movie/${ID}?autoPlay=true`;
  } catch (error) {
    console.error("Error fetching movie data:", error);
    document.getElementById("titletext").innerText = "Error loading movie.";
  }
}

document.addEventListener("DOMContentLoaded", getMovie);

