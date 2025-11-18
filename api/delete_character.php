<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Receber dados do POST
$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$slot = $data['slot'] ?? '';

// Validar dados recebidos
if (empty($username) || empty($password) || empty($slot)) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

// Verificar se o arquivo do usuário existe
$userFile = "../users/{$username}.json";

if (!file_exists($userFile)) {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    exit;
}

// Ler dados do usuário
$userData = json_decode(file_get_contents($userFile), true);

// Verificar senha
if (!isset($userData[0]['password']) || $userData[0]['password'] !== $password) {
    echo json_encode(['success' => false, 'message' => 'Senha incorreta']);
    exit;
}

// Verificar se o slot existe
$slotIndex = intval($slot) - 1;

if (!isset($userData[0]['slots'][$slotIndex])) {
    echo json_encode(['success' => false, 'message' => 'Personagem não encontrado']);
    exit;
}

// Verificar se o personagem não está vazio
if (isset($userData[0]['slots'][$slotIndex]['stats']) && $userData[0]['slots'][$slotIndex]['stats'] === 'empty') {
    echo json_encode(['success' => false, 'message' => 'Slot já está vazio']);
    exit;
}

// Marcar personagem como vazio
$userData[0]['slots'][$slotIndex] = ['stats' => 'empty'];

// Salvar arquivo atualizado
if (file_put_contents($userFile, json_encode($userData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode([
        'success' => true, 
        'message' => 'Personagem deletado com sucesso'
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Erro ao salvar alterações'
    ]);
}
?>
