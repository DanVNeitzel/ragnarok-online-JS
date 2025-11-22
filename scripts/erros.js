function showErrorMessage(type) {
  if (!inMap) modalOverlay.classList.remove('hide');
  win_msg_error.style.zIndex = 1001;
  win_msg_error.classList.remove('hide');
  title_msg_error.innerHTML = 'Mensagem';
  switch (type) {
    case 'validCharName':
      text_msg_error.innerHTML = 'Digite um nome válido para o personagem.';
      NewNameChar.style.border = '1px solid red';
      NewNameChar.focus();
      break;

    case 'numberCharName':
      text_msg_error.innerHTML = 'Seu nome deve ter entre 6 e 12 caracteres.';
      NewNameChar.style.border = '1px solid red';
      NewNameChar.focus();
      break;

    case 'duplicateCharName':
      text_msg_error.innerHTML = 'Já existe um personagem com esse nome.';
      NewNameChar.style.border = '1px solid red';
      NewNameChar.focus();
      break;

    default:
      break;
  }
}