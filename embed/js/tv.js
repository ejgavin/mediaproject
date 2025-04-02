async function getTVShowData() {
  const ID = new URLSearchParams(window.location.search).get("id");
  let season = new URLSearchParams(window.location.search).get("s") || 1;
  let episode = new URLSearchParams(window.location.search).get("e") || null;

  if (!ID) {
    window.location.href = "/";
    return;
  }

  const url = `https://api.themoviedb.org/3/tv/${ID}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;

  try {
    const response = await fetch(url);
    const show = await response.json();
    
    document.getElementById("title").innerText = `${show.name}`;
    populateDropdowns(show.seasons, season, episode, ID);
  } catch (error) {
    console.error("Error fetching TV show data:", error);
    document.getElementById("title").innerText = "Error loading show.";
  }
}

function populateDropdowns(seasons, currentSeason, currentEpisode, ID) {
  const seasonSelector = document.getElementById("seasonSelector");
  const episodeSelector = document.getElementById("episodeSelector");
  const sourceSelector = document.getElementById("sourceSelector");

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
  seasonSelector.addEventListener("change", () => {
    loadEpisodes(ID, seasonSelector.value);
  });

  sourceSelector.addEventListener("change", () => {
    if (episodeSelector.value !== "choose") {
      changeEpisode(ID, seasonSelector.value, episodeSelector.value);
    }
  });

  loadEpisodes(ID, currentSeason, currentEpisode);
}

async function loadEpisodes(ID, seasonNumber, currentEpisode = null) {
  const episodeSelector = document.getElementById("episodeSelector");
  episodeSelector.innerHTML = "";

  const chooseOption = document.createElement("option");
  chooseOption.value = "choose";
  chooseOption.textContent = "Choose Episode";
  episodeSelector.appendChild(chooseOption);

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

    episodeSelector.addEventListener("change", () => {
      if (episodeSelector.value !== "choose") {
        changeEpisode(ID, seasonNumber, episodeSelector.value);
      }
    });

  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}

function changeEpisode(ID, season, episode) {
  const source = document.getElementById("sourceSelector").value;
  let iframeSrc;

  if (source === "1") {
    iframeSrc = `https://vidfast.pro/tv/${ID}/${season}/${episode}?autoPlay=true`;
  } else {
    iframeSrc = `https://sudo-proxy-sable-three.vercel.app/?destination=https://vidsrc.to/embed/tv/${ID}/${season}/${episode}`;
  }

  document.getElementById("title").innerText = `S${season}E${episode}`;
  document.getElementById("iframe").src = iframeSrc;
}

document.addEventListener("DOMContentLoaded", getTVShowData);

