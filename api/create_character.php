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
$character = $input['character'] ?? [];

if (empty($username) || empty($character)) {
    echo json_encode(['error' => 'Dados incompletos']);
    exit;
}

$name = $character['name'] ?? '';
if (empty($name) || strlen($name) < 6 || strlen($name) > 13) {
    echo json_encode(['error' => 'Nome do personagem deve ter entre 6 e 13 caracteres']);
    exit;
}

$userFile = "../users/{$username}.json";
if (!file_exists($userFile)) {
    echo json_encode(['error' => 'Usuário não encontrado']);
    exit;
}

$userData = json_decode(file_get_contents($userFile), true);

// Verificar se há slot vazio
$slotIndex = -1;
for ($i = 0; $i < count($userData[0]['slots']); $i++) {
    if ($userData[0]['slots'][$i]['stats'] === 'empty') {
        $slotIndex = $i;
        break;
    }
}

if ($slotIndex === -1) {
    echo json_encode(['error' => 'Nenhum slot disponível']);
    exit;
}

// Adicionar personagem
$userData[0]['slots'][$slotIndex] = [
    "stats" => "active",
    "name" => $name,
    "hair" => $character['hair'] ?? 'aprendiz_1',
    "class" => "Aprendiz",
    "zeny" => 0,
    "map" => "Tutorial_0_1",
    "level" => 1,
    "experience" => 0,
    "weight" => 0,
    "hp" => 100,
    "sp" => 75,
    "for" => $character['for'] ?? 5,
    "agi" => $character['agi'] ?? 5,
    "vit" => $character['vit'] ?? 5,
    "int" => $character['int'] ?? 5,
    "des" => $character['des'] ?? 5,
    "sor" => $character['sor'] ?? 5
];

// Salvar
file_put_contents($userFile, json_encode($userData, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'data' => $userData]);
?>