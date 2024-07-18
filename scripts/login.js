var SelectedUserName = document.getElementById("SelectedUserName");
var SelectedUserClass = document.getElementById("SelectedUserClass");
var SelectedUserNv = document.getElementById("SelectedUserNv");
var SelectedUserExp = document.getElementById("SelectedUserExp");
var SelectedUserHP = document.getElementById("SelectedUserHP");
var SelectedUserSP = document.getElementById("SelectedUserSP");

var SelectedUserFor = document.getElementById("SelectedUserFor");
var SelectedUserAgi = document.getElementById("SelectedUserAgi");
var SelectedUserVit = document.getElementById("SelectedUserVit");
var SelectedUserInt = document.getElementById("SelectedUserInt");
var SelectedUserDes = document.getElementById("SelectedUserDes");
var SelectedUserSor = document.getElementById("SelectedUserSor");

var imgChar_1 = document.getElementById("imgChar_1");
var imgChar_2 = document.getElementById("imgChar_2");
var imgChar_3 = document.getElementById("imgChar_3");

var btnNewPlayerChar = document.getElementById("btnNewPlayerChar");
var btnSelectedChar = document.getElementById("btnSelectedChar");

var xhr = new XMLHttpRequest();
var num_char = 0;
var slot_num = 0;
var data;
var userData;
var username;
var password;
var res;

var currentUserSelected;

userRequest();

function userRequest() {
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText);
    }
  }
  xhr.open("GET", "./users/users.json", true);
  xhr.send();
}

function findUserObject(obj, username) {
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      const userObject = obj[key].find(item => item.hasOwnProperty(username));
      if (userObject) {
        return userObject[username];
      } else {
        invalidLogin();
      }
    }
  }
  return null;
}

function verifyLogin() {
  username = document.getElementById("input_user_id").value;
  password = document.getElementById("input_user_pass").value;
  userData = findUserObject(data, username);
  if (userData) {
    if (userData[0].password === password && userData[0].password) {
      conSuccess();
    } else {
      invalidLogin();
    }
  }
}

function selectChar(selected) {
  for (let slot = 0; slot < char_slot.length; slot++) {
      char_slot[slot].classList.remove('active');
  }
  selected.classList.add('active');
  console.log(selected.id);
  loadCharSelected(selected.id);
}

function verifyWorld() {
  const items = document.getElementsByName('world');
  for (var i = 0; i < items.length; i++) {
    if (items[i].checked) {
      resp = items[i].value
      break;
    }
  }

  if (userData) {
    var validWorld = userData[0].auth_server === resp
    if (validWorld !== undefined) {
      return validWorld;
    } else {
      return "data error";
    }
  }
}

function loadCharSlots() {
  imgChar_1.src = '';
  imgChar_2.src = '';
  imgChar_3.src = '';
  for (let slot = 0; slot < userData[0].slots.length; slot++) {
    num_char = 0;
    updateStatsValue(userData[0].slots[0])
    if (userData[0].slots[slot].stats === 'active') {
      const skin = userData[0].slots[slot].hair;
      num_char++;
      block_charactor.innerHTML = num_char + ' / 3';
      switch (slot) {
        case 0:
          imgChar_1.src = './graphics/chars/' + skin + '.png'
          break;

        case 1:
          imgChar_2.src = './graphics/chars/' + skin + '.png'
          break;

        case 2:
          imgChar_3.src = './graphics/chars/' + skin + '.png'
          break;

        default:
          break;
      }
    }
  }
}

function loadCharSelected(id) {
  switch (id) {
    case 'slot_1':
      updateStatsValue(userData[0].slots[0]);
      temp_select_char = 1;
      break;

    case 'slot_2':
      updateStatsValue(userData[0].slots[1]);
      
      temp_select_char = 2;
      break;

    case 'slot_3':
      updateStatsValue(userData[0].slots[2]);
      temp_select_char = 3;
      break;

    default:
      break;
  }
}

function updateStatsValue(userDataSlot) {
  if (userDataSlot.stats !== 'empty') {
    SelectedUserName.innerHTML = userDataSlot.name;
    SelectedUserClass.innerHTML = userDataSlot.class;
    SelectedUserNv.innerHTML = userDataSlot.level;
    SelectedUserExp.innerHTML = userDataSlot.experience;
    SelectedUserHP.innerHTML = userDataSlot.hp;
    SelectedUserSP.innerHTML = userDataSlot.sp;
    SelectedUserMap.innerHTML = userDataSlot.map;

    SelectedUserFor.innerHTML = userDataSlot.for;
    SelectedUserAgi.innerHTML = userDataSlot.agi;
    SelectedUserVit.innerHTML = userDataSlot.vit;
    SelectedUserInt.innerHTML = userDataSlot.int;
    SelectedUserDes.innerHTML = userDataSlot.des;
    SelectedUserSor.innerHTML = userDataSlot.sor;
    btnNewPlayerChar.classList.add('hide');
    btnSelectedChar.classList.remove('hide');
    storageData(userDataSlot);
  } else {
    SelectedUserName.innerHTML = '';
    SelectedUserClass.innerHTML = '';
    SelectedUserNv.innerHTML = '';
    SelectedUserExp.innerHTML = '';
    SelectedUserHP.innerHTML = '';
    SelectedUserSP.innerHTML = '';
    SelectedUserMap.innerHTML = '';


    SelectedUserFor.innerHTML = '';
    SelectedUserAgi.innerHTML = '';
    SelectedUserVit.innerHTML = '';
    SelectedUserInt.innerHTML = '';
    SelectedUserDes.innerHTML = '';
    SelectedUserSor.innerHTML = '';
    btnNewPlayerChar.classList.remove('hide');
    btnSelectedChar.classList.add('hide');
  }
}

function storageData(data) {
  if(data){
    currentUserSelected = data;
  }else{
    currentUserSelected = null;
  }
}

function changeChar(opt) {
  if (opt === 'next') {
    switch (slot_num) {
      case 0:
        char_slot[0].classList.remove('active');
        char_slot[1].classList.add('active');
        slot_num = 1;
        updateStatsValue(userData[0].slots[1]);
        break;

      case 1:
        char_slot[1].classList.remove('active');
        char_slot[2].classList.add('active');
        slot_num = 2;
        updateStatsValue(userData[0].slots[2]);
        break;

      case 2:
        char_slot[2].classList.remove('active');
        char_slot[0].classList.add('active');
        slot_num = 0;
        updateStatsValue(userData[0].slots[0]);
        break;
    }
  }
  if (opt === 'prev') {
    switch (slot_num) {
      case 0:
        char_slot[0].classList.remove('active');
        char_slot[2].classList.add('active');
        slot_num = 2;
        updateStatsValue(userData[0].slots[2]);
        break;

      case 1:
        char_slot[1].classList.remove('active');
        char_slot[0].classList.add('active');
        slot_num = 0;
        updateStatsValue(userData[0].slots[0]);
        break;

      case 2:
        char_slot[2].classList.remove('active');
        char_slot[1].classList.add('active');
        slot_num = 1;
        updateStatsValue(userData[0].slots[1]);
        break;
    }
  }
}

