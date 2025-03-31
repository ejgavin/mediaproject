async function getTVShowData() {
  const ID = new URLSearchParams(window.location.search).get("id");
  const season = new URLSearchParams(window.location.search).get("s") || 1;
  const episode = new URLSearchParams(window.location.search).get("e") || 1;

  if (!ID) {
    window.location.href = "/";
    return;
  }

  // Fetch TV show data using TMDb API
  const url = `https://api.themoviedb.org/3/tv/${ID}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const show = await response.json();
    document.getElementById("title").innerText = `${show.name} - Season ${season}, Episode ${episode}`;

    // Embed the TV show using VidFast
    const iframe = document.getElementById("iframe");
    iframe.src = `https://vidfast.pro/tv/${ID}/${season}/${episode}?autoPlay=true`;
  } catch (error) {
    console.error("Error fetching TV show data:", error);
    document.getElementById("title").innerText = "Error loading show.";
  }
}

document.addEventListener("DOMContentLoaded", getTVShowData);

