const liveChat = document.getElementById('live-chat');
const inputChat = document.getElementById('inputChat');

var autoChat;

function rolarParaFinal() {
  setTimeout(() => {
    liveChat.scrollTo({
      top: liveChat.scrollHeight,
      behavior: 'auto' // ou 'auto' para rolar instantaneamente
    });
  }, 1000);
}

document.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && inputChat.value.length === 0 && onMap === true) {
    inputChat.disabled = !inputChat.disabled;
    clearInterval(autoChat);
    if (!inputChat.disabled) {
      autoChat = setInterval(obterMensagens, 1000);
      inputChat.focus();
    }
  }
  if (event.key === 'Enter' && inputChat.value.length > 0 && onMap === true) {
    // liveChat.innerHTML += '<span class="msg_player">' + currentUserSelected.name + ': ' + inputChat.value + '<br></span>';
    salvarMensagem();
    setTimeout(() => {
      obterMensagens();
      rolarParaFinal();
    }, 75);
    inputChat.value = '';
  }
});


function salvarMensagem() {
  // var dados = {
  //   nome: 'usuario_mock',
  //   mensagem: inputChat.value,
  //   data: formatarDataHora()
  // };
  var dados = {
    nome: currentUserSelected.name,
    mensagem: inputChat.value,
    data: formatarDataHora()
  };

  // Exibir a mensagem localmente primeiro para feedback imediato
  exibirMensagemLocal(dados);

  fetch('https://www.danielneitzel.com.br/api/ragnarokJS/mensagens.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })
    .then(response => {
      // Verificar se a resposta está OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      // Verificar se há conteúdo na resposta
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("A resposta não é JSON válido");
      }
      
      return response.json();
    })
    .then(data => {
      console.log('Mensagem salva com sucesso:', data);
      // Após salvar com sucesso, tentar obter mensagens atualizadas
      if (data && data.status === 'success') {
        setTimeout(() => {
          obterMensagens();
        }, 200); // Pequeno delay para garantir que o servidor processou
      }
    })
    .catch((error) => {
      console.error('Erro ao salvar mensagem:', error);
      
      // Verificar se é um erro de CORS ou rede
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error('Possível problema de CORS ou servidor indisponível. Verifique se o servidor está online e configurado para aceitar requisições deste domínio.');
      }
    });
}


function formatarDataHora() {
  var agora = new Date();

  // Obter horas e minutos
  var horas = agora.getHours();
  var minutos = agora.getMinutes();

  // Adicionar zero à esquerda se necessário (para manter o formato HH:MM)
  horas = horas < 10 ? '0' + horas : horas;
  minutos = minutos < 10 ? '0' + minutos : minutos;

  // Obter dia, mês e ano
  var dia = agora.getDate();
  var mes = agora.getMonth() + 1; // Meses começam do zero
  var ano = agora.getFullYear();

  // Adicionar zero à esquerda se necessário (para manter o formato DD/MM/AAAA)
  dia = dia < 10 ? '0' + dia : dia;
  mes = mes < 10 ? '0' + mes : mes;

  // Criar a string formatada
  var dataHoraFormatada = horas + ':' + minutos + ' - ' + dia + '-' + mes + '-' + ano;

  return dataHoraFormatada;
}

function obterMensagens() {
  // Enviar uma solicitação para obter os dados do servidor
  fetch('https://www.danielneitzel.com.br/api/ragnarokJS/obter_mensagens.php')
    .then(response => {
      // Verificar se a resposta está OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Verificar se há conteúdo na resposta
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("A resposta não é JSON válido");
      }
      
      // Clonar a resposta para poder ler o texto em caso de erro
      return response.clone().text().then(text => {
        if (!text || text.trim().length === 0) {
          console.log('Nenhuma mensagem no servidor ainda');
          return [];
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Erro ao fazer parse do JSON:', text);
          throw e;
        }
      });
    })
    .then(data => exibirMensagens(data))
    .catch(error => console.error('Erro ao obter mensagens:', error));
}

function exibirMensagemLocal(mensagem) {
  // Adicionar a mensagem ao chat imediatamente
  var mensagemHtml = `<span class="msg_player">${mensagem.nome}: ${mensagem.mensagem}<br></span>`;
  liveChat.innerHTML += mensagemHtml;
  rolarParaFinal();
}

function exibirMensagens(mensagens) {
  // Se há mensagens do servidor, usar elas (elas incluem todas as mensagens salvas)
  if (mensagens && mensagens.length > 0) {
    liveChat.innerHTML = '';

    // Iterar sobre as mensagens e exibi-las no container
    mensagens.forEach(function (mensagem) {
      var mensagemHtml = `<span class="msg_player">${mensagem.nome}: ${mensagem.mensagem}<br></span>`;
      liveChat.innerHTML += mensagemHtml;
    });

    console.log(`${mensagens.length} mensagens carregadas do servidor`);
    rolarParaFinal();
  } else {
    // Se não há mensagens do servidor, manter mensagens locais já exibidas
    console.log('Nenhuma mensagem do servidor, mantendo mensagens locais');
  }
}