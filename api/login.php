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
$password = $input['password'] ?? '';
$world = $input['world'] ?? '';

if (empty($username) || empty($password) || empty($world)) {
    echo json_encode(['error' => 'Dados incompletos']);
    exit;
}

$usersFile = '../users/users.json';
$userFile = '';

if (strpos($username, 'm_') === 0 || strpos($username, 'f_') === 0) {
    $realUsername = substr($username, 2);
    $userFile = "../users/{$realUsername}.json";
    if (!file_exists($userFile)) {
        // Criar novo usuário
        $newUserData = [
            [
                "username" => $realUsername,
                "password" => $password,
                "auth_server" => $world,
                "slots" => [
                    ["stats" => "empty"],
                    ["stats" => "empty"],
                    ["stats" => "empty"]
                ]
            ]
        ];
        file_put_contents($userFile, json_encode($newUserData, JSON_PRETTY_PRINT));

        // Adicionar à lista de usuários
        if (file_exists($usersFile)) {
            $usersData = json_decode(file_get_contents($usersFile), true);
        } else {
            $usersData = ['users' => []];
        }
        if (!in_array($realUsername, $usersData['users'])) {
            $usersData['users'][] = $realUsername;
            file_put_contents($usersFile, json_encode($usersData, JSON_PRETTY_PRINT));
        }

        echo json_encode(['success' => true, 'user' => $realUsername, 'data' => $newUserData]);
    } else {
        // Usuário existe, verificar senha e mundo
        $userData = json_decode(file_get_contents($userFile), true);
        if ($userData[0]['password'] === $password && $userData[0]['auth_server'] === $world) {
            echo json_encode(['success' => true, 'user' => $realUsername, 'data' => $userData]);
        } else {
            echo json_encode(['error' => 'Credenciais inválidas']);
        }
    }
} else {
    $userFile = "../users/{$username}.json";
    if (file_exists($userFile)) {
        $userData = json_decode(file_get_contents($userFile), true);
        if ($userData[0]['password'] === $password && $userData[0]['auth_server'] === $world) {
            echo json_encode(['success' => true, 'user' => $username, 'data' => $userData]);
        } else {
            echo json_encode(['error' => 'Credenciais inválidas']);
        }
    } else {
        echo json_encode(['error' => 'Usuário não encontrado']);
    }
}
?>