<?php
/* ============================================
   EcoWarm - PHP Configuration
   Database & App Settings
   Created by: Aditya Kumar Sah
   ============================================ */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'ecowarm_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// Application Settings
define('APP_NAME', 'EcoWarm');
define('APP_URL', 'http://localhost/ecowarm');
define('APP_VERSION', '1.0.0');
define('APP_AUTHOR', 'Aditya Kumar Sah');

// Session Configuration
session_start();

// Database Connection
function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database Connection Error: " . $e->getMessage());
        return null;
    }
}

// Helper Functions
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}
?>
