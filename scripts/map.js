/*
 * Arquivo de configuração e geração de mapas.
 * 
 * Para adicionar um novo mapa:
 * 1. Edite o arquivo config/maps.json.
 * 2. Adicione uma nova entrada com o nome do mapa como chave.
 * 3. Defina os campos:
 *    - background: caminho da imagem de fundo (ex: "./graphics/maps/nome_bg.png")
 *    - music: caminho do arquivo de música (ex: "audio/musica.mp3")
 *    - npcs: array de objetos NPC, cada um com:
 *        - class: classe CSS para o img
 *        - src: caminho da imagem do NPC
 *        - onclick: função JavaScript a executar no clique (ex: "speak('NomeNPC')")
 *        - spanClass: classe CSS para o span associado
 * 
 * Exemplo:
 * "NovoMapa": {
 *   "background": "./graphics/maps/novo_bg.png",
 *   "music": "audio/nova_musica.mp3",
 *   "npcs": [
 *     {
 *       "class": "npcConfig novoNpc",
 *       "src": "graphics/npcs/novo.png",
 *       "onclick": "speak('NovoNPC')",
 *       "spanClass": "novoNpc"
 *     }
 *   ]
 * }
 * 
 * Após editar o JSON, o mapa estará disponível para uso em generateMapAndNpcs('NovoMapa').
 */

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
    if (currentUserSelected) {
      currentUserSelected.map = mapName;
      saveCharacterData();
    }
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

function removeMapAndNpcs() {
  currentMap.style.backgroundImage = "none";
  currentMap.innerHTML = '';
  soundGame.volume = 0.1;
  soundGame.src = './audio/login_sound.mp3';
  soundGame.play();
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

function saveCharacterData() {
  if (currentUserSelected && username) {
    // Find the slot index
    let slotIndex = -1;
    for (let i = 0; i < userData[0].slots.length; i++) {
      if (userData[0].slots[i].name === currentUserSelected.name) {
        slotIndex = i;
        break;
      }
    }
    if (slotIndex !== -1) {
      userData[0].slots[slotIndex] = currentUserSelected;
      const xhr = new XMLHttpRequest();
      xhr.open("POST", apiLink + "save_character.php", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            localStorage.setItem(username, JSON.stringify(userData));
          } else {
            console.error("Erro ao salvar dados do personagem:", response.error);
          }
        }
      };
      xhr.send(JSON.stringify({ username: username, userData: userData }));
    }
  }
}