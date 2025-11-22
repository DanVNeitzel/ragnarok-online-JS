
var docElem = document.documentElement;
var statusFullscreen = 'off';

var input_user_id = document.getElementById('input_user_id');
var input_user_pass = document.getElementById('input_user_pass');

var win_select_world = document.getElementById('win_select_world');
var win_last_login = document.getElementById('win_last_login');
var block_message_login = document.getElementById('block_message_login');
var win_confirm_exit = document.getElementById('win_confirm_exit');
var win_select_player = document.getElementById('win_select_player');
var win_make_player = document.getElementById('win_make_player');
var win_skills_player = document.getElementById('win_skills_player');
var win_options_player = document.getElementById('win_options_player');

var block_login_form = document.getElementById('block_login_form');

var win_msg_error = document.getElementById('win_msg_error');
var title_msg_error = document.getElementById('title_msg_error');
var text_msg_error = document.getElementById('text_msg_error');

var char_slot = document.querySelectorAll('.char_slot');

var modalOverlay = document.getElementById('modalOverlay');

var loading_screen = document.getElementById('loading_screen');

var clickLBtnLogin = document.querySelectorAll('.click-effect-login');

var block_charactor = document.querySelector('.block_charactor span');
var block_login = document.querySelector('.block_login');
var block_news = document.querySelector('.block_news');

var apiLink = './api/';

var statusLoading = false;

var inMap = false;

var music_temp = '';
var effect_temp = '';

var temp_select_char;

function clickInput(type) {
    switch (type) {
        case 'id':
            input_user_id.focus();
            break;

        case 'pass':
            input_user_pass.focus();
            break;

        case 'delete_pass':
            document.getElementById('input_delete_pass').focus();
            break;

        default:
            break;
    }
}

function showLoginScreen() {
    setTimeout(
        function () {
            var black_screen = document.querySelector(".black_screen");
            black_screen.style.transition = "opacity " + .6 + "s";
            black_screen.style.opacity = 0;
            black_screen.addEventListener("transitionend", function () {
                console.log("Carregamento dos dados completado");
                block_login.classList.remove('hide');
                block_news.classList.remove('hide');
                block_login.classList.add('fadeInAnim');
                block_news.classList.add('fadeInAnim');
                input_user_id.focus();
                black_screen.style.display = "none";
                // generateMapAndNpcs('Tutorial_0_1');
            });
        }, 1000
    );
}

function cmd(selected) {
    switch (selected) {
        case 'exitGame':
            if (!inMap) modalOverlay.classList.remove('hide');
            win_confirm_exit.style.zIndex = 1001;
            win_confirm_exit.classList.remove('hide');
            break;

        case 'closeConfirmExit':
            win_confirm_exit.classList.add('hide');
            modalOverlay.classList.add('hide');
            break;

        case 'resetPage':
            win_confirm_exit.classList.add('hide');
            modalOverlay.classList.add('hide');
            location.replace(location.href);
            break;

        case 'loginGame':
            if (input_user_id.value !== '' || input_user_pass.value !== '') {
                verifyLogin();
            } else {
                invalidLogin();
            }
            break;

        case 'fecharBlcMsgError':
            resetMsgError();
            modalOverlay.classList.add('hide');
            input_user_id.focus();
            break;

        case 'fecharWinSelectWorld':
            input_user_id.value = '';
            input_user_pass.value = '';
            block_login.classList.remove('hide');
            block_news.classList.remove('hide');
            win_select_world.classList.add('hide');
            block_login.classList.add('fadeInAnim');
            block_news.classList.add('fadeInAnim');
            input_user_id.focus();
            break;

        case 'fecharSelectPlayer':
            win_select_world.classList.remove('hide');
            win_select_player.classList.add('hide');
            break;

        case 'selectedUserWorld':
            const worldstatus = verifyWorld();
            console.log(worldstatus);
            if (worldstatus === true) {
                loadCharSlots();
                win_select_world.classList.add('hide');
                win_select_player.style.zIndex = 1;
                win_select_player.classList.remove('hide');
            } else {
                if (!inMap) modalOverlay.classList.remove('hide');
                win_msg_error.style.zIndex = 1001;
                win_msg_error.classList.remove('hide');
                title_msg_error.innerHTML = 'Mensagem';
                text_msg_error.innerHTML = 'Você não tem permissão pra entrar nesse mundo.';
            }

            break;

        case 'selectedPlayerChar':
            if (inMap === true) {
                console.log('voltando para selecionar personagem...');
                inMap = false;
                removeMapAndNpcs();
                containerMap.classList.add('hide');
                containerLogin.classList.remove('hide');
                win_options_player.classList.add('hide');
                setTimeout(() => {
                    loadCharSlots();
                }, 1000);
            } else {
                loadingScreen();
                var id = setInterval(loadVerify, 1000);
                function loadVerify() {
                    if (statusLoading) {
                        statusLoading = false;
                        clearInterval(id);
                        loadPlayerInfo();
                        generateMapAndNpcs(currentUserSelected.map);
                        inMap = true;
                    } else {
                        console.warn('loading em andamento');
                    }
                }
            }
            break;

        case 'newPlayerChar':
            NewNameChar.value = '';
            NewNameChar.focus();
            win_select_player.classList.add('hide');
            win_make_player.style.zIndex = 1001;
            win_make_player.classList.remove('hide');
            break;

        case 'criarPlayerChar':
            createNewPlayer();
            break;

        case 'fecharcriarPlayer':
            win_make_player.classList.add('hide');
            modalOverlay.classList.add('hide');
            win_select_player.style.zIndex = 1;
            win_select_player.classList.remove('hide');
            break;

        case 'abrirWinSkillsPlayer':
            if (!inMap) modalOverlay.classList.remove('hide');
            win_skills_player.style.zIndex = 1001;
            win_skills_player.classList.remove('hide');
            break;

        case 'fecharWinSkillsPlayer':
            win_skills_player.classList.add('hide');
            modalOverlay.classList.add('hide');
            break;

        case 'abrirWinOptionsPlayer':
            if (!inMap) modalOverlay.classList.remove('hide');
            win_options_player.style.zIndex = 1001;
            win_options_player.classList.remove('hide');
            break;

        case 'fecharWinOptionsPlayer':
            win_options_player.classList.add('hide');
            modalOverlay.classList.add('hide');
            break;

        case 'deletePlayerChar':
            deletePlayerChar();
            break;

        case 'confirmarDeleteChar':
            confirmarDeleteChar();
            break;

        case 'cancelarDeleteChar':
            cancelarDeleteChar();
            break;

        default:
            break;
    }
}

