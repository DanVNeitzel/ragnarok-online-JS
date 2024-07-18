const currentMap = document.querySelector('.currentMap');
const containerLogin = document.querySelector('.containerLogin');
const containerMap = document.querySelector('.containerMap');
const soundGame = document.getElementById('musicGame');

var onMap = false;
var currentplayerMap;

// generateMapAndNpcs('Tutorial_0_4');

function generateMapAndNpcs(mapName) {
  if (mapName) {
    containerLogin.classList.add('hide');
    containerMap.classList.remove('hide');
    switch (mapName) {
      case 'Tutorial_0_1':
        currentplayerMap = 'Tutorial_0_1';
        onMap = true;
        if (verifySoundMap(soundGame.src) !== 'audio/training_camp.mp3') {
          soundGame.volume = 0.1;
          soundGame.src = 'audio/training_camp.mp3';
          soundGame.play();
        }
      currentMap.style.backgroundImage = "url('./graphics/maps/tutorial_0_1_bg.png')";
      currentMap.innerHTML = `
      <div class="loadingMap to_hide"></div>
      <img class="npcConfig sprakki" src="graphics/npcs/tutorial_guide_2.png" alt="" onclick="speak('Sprakki')">
        <span class="sprakki"></span>
      </img>
      <img class="npcConfig tele01" src="graphics/npcs/teleport.png" alt="" onclick="generateMapAndNpcs('Tutorial_0_2')">
        <span class="tele01"></span>
      </img>
      `;
        break;

      case 'Tutorial_0_2':
        currentplayerMap = 'Tutorial_0_2';
        onMap = true;
        if (verifySoundMap(soundGame.src) !== 'audio/training_camp.mp3') {
          soundGame.volume = 0.1;
          soundGame.src = 'audio/training_camp.mp3';
          soundGame.play();
        }
        currentMap.style.backgroundImage = "url('./graphics/maps/tutorial_0_2_bg.png')";
        currentMap.innerHTML = `
        <div class="loadingMap to_hide"></div>
        <img class="npcConfig guard_0_2" src="graphics/npcs/tutorial_guard.png" alt="" onclick="speak('Guard_0_2')">
          <span class="guard_0_2"></span>
        </img>
        <img class="npcConfig guard_0_2_alt" src="graphics/npcs/tutorial_guard.png" alt="" onclick="speak('Guard_0_2')">
          <span class="guard_0_2_alt"></span>
        </img>
        <img class="npcConfig tele02" src="graphics/npcs/teleport.png" alt="" onclick="generateMapAndNpcs('Tutorial_0_3')">
          <span class="tele02"></span>
        </img>
        `;
        break;

      case 'Tutorial_0_3':
        currentplayerMap = 'Tutorial_0_3';
        onMap = true;
        if (verifySoundMap(soundGame.src) !== 'audio/training_camp.mp3') {
          soundGame.volume = 0.1;
          soundGame.src = 'audio/training_camp.mp3';
          soundGame.play();
        }
        currentMap.style.backgroundImage = "url('./graphics/maps/tutorial_1_1_bg.png')";
        currentMap.innerHTML = `
        <div class="loadingMap to_hide"></div>
        <img class="npcConfig instructor_0_3" src="graphics/npcs/tutorial_event_corp.png" alt="" onclick="speak('instructor_0_3')">
          <span class="instructor_0_3"></span>
        </img>
        `;
        break;

      case 'Tutorial_0_4':
        currentplayerMap = 'Tutorial_0_4';
        onMap = true;
        if (verifySoundMap(soundGame.src) !== 'audio/training_camp.mp3') {
          soundGame.volume = 0.1;
          soundGame.src = 'audio/training_camp.mp3';
          soundGame.play();
        }
        currentMap.style.backgroundImage = "url('./graphics/maps/tutorial_1_2_bg.png')";
        currentMap.innerHTML = `
        <div class="loadingMap to_hide"></div>
        <img class="npcConfig instructor_0_4" src="graphics/npcs/tutorial_guide_5.png" alt="" onclick="speak('instructor_0_4')">
          <span class="instructor_0_4"></span>
        </img>
        `;
        break;

      default:
        break;
    }
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