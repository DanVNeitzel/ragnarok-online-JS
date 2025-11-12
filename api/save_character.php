<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$userData = $input['userData'] ?? [];

if (empty($username) || empty($userData)) {
    echo json_encode(['error' => 'Dados incompletos']);
    exit;
}

$userFile = "../users/{$username}.json";
if (!file_exists($userFile)) {
    echo json_encode(['error' => 'Usuário não encontrado']);
    exit;
}

// Salvar os dados
file_put_contents($userFile, json_encode($userData, JSON_PRETTY_PRINT));

echo json_encode(['success' => true]);
?>
