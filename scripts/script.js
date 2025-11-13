
var docElem = document.documentElement;
var statusFullscreen = 'off';

const input_user_id = document.getElementById('input_user_id');
const input_user_pass = document.getElementById('input_user_pass');

const win_select_world = document.getElementById('win_select_world');
const win_last_login = document.getElementById('win_last_login');
const block_message_login = document.getElementById('block_message_login');
const win_confirm_exit = document.getElementById('win_confirm_exit');
const win_select_player = document.getElementById('win_select_player');
const win_make_player = document.getElementById('win_make_player');
const win_skills_player = document.getElementById('win_skills_player');
const win_options_player = document.getElementById('win_options_player');

const block_login_form = document.getElementById('block_login_form');

const win_msg_error = document.getElementById('win_msg_error');
const title_msg_error = document.getElementById('title_msg_error');
const text_msg_error = document.getElementById('text_msg_error');

const char_slot = document.querySelectorAll('.char_slot');

const loading_screen = document.getElementById('loading_screen');

const clickLBtnLogin = document.querySelectorAll('.click-effect-login');

const block_charactor = document.querySelector('.block_charactor span');
const block_login = document.querySelector('.block_login');
const block_news = document.querySelector('.block_news');


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
            win_confirm_exit.style.zIndex = 1;
            win_confirm_exit.classList.remove('hide');
            break;

        case 'closeConfirmExit':
            win_confirm_exit.classList.add('hide');
            break;

        case 'resetPage':
            win_confirm_exit.classList.add('hide');
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
                win_msg_error.style.zIndex = 2;
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
                showLoginScreen();
                containerMap.classList.add('hide');
                containerLogin.classList.remove('hide');
                win_options_player.classList.add('hide');
                temp_select_char = currentUserSelected.name;
                currentUserSelected = null;
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
            win_select_player.classList.add('hide');
            win_make_player.style.zIndex = 1;
            win_make_player.classList.remove('hide');
            break;

        case 'criarPlayerChar':
            createNewPlayer();
            break;

        case 'fecharcriarPlayer':
            win_make_player.classList.add('hide');
            win_select_player.style.zIndex = 1;
            win_select_player.classList.remove('hide');
            break;

        case 'abrirWinSkillsPlayer':
            win_skills_player.style.zIndex = 1;
            win_skills_player.classList.remove('hide');
            break;

        case 'fecharWinSkillsPlayer':
            win_skills_player.classList.add('hide');
            break;

        case 'abrirWinOptionsPlayer':
            win_options_player.style.zIndex = 1;
            win_options_player.classList.remove('hide');
            break;

        case 'fecharWinOptionsPlayer':
            win_options_player.classList.add('hide');
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
    win_msg_error.style.zIndex = 1;
    win_msg_error.classList.remove('hide');
    title_msg_error.innerHTML = 'Mensagem'
    text_msg_error.innerHTML = 'Usuário ou senha incorretos. Por favor, tente novamente';
    block_message_login.classList.remove('hide');
    block_login_form.classList.add('hide');
    input_user_pass.value = '';
}

function resetMsgError() {
    win_msg_error.classList.add('hide');
    block_message_login.classList.add('hide');
    block_login_form.classList.remove('hide');
    title_msg_error.innerHTML = ''
    text_msg_error.innerHTML = '';
}

function genericMsgError() {
    win_msg_error.style.zIndex = 1;
    win_msg_error.classList.add('hide');
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