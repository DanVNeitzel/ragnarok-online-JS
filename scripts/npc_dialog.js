const npc_name = document.getElementById('npc_name');
const npc_text = document.getElementById('npc_text');
const win_dialog_opt_npc = document.getElementById('win_dialog_opt_npc');
const win_options_npc = document.querySelector('.win_options_npc');
const win_dialog_npc = document.querySelector('.win_dialog_npc');

const jsonUrl = "config/npc_dialogs.json";

var resp;
var selectedNPCInfo;

fetchJSON('');

async function fetchJSON(npcSelected) {

  try {
    // Fetch do JSON
    const response = await fetch(jsonUrl);

    // Verifica se a resposta foi bem-sucedida (status 200 OK)
    if (!response.ok) {
      throw new Error(`Erro ao obter o JSON. Status: ${response.status}`);
    }

    // Converte a resposta para JSON
    const NPC_Info = await response.json();
    // console.log(NPC_Info);

    // Verifica se a propriedade npcSelected existe no objeto NPC_Info
    if (NPC_Info.hasOwnProperty(npcSelected)) {
      selectedNPCInfo = NPC_Info[npcSelected];
      // console.log(selectedNPCInfo);
    } else {
      console.warn('O NPC não foi encontrado na base. Carregado base padrão.');
    }

  } catch (error) {
    console.error("Erro ao processar o JSON:", error);
  }
}

function speak(npc) {
  if (!resp) {
    fetchJSON(npc);
    setTimeout(() => {
      WinNpcOpen = win_dialog_opt_npc.classList.contains("hide");
      if (WinNpcOpen) {
        win_dialog_opt_npc.classList.remove('hide');
        npc_name.innerHTML = selectedNPCInfo.name;
        npc_text.innerHTML = selectedNPCInfo.dialog1;
        selectedNPCInfo.options.forEach((option, index) => {
          lbls_opt_npc.innerHTML += `
      <label class='selectAlt'>${option.value}
        <input type='radio' id='NPC_dialog' name='NPC_dialog' value='${option.value}'>
        <span class='checkmark'>
          <span></span>${option.value}
        </span>
      </label>`
          if (index === 0) {
            const first = document.getElementById("NPC_dialog");
            first.setAttribute("checked", "checked");
          }
        });
      }
    }, 500);
  } else {
    lbls_opt_npc.innerHTML = '';
    switch (resp) {
      case 'Sim, me conte mais sobre o server.':
        npc_text.innerHTML = selectedNPCInfo.dialog2;
        selectedNPCInfo.options2.forEach((option, index) => {
          lbls_opt_npc.innerHTML += `
          <label class='selectAlt'>${option.value}
            <input type='radio' id='NPC_dialog' name='NPC_dialog' value='${option.value}'>
            <span class='checkmark'>
              <span></span>${option.value}
            </span>
          </label>`
          if (index === 0) {
            const first = document.getElementById("NPC_dialog");
            first.setAttribute("checked", "checked");
          }
        });
        break;

      case 'Uau, gostei muito.':
        closeDialogOpt();
        break;

      case 'Ir para cidade de Prontera.':
        // generateMapAndNpcs('cid_prontera_centro');
        closeDialogOpt();
        break;

      case 'Quero passar pelo tutorial.':
        generateMapAndNpcs('Tutorial_0_4');
        closeDialogOpt();
        break;

      default:
        closeDialogOpt();
        break;
    }
  }
}

function closeDialogOpt() {
  win_dialog_opt_npc.classList.add('hide');
  cleanDialogNPC();
}

function cleanDialogNPC() {
  resp = null;
  npc_name.innerHTML = '';
  npc_text.innerHTML = '';
  lbls_opt_npc.innerHTML = '';
  win_dialog_npc.style.top = 'calc(50% + 25px)';
  win_dialog_npc.style.left = 'calc(50% + 130px)';
  win_dialog_opt_npc.style.top = 'calc(50% + 55px)';
  win_dialog_opt_npc.style.left = 'calc(50% - 190px)';
}

function optDialogNPC() {
  const items = document.getElementsByName('NPC_dialog');
  for (var i = 0; i < items.length; i++) {
    if (items[i].checked) {
      resp = items[i].value;
      speak();
    }
  }

  // console.log(resp);
}