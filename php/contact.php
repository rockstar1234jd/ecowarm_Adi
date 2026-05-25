<?php
/* ============================================
   EcoWarm - Contact Form Handler
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

$name = sanitize($data['name'] ?? '');
$email = sanitize($data['email'] ?? '');
$subject = sanitize($data['subject'] ?? 'No Subject');
$message = sanitize($data['message'] ?? '');

// Validation
if (empty($name) || empty($email) || empty($message)) {
    jsonResponse(['error' => 'Name, email, and message are required'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Invalid email address'], 400);
}

// Store in database
$pdo = getDBConnection();
if ($pdo) {
    $sql = "INSERT INTO contact_messages (name, email, subject, message) VALUES (:name, :email, :subject, :message)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':subject' => $subject,
        ':message' => $message
    ]);
}

// Send email notification (configure SMTP in production)
$to = "hello@ecowarm.co";
$headers = "From: {$name} <{$email}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$emailBody = "
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> {$name}</p>
<p><strong>Email:</strong> {$email}</p>
<p><strong>Subject:</strong> {$subject}</p>
<p><strong>Message:</strong> {$message}</p>
";

@mail($to, "EcoWarm Contact: {$subject}", $emailBody, $headers);

jsonResponse(['success' => true, 'message' => 'Message sent successfully! We will get back to you soon.']);
?>