function conSuccess() {
    console.log('usuario validado com sucesso.');
    win_msg_error.classList.add('hide');
    win_login.classList.add('hide');
    win_select_world.classList.remove('hide');
    win_select_world.classList.add('fadeInAnim');
}

function invalidLogin(type) {
    if (!inMap) modalOverlay.classList.remove('hide');
    win_msg_error.style.zIndex = 1001;
    win_msg_error.classList.remove('hide');
    title_msg_error.innerHTML = 'Mensagem'
    text_msg_error.innerHTML = 'Usuário ou senha incorretos. Por favor, tente novamente';
    block_message_login.classList.remove('hide');
    block_login_form.classList.add('hide');
    input_user_pass.value = '';
}

function showMsgError(title, message) {
    if (!inMap) modalOverlay.classList.remove('hide');
    win_msg_error.style.zIndex = 1001;
    win_msg_error.classList.remove('hide');
    title_msg_error.innerHTML = title;
    text_msg_error.innerHTML = message;
}

function resetMsgError() {
    win_msg_error.classList.add('hide');
    modalOverlay.classList.add('hide');
    block_message_login.classList.add('hide');
    block_login_form.classList.remove('hide');
    title_msg_error.innerHTML = ''
    text_msg_error.innerHTML = '';
}

function genericMsgError() {
    win_msg_error.style.zIndex = 1;
    win_msg_error.classList.add('hide');
    modalOverlay.classList.add('hide');
    block_message_login.classList.add('hide');
    block_login_form.classList.remove('hide');
    title_msg_error.innerHTML = 'Message';
    text_msg_error.innerHTML = 'Não foi possível conectar-se ao servidor.';
}

function playMsc(status) {
    if (music_temp !== 'music_login') {
        const soundGame = document.getElementById('musicGame');
        soundGame.volume = 0.1;
        soundGame.src = 'audio/login_sound.mp3';
        soundGame.play();
        music_temp = status;
    }
    showLoginScreen();
}

function playbtnEffect() {
    const effectGame = document.getElementById('effectGame');
    effectGame.volume = 0.1;
    effectGame.src = 'audio/login_button_click.mp3';
    effectGame.play();
}

for (let btn = 0; btn < clickLBtnLogin.length; btn++) {
    clickLBtnLogin[btn].addEventListener('click', () => {
        const effectGame = document.getElementById('effectGame');
        effectGame.volume = 0.1;
        effectGame.src = 'audio/login_button_click.mp3';
        effectGame.play();
    });
}

input_user_id.onkeydown = function (e) {
    if (e.key == "Enter") {
        playbtnEffect();
        verifyLogin();
    }
};

input_user_pass.onkeydown = function (e) {
    if (e.key == "Enter") {
        playbtnEffect();
        verifyLogin();
    }
};

// Evento para o input de senha de exclusão
document.addEventListener('DOMContentLoaded', function() {
    const inputDeletePass = document.getElementById('input_delete_pass');
    if (inputDeletePass) {
        inputDeletePass.onkeydown = function (e) {
            if (e.key == "Enter") {
                playbtnEffect();
                confirmarDeleteChar();
            }
        };
    }
});


function Fullscreen(stats) {
    if (statusFullscreen === 'off') {
        if (docElem.requestFullscreen) {
            docElem.requestFullscreen();
        } else if (docElem.webkitRequestFullscreen) { /* Safari */
            docElem.webkitRequestFullscreen();
        } else if (docElem.msRequestFullscreen) { /* IE11 */
            docElem.msRequestFullscreen();
        }
        statusFullscreen = 'on';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        statusFullscreen = 'off';
    }
}

function loadingScreen() {
    const numLoadImg = 'load_' + Math.floor(Math.random() * 8);
    loading_screen.style.backgroundImage = "url('./graphics/bg/" + numLoadImg + ".jpg')";
    loading_screen.classList.remove('hide');
    var loadBar = document.getElementById("loadBar");
    var elem2 = document.getElementById("loadNum");
    var width = 0;
    var id = setInterval(frame, 75);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
            loading_screen.classList.add('hide');
            statusLoading = true;
        } else {
            width++;
            loadBar.style.width = width + '%';
            elem2.innerHTML = width * 1 + '%';
        }
    }
}