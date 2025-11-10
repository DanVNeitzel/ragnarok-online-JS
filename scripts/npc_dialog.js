/*
 * Arquivo de configuração e gerenciamento de diálogos de NPCs.
 * 
 * Para adicionar um novo diálogo de NPC:
 * 1. Edite o arquivo config/npc_dialogs.json.
 * 2. Adicione uma nova entrada com o nome do NPC como chave (deve corresponder ao usado em speak('NomeNPC')).
 * 3. Defina os campos:
 *    - name: nome do NPC exibido (ex: "[NomeNPC]")
 *    - dialog1: texto do primeiro diálogo (pode usar <br> para quebras de linha)
 *    - options: array de objetos com "value" (texto da opção) e "next" (ação: "close", "dialog2", "map:NomeMapa")
 *    - dialog2 (opcional): texto do segundo diálogo
 *    - options2 (opcional): array similar para o segundo diálogo
 *    - Pode adicionar dialog3, options3, etc., quantos níveis quiser
 * 
 * Exemplo:
 * "NovoNPC": {
 *   "name": "[Novo NPC]",
 *   "dialog1": "Olá, aventureiro! Como posso ajudar?",
 *   "options": [
 *     {"value": "Conte-me sobre o jogo.", "next": "dialog2"},
 *     {"value": "Obrigado, até mais.", "next": "close"}
 *   ],
 *   "dialog2": "Este é um jogo incrível desenvolvido em JavaScript.",
 *   "options2": [
 *     {"value": "Entendi, obrigado.", "next": "close"}
 *   ]
 * }
 * 
 * Após editar o JSON, o NPC poderá ser chamado com speak('NovoNPC').
 */

const npc_name = document.getElementById('npc_name');
const npc_text = document.getElementById('npc_text');
const win_dialog_opt_npc = document.getElementById('win_dialog_opt_npc');
const win_options_npc = document.querySelector('.win_options_npc');
const win_dialog_npc = document.querySelector('.win_dialog_npc');

const jsonUrl = "config/npc_dialogs.json";

var resp;
var selectedNPCInfo;
var currentDialogNum = 1;

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
        currentDialogNum = 1;
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
    const currentOptions = selectedNPCInfo['options' + currentDialogNum];
    const selectedOption = currentOptions.find(opt => opt.value === resp);
    if (selectedOption) {
      const next = selectedOption.next;
      if (next === 'close') {
        closeDialogOpt();
      } else if (next.startsWith('dialog')) {
        const num = parseInt(next.replace('dialog', ''));
        currentDialogNum = num;
        npc_text.innerHTML = selectedNPCInfo[next];
        const nextOptions = selectedNPCInfo['options' + num];
        lbls_opt_npc.innerHTML = '';
        nextOptions.forEach((option, index) => {
          lbls_opt_npc.innerHTML += `
          <label class='selectAlt'>${option.value}
            <input type='radio' id='NPC_dialog' name='NPC_dialog' value='${option.value}'>
            <span class='checkmark'>
              <span></span>${option.value}
            </span>
          </label>`
          if (index === 0) {
            const first = document.getElementById("NPC_dialog");
            if (first) first.setAttribute("checked", "checked");
          }
        });
      } else if (next.startsWith('map:')) {
        const mapName = next.split(':')[1];
        generateMapAndNpcs(mapName);
        closeDialogOpt();
      }
    }
    lbls_opt_npc.innerHTML = '';
  }
}

function closeDialogOpt() {
  win_dialog_opt_npc.classList.add('hide');
  cleanDialogNPC();
}

function cleanDialogNPC() {
  resp = null;
  currentDialogNum = 1;
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