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
  var dados = {
    nome: 'usuario_mock',
    mensagem: inputChat.value,
    data: formatarDataHora()
  };
  // var dados = {
  //   nome: currentUserSelected.name,
  //   mensagem: inputChat.value,
  //   data: formatarDataHora()
  // };

  fetch('https://www.danielneitzel.com.br/api/ragnarokJS/mensagens.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Mensagem salva com sucesso:', data);
    })
    .catch((error) => {
      console.error('Erro ao salvar mensagem:', error);
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
    .then(response => response.json())
    .then(data => exibirMensagens(data))
    .catch(error => console.error('Erro ao obter mensagens:', error));
}

function exibirMensagens(mensagens) {
  liveChat.innerHTML = ''; // Limpar conteúdo atual

  // Iterar sobre as mensagens e exibi-las no container
  mensagens.forEach(function (mensagem) {
    var mensagemHtml = `<span class="msg_player">${mensagem.nome}: ${mensagem.mensagem}<br></span>`;
    liveChat.innerHTML += mensagemHtml;
  });
}