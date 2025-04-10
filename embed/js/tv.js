async function getTVShowData() {
  const params = new URLSearchParams(window.location.search);
  const ID = params.get("id");
  let season = params.get("s") || 1;
  let episode = params.get("e") || 1;

  if (!ID) {
    window.location.href = "/";
    return;
  }

  const url = `https://api.themoviedb.org/3/tv/${ID}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;

  try {
    const response = await fetch(url);
    const show = await response.json();

    document.getElementById("title").innerText = `${show.name} - S${season}E${episode}`;
    updateIframe(ID, season, episode);

    populateDropdowns(show.seasons, season, episode, ID);
  } catch (error) {
    console.error("Error fetching TV show data:", error);
    document.getElementById("title").innerText = "Error loading show.";
  }
}

function populateDropdowns(seasons, currentSeason, currentEpisode, ID) {
  const seasonSelector = document.getElementById("seasonSelector");
  const episodeSelector = document.getElementById("episodeSelector");

  seasonSelector.innerHTML = "";
  seasons.forEach(season => {
    if (season.name !== "Specials") {
      const option = document.createElement("option");
      option.value = season.season_number;
      option.textContent = season.name;
      seasonSelector.appendChild(option);
    }
  });

  seasonSelector.value = currentSeason;
  seasonSelector.addEventListener("change", () => loadEpisodes(ID, seasonSelector.value));

  loadEpisodes(ID, currentSeason, currentEpisode);
}

async function loadEpisodes(ID, seasonNumber, currentEpisode = 1) {
  const episodeSelector = document.getElementById("episodeSelector");
  episodeSelector.innerHTML = "";

  const url = `https://api.themoviedb.org/3/tv/${ID}/season/${seasonNumber}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;

  try {
    const response = await fetch(url);
    const season = await response.json();

    season.episodes.forEach(episode => {
      const option = document.createElement("option");
      option.value = episode.episode_number;
      option.textContent = `Episode ${episode.episode_number}: ${episode.name}`;
      episodeSelector.appendChild(option);
    });

    episodeSelector.value = currentEpisode;
    episodeSelector.addEventListener("change", () => changeEpisode(ID, seasonNumber, episodeSelector.value));
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}

function changeEpisode(ID, season, episode) {
  document.getElementById("title").innerText = `S${season}E${episode}`;
  updateIframe(ID, season, episode);
}

function updateIframe(ID, season, episode) {
  const source = document.getElementById("sourceSelector").value;
  const iframe = document.getElementById("iframe");

  if (source === "1") {
    iframe.src = `https://vidfast.pro/tv/${ID}/${season}/${episode}?autoPlay=true`;
  } else if (source === "2") {
    iframe.src = `https://vidsrc.cc/v2/embed/tv/${ID}/${season}/${episode}?autoPlay=true`;
  } else if (source === "3") {
      iframe.src = `https://vidlink.pro/tv/${ID}/${season}/${episode}?autoPlay=true`;
  } else if (source === "4") {
       iframe.src = `https://player.videasy.net/tv/${ID}/${season}/${episode}?autoPlay=true&redirectstop=true`;
  }
}

// Event listener for the source dropdown to update iframe when the source changes
document.getElementById("sourceSelector").addEventListener("change", function() {
  const params = new URLSearchParams(window.location.search);
  const ID = params.get("id");
  const season = params.get("s") || 1;
  const episode = params.get("e") || 1;
  updateIframe(ID, season, episode);
});

document.addEventListener("DOMContentLoaded", getTVShowData);

