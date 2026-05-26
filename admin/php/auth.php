<?php
/* EcoWarm Admin · Authentication Endpoint
   Created by: Aditya Kumar Sah */

require_once '../../php/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'login';

if ($action === 'login' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = sanitize($data['username'] ?? '');
    $password = $data['password'] ?? '';

    // For demo: hardcoded check. In production, use hashed passwords from DB.
    if ($username === 'admin' && $password === 'admin123') {
        $_SESSION['admin_id'] = 1;
        $_SESSION['admin_user'] = $username;
        $_SESSION['admin_login_time'] = time();

        jsonResponse([
            'success' => true,
            'user' => [ 'id' => 1, 'username' => $username, 'role' => 'super_admin' ],
            'token' => bin2hex(random_bytes(16))
        ]);
    }
    jsonResponse(['error' => 'Invalid credentials'], 401);
}

if ($action === 'logout') {
    session_destroy();
    jsonResponse(['success' => true]);
}

if ($action === 'check') {
    jsonResponse([
        'authenticated' => isset($_SESSION['admin_id']),
        'user' => $_SESSION['admin_user'] ?? null
    ]);
}

jsonResponse(['error' => 'Invalid action'], 400);
?>
