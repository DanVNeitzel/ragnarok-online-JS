const currentUsername = document.getElementById('currentUsername');
const CurrentClass = document.getElementById('CurrentClass');
const currentHP = document.getElementById('currentHP');
const currentPorcentHP = document.getElementById('currentPorcentHP');
const currentSP = document.getElementById('currentSP');
const currentPorcentSP = document.getElementById('currentPorcentSP');
const currentBaseLevel = document.getElementById('currentBaseLevel');
const currentBaseExp = document.getElementById('currentBaseExp');
const currentClassLevel = document.getElementById('currentClassLevel');
const currentClassExp = document.getElementById('currentClassExp');
const currentWeight = document.getElementById('currentWeight');
const currentZeny = document.getElementById('currentZeny');



function loadPlayerInfo() {
  console.log(currentUserSelected);
  if (currentUserSelected) {
    const tempHP = currentUserSelected.hp;
    const tempSP = currentUserSelected.sp;
    const tempWeight = currentUserSelected.weight;

    currentUsername.innerHTML = currentUserSelected.name;
    CurrentClass.innerHTML = currentUserSelected.class;
    currentHP.innerHTML = tempHP + ' / ' + currentUserSelected.hp;
    currentPorcentHP.innerHTML = (tempHP / currentUserSelected.hp) * 100 + '%';
    currentSP.innerHTML = tempSP + ' / ' + currentUserSelected.sp;
    currentPorcentSP.innerHTML = (tempSP / currentUserSelected.sp) * 100 + '%';
    currentBaseLevel.innerHTML = currentUserSelected.level;
    currentBaseExp.style.width = currentUserSelected.experience + '%';
    currentClassLevel.innerHTML = currentUserSelected.level;
    currentClassExp.style.width = currentUserSelected.experience + '%';
    currentWeight.innerHTML = 'Peso: ' + currentUserSelected.weight + ' / ' + calcWeight(tempWeight);
    currentZeny.innerHTML = 'Zeny: ' + currentUserSelected.zeny;
  }
}

function calcWeight(weight) {
  var MAX_WGT =+ weight + 2000;
  MAX_WGT += 30 * currentUserSelected.for;
  MAX_WGT += currentUserSelected.level;
  return MAX_WGT;
}

function updatePlayerInfo() {
  console.log(currentUserSelected);
}