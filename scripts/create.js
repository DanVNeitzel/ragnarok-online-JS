var newStyleChar = document.getElementById('newStyleChar');

var NewNameChar = document.getElementById('newUserName');

var newUserFor = document.getElementById('newUserFor');
var newUserAgi = document.getElementById('newUserAgi');
var newUserVit = document.getElementById('newUserVit');
var newUserInt = document.getElementById('newUserInt');
var newUserDes = document.getElementById('newUserDes');
var newUserSor = document.getElementById('newUserSor');

var btnAddFor = document.querySelector('.btn-add-for');
var btnAddAgi = document.querySelector('.btn-add-agi');
var btnAddVit = document.querySelector('.btn-add-vit');
var btnAddInt = document.querySelector('.btn-add-int');
var btnAddDes = document.querySelector('.btn-add-des');
var btnAddSor = document.querySelector('.btn-add-sor');

var styleNumDefault = 1;

NewNameChar.value = "";

let default_stats = {
  for: 5,
  agi: 5,
  vit: 5,
  int: 5,
  des: 5,
  sor: 5,
};

updatePoints();

function updatePoints() {
  newUserFor.innerHTML = default_stats.for;
  newUserAgi.innerHTML = default_stats.agi;
  newUserVit.innerHTML = default_stats.vit;
  newUserInt.innerHTML = default_stats.int;
  newUserDes.innerHTML = default_stats.des;
  newUserSor.innerHTML = default_stats.sor;

  btnAddFor.innerHTML = default_stats.for;
  btnAddAgi.innerHTML = default_stats.agi;
  btnAddVit.innerHTML = default_stats.vit;
  btnAddInt.innerHTML = default_stats.int;
  btnAddDes.innerHTML = default_stats.des;
  btnAddSor.innerHTML = default_stats.sor;
}

function changeStyle(opt) {
  if (opt === 'next') {
    if (styleNumDefault < 4) {
      styleNumDefault = styleNumDefault + 1;
    } else {
      styleNumDefault = 1;
    }
  }
  if (opt === 'prev') {
    if (styleNumDefault >= 2) {
      styleNumDefault = styleNumDefault - 1;
    } else {
      styleNumDefault = 4;
    }
  }
  console.log(styleNumDefault);
  newStyleChar.src = './graphics/chars/aprendiz_' + styleNumDefault + '.png';
}

function addNewPoint(stats) {
  switch (stats) {
    case 'for':
      if (default_stats.for < 9) {
        default_stats.for = default_stats.for + 1;
        default_stats.int = default_stats.int - 1;
      }
      break;

    case 'agi':
      if (default_stats.agi < 9) {
        default_stats.agi = default_stats.agi + 1;
        default_stats.des = default_stats.des - 1;
      }
      break;

    case 'vit':
      if (default_stats.vit < 9) {
        default_stats.vit = default_stats.vit + 1;
        default_stats.sor = default_stats.sor - 1;
      }
      break;

    case 'int':
      if (default_stats.int < 9) {
        default_stats.int = default_stats.int + 1;
        default_stats.for = default_stats.for - 1;
      }
      break;

    case 'des':
      if (default_stats.des < 9) {
        default_stats.des = default_stats.des + 1;
        default_stats.agi = default_stats.agi - 1;
      }
      break;

    case 'sor':
      if (default_stats.sor < 9) {
        default_stats.sor = default_stats.sor + 1;
        default_stats.vit = default_stats.vit - 1;
      }
      break;

    default:
      break;
  }
  updatePoints();
}

function resetStatus() {
  if (NewNameChar.value === "") {
    NewNameChar.style.border = '1px solid red';
  } else {
    NewNameChar.style.border = '1px solid #000';
  }
}

function createNewPlayer() {
  var status = validatePlayer();
  if (status) {
    const newUser = {
      "name": NewNameChar.value,
      "hair": "aprendiz_" + styleNumDefault,
      "for": default_stats.for,
      "agi": default_stats.agi,
      "vit": default_stats.vit,
      "int": default_stats.int,
      "des": default_stats.des,
      "sor": default_stats.sor
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiLink + "create_character.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            userData = response.data;
            loadCharSlots();
            cmd('fecharcriarPlayer');
          } else {
            showErrorMessage('Erro ao criar personagem: ' + response.error);
          }
        } else {
          showErrorMessage('Erro de conexão');
        }
      }
    };
    xhr.send(JSON.stringify({ username: username, character: newUser }));
  }
}

function validatePlayer() {
  if (NewNameChar.value !== '' || NewNameChar.value !== null || NewNameChar.value !== undefined) {
    if (NewNameChar.value.length >= 6 && NewNameChar.value.length <= 13) {
      return true;
    } else {
      showErrorMessage('numberCharName');
      return false;
    }
  } else {
    showErrorMessage('validCharName');
    return false;
  }
}


function verifyEmptySlot() {
  const empty = {
    "stats": "empty"
  }
  switch (userData[0].slots.length) {
    case 1:
      for (let slot = 1; slot <= 2; slot++) {
        userData[0].slots.push(empty);
      }
      userData[0].slots.length
      break;
    case 2:
      for (let slot = 1; slot <= 1; slot++) {
        userData[0].slots.push(empty);
      }
      userData[0].slots.length
      break;

    default:
      break;
  }

}