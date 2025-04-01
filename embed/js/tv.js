async function getTVShowData() {
  const ID = new URLSearchParams(window.location.search).get("id");
  let season = new URLSearchParams(window.location.search).get("s") || 1;
  let episode = new URLSearchParams(window.location.search).get("e") || 1;

  if (!ID) {
    window.location.href = "/";
    return;
  }

  const url = `https://api.themoviedb.org/3/tv/${ID}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;

  try {
    const response = await fetch(url);
    const show = await response.json();
    
    document.getElementById("title").innerText = `${show.name} - S${season}E${episode}`;

    const seasonSelector = document.getElementById("seasonSelector");
    const episodeSelector = document.getElementById("episodeSelector");
    const sourceSelector = document.getElementById("sourceSelector");

    populateDropdowns(show.seasons, season, episode, ID);

    function updateIframe() {
      const source = sourceSelector.value;
      const iframe = document.getElementById("iframe");
      if (source === "1") {
        iframe.src = `https://vidfast.pro/tv/${ID}/${season}/${episode}?autoPlay=true`;
      } else {
        iframe.src = `https://sudo-proxy-sable-three.vercel.app/?destination=https://vidsrc.rip/embed/tv/${ID}/${season}/${episode}?autoPlay=true`;
      }
    }

    sourceSelector.addEventListener("change", updateIframe);
    seasonSelector.addEventListener("change", () => loadEpisodes(ID, seasonSelector.value));
    episodeSelector.addEventListener("change", () => changeEpisode(ID, seasonSelector.value, episodeSelector.value));

    updateIframe();
  } catch (error) {
    console.error("Error fetching TV show data:", error);
    document.getElementById("title").innerText = "Error loading show.";
  }
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
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}

function changeEpisode(ID, season, episode) {
  document.getElementById("title").innerText = `S${season}E${episode}`;
  document.getElementById("iframe").src = `https://vidfast.pro/tv/${ID}/${season}/${episode}?autoPlay=true`;
}

document.addEventListener("DOMContentLoaded", getTVShowData);

