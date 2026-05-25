<?php
/* ============================================
   EcoWarm - Newsletter Subscription
   Created by: Aditya Kumar Sah
   ============================================ */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
$email = sanitize($data['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Valid email address required'], 400);
}

$pdo = getDBConnection();
if (!$pdo) {
    jsonResponse(['error' => 'Service temporarily unavailable'], 500);
}

// Check if already subscribed
$stmt = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = :email");
$stmt->execute([':email' => $email]);

if ($stmt->fetch()) {
    jsonResponse(['success' => true, 'message' => 'You are already subscribed!']);
}

// Add subscriber
$stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (:email, NOW())");
$stmt->execute([':email' => $email]);

jsonResponse(['success' => true, 'message' => 'Successfully subscribed! Welcome to the green movement. 🌿']);
?>
