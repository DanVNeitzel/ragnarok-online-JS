const currentMap = document.querySelector('.currentMap');
const containerLogin = document.querySelector('.containerLogin');
const containerMap = document.querySelector('.containerMap');
const soundGame = document.getElementById('musicGame');

var onMap = false;
var currentplayerMap;
var mapsConfig;

loadMapsConfig();

// generateMapAndNpcs('Tutorial_0_4');

function loadMapsConfig() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      mapsConfig = JSON.parse(xhr.responseText);
    }
  }
  xhr.open("GET", "./config/maps.json", true);
  xhr.send();
}

function generateMapAndNpcs(mapName) {
  if (mapName && mapsConfig && mapsConfig[mapName]) {
    const mapData = mapsConfig[mapName];
    containerLogin.classList.add('hide');
    containerMap.classList.remove('hide');
    currentplayerMap = mapName;
    onMap = true;
    if (verifySoundMap(soundGame.src) !== mapData.music) {
      soundGame.volume = 0.1;
      soundGame.src = mapData.music;
      soundGame.play();
    }
    currentMap.style.backgroundImage = "url('" + mapData.background + "')";
    let html = '<div class="loadingMap to_hide"></div>';
    mapData.npcs.forEach(npc => {
      html += `<img class="${npc.class}" src="${npc.src}" alt="" onclick="${npc.onclick}"><span class="${npc.spanClass}"></span></img>`;
    });
    currentMap.innerHTML = html;
  }
}

function verifySoundMap(soundPath) {

  var soundMatch = soundPath.match(/audio\/.*/);

  if (soundMatch) {
    var resultado = soundMatch[0];
    // console.log(resultado);
    return resultado;

  } else {
    console.error("Erro ao validar o audio.");
  }
}