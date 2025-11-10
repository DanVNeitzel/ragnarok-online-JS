/*
 * Arquivo de configuração e gerenciamento de diálogos de NPCs.
 * 
 * Para adicionar um novo diálogo de NPC:
 * 1. Edite o arquivo config/npc_dialogs.json.
 * 2. Adicione uma nova entrada com o nome do NPC como chave (deve corresponder ao usado em speak('NomeNPC')).
 * 3. Defina os campos:
 *    - name: nome do NPC exibido (ex: "[NomeNPC]")
 *    - dialogues: array de objetos de diálogo
 *      - id: identificador único do diálogo (ex: "start", "info")
 *      - text: texto do diálogo (pode usar <br> para quebras de linha)
 *      - options: array de objetos de opção
 *        - text: texto da opção
 *        - next: id do próximo diálogo (opcional, se não houver, deve ter action)
 *        - action: ação a executar (ex: "close", "map:NomeMapa")
 * 
 * Exemplo:
 * "NovoNPC": {
 *   "name": "[Novo NPC]",
 *   "dialogues": [
 *     {
 *       "id": "start",
 *       "text": "Olá, aventureiro!",
 *       "options": [
 *         {"text": "Falar", "next": "talk"},
 *         {"text": "Sair", "action": "close"}
 *       ]
 *     },
 *     {
 *       "id": "talk",
 *       "text": "Aqui vai a conversa.",
 *       "options": [
 *         {"text": "Ok", "action": "close"}
 *       ]
 *     }
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
const lbls_opt_npc = document.getElementById('lbls_opt_npc');

const jsonUrl = "./config/npc_dialogs.json";

var respNPC;
var selectedNPCInfo;
var currentDialogueId;

fetchJSON('');

async function fetchJSON(npcSelected) {

  try {
    console.log("Tentando carregar JSON para NPC:", npcSelected);
    // Fetch do JSON
    const response = await fetch(jsonUrl);

    // Verifica se a resposta foi bem-sucedida (status 200 OK)
    console.log("Fetch response status:", response.status);
    if (!response.ok) {
      throw new Error(`Erro ao obter o JSON. Status: ${response.status}`);
    }

    // Converte a resposta para JSON
    const NPC_Info = await response.json();
    console.log("JSON carregado com sucesso:", NPC_Info);

    // Verifica se a propriedade npcSelected existe no objeto NPC_Info
    if (NPC_Info.hasOwnProperty(npcSelected)) {
      selectedNPCInfo = NPC_Info[npcSelected];
      console.log("NPC encontrado:", selectedNPCInfo);
    } else {
      console.warn('O NPC não foi encontrado na base. Carregado base padrão.');
      selectedNPCInfo = null;
    }

  } catch (error) {
    console.error("Erro ao processar o JSON:", error);
    selectedNPCInfo = null;
  }
}

function speak(npc) {
  console.log("speak chamado com npc:", npc, "respNPC:", respNPC, "selectedNPCInfo:", selectedNPCInfo);
  if (!respNPC) {
    fetchJSON(npc).then(() => {
      if (!selectedNPCInfo || !selectedNPCInfo.dialogues) {
        console.error("Erro: Dados do NPC não carregados ou inválidos para", npc);
        return;
      }
      WinNpcOpen = win_dialog_opt_npc.classList.contains("hide");
      if (WinNpcOpen) {
        win_dialog_opt_npc.classList.remove('hide');
        currentDialogueId = 'start';
        const dialogue = selectedNPCInfo.dialogues.find(d => d.id === currentDialogueId);
        if (!dialogue) {
          console.error("Erro: Diálogo 'start' não encontrado para", npc);
          closeDialogOpt();
          return;
        }
        npc_name.innerHTML = selectedNPCInfo.name;
        npc_text.innerHTML = dialogue.text;
        lbls_opt_npc.innerHTML = '';
        dialogue.options.forEach((option, index) => {
          lbls_opt_npc.innerHTML += `
      <label class='selectAlt'>${option.text}
        <input type='radio' id='NPC_dialog' name='npc_option' value='${option.text}'>
        <span class='checkmark'>
          <span></span>${option.text}
        </span>
      </label>`
          if (index === 0) {
            const first = document.getElementById("NPC_dialog");
            first.setAttribute("checked", "checked");
          }
        });
      }
    }).catch(error => {
      console.error("Erro ao carregar dados do NPC:", error);
    });
  } else {
    if (!selectedNPCInfo || !selectedNPCInfo.dialogues) {
      console.error("Erro: Dados do NPC não disponíveis");
      return;
    }
    const currentDialogue = selectedNPCInfo.dialogues.find(d => d.id === currentDialogueId);
    if (!currentDialogue) {
      console.error("Erro: Diálogo atual não encontrado");
      closeDialogOpt();
      return;
    }
    const selectedOption = currentDialogue.options.find(opt => opt.text === respNPC);
    if (selectedOption) {
      if (selectedOption.action) {
        if (selectedOption.action === 'close') {
          closeDialogOpt();
        } else if (selectedOption.action.startsWith('map:')) {
          const mapName = selectedOption.action.split(':')[1];
          generateMapAndNpcs(mapName);
          closeDialogOpt();
        }
      } else if (selectedOption.next) {
        currentDialogueId = selectedOption.next;
        const nextDialogue = selectedNPCInfo.dialogues.find(d => d.id === currentDialogueId);
        if (!nextDialogue) {
          console.error("Erro: Próximo diálogo não encontrado:", selectedOption.next);
          closeDialogOpt();
          return;
        }
        npc_text.innerHTML = nextDialogue.text;
        lbls_opt_npc.innerHTML = '';
        nextDialogue.options.forEach((option, index) => {
          lbls_opt_npc.innerHTML += `
          <label class='selectAlt'>${option.text}
            <input type='radio' id='NPC_dialog' name='NPC_dialog' value='${option.text}'>
            <span class='checkmark'>
              <span></span>${option.text}
            </span>
          </label>`
          if (index === 0) {
            const first = document.getElementById("NPC_dialog");
            if (first) first.setAttribute("checked", "checked");
          }
        });
      } else {
        // Se não tiver action nem next, fecha o modal
        closeDialogOpt();
      }
    }
  }
}

function closeDialogOpt() {
  win_dialog_opt_npc.classList.add('hide');
  cleanDialogNPC();
}

function cleanDialogNPC() {
  respNPC = null;
  npc_name.innerHTML = '';
  npc_text.innerHTML = '';
  lbls_opt_npc.innerHTML = '';
  win_dialog_npc.style.top = 'calc(50% + 25px)';
  win_dialog_npc.style.left = 'calc(50% + 130px)';
  win_dialog_opt_npc.style.top = 'calc(50% + 55px)';
  win_dialog_opt_npc.style.left = 'calc(50% - 190px)';
}

function optDialogNPC() {
  console.log("optDialogNPC chamado, selectedNPCInfo:", selectedNPCInfo);
  if (!selectedNPCInfo) {
    console.warn("Aguardando carregamento dos dados do NPC...");
    return;
  }
  const items = document.getElementsByName('npc_option');
  console.log("Encontrados", items.length, "items com name='npc_option'");
  if (items.length === 0) {
    console.warn("Nenhuma opção disponível, fechando modal");
    closeDialogOpt();
    return;
  }
  for (var i = 0; i < items.length; i++) {
    console.log("Item", i, "value:", items[i].value, "checked:", items[i].checked);
    if (items[i].checked) {
      respNPC = items[i].value;
      console.log("respNPC setado para:", respNPC);
      speak();
    }
  }

  // console.log(respNPC);
}