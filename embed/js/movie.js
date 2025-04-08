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
    updateIframe(ID);

  } catch (error) {
    console.error("Error fetching movie data:", error);
    document.getElementById("titletext").innerText = "Error loading movie.";
  }
}

function updateIframe(ID) {
  const source = document.getElementById("sourceSelector").value;
  const iframe = document.getElementById("iframe");

  if (source === "1") {
    iframe.src = `https://vidfast.pro/movie/${ID}?autoPlay=true`;
  } else if (source === "2") {
    iframe.src = `https://vidsrc.cc/v2/embed/movie/${ID}?autoPlay=true`;
  }
}

// Event listener for the source dropdown to update iframe when the source changes
document.getElementById("sourceSelector").addEventListener("change", function() {
  const ID = new URLSearchParams(window.location.search).get("id");
  updateIframe(ID);
});

document.addEventListener("DOMContentLoaded", getMovie);

