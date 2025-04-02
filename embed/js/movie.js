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

    loadMovie(ID);
  } catch (error) {
    console.error("Error fetching movie data:", error);
    document.getElementById("titletext").innerText = "Error loading movie.";
  }
}

function loadMovie(ID) {
  const source = document.getElementById("sourceSelector").value;
  let iframeSrc;

  if (source === "1") {
    iframeSrc = `https://vidfast.pro/movie/${ID}?autoPlay=true`;
  } else {
    iframeSrc = `https://sudo-proxy-sable-three.vercel.app/?destination=https://vidsrc.to/embed/movie/${ID}`;
  }

  document.getElementById("iframe").src = iframeSrc;
}

document.getElementById("sourceSelector").addEventListener("change", () => {
  const ID = new URLSearchParams(window.location.search).get("id");
  if (ID) {
    loadMovie(ID);
  }
});

document.addEventListener("DOMContentLoaded", getMovie);

