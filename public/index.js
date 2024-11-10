const result = document.querySelector(".result");
const baseUrl = `${window.location.origin}/api`;
const fetchAlbumData = async () => {
  try {
    const response = await fetch(`${baseUrl}/albums`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const albums = data.map((album) => {
      return `<div class="container-col"> 
              <h2>${album.title} (${album.year})</h2>
              <h3>${album.artist}</h3>
              <span>Genre: ${album.genre}</span>
              <span>Tracks: ${album.tracks}</span>
          </div>`;
    });
    result.innerHTML = albums.join("");
    console.log(data);
  } catch (error) {
    console.log(error);
    result.innerHTML = `<div class="alert alert-danger">Could not fetch data</div>`;
  }
};

const getCurrentUserData = async () => {
  try {
    const response = await fetch(`${baseUrl}/userdata`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    document.getElementById("username").innerHTML = `Signed in as ${data.name}`;
  } catch (error) {
    console.log(error);
  }
};

fetchAlbumData();
getCurrentUserData();
