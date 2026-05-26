<?php
/* EcoWarm Admin · Dashboard Stats Endpoint
   Created by: Aditya Kumar Sah */

require_once '../../php/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (!isset($_SESSION['admin_id'])) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

$pdo = getDBConnection();
if (!$pdo) {
    // Fallback demo data when DB is not available
    jsonResponse([
        'success' => true,
        'stats' => [
            'revenue' => 48592,
            'orders' => 1284,
            'customers' => 892,
            'species' => 240
        ],
        'recentOrders' => [
            ['product' => 'Mexican Redknee Tarantula', 'customer' => 'Sarah M.', 'price' => 249, 'status' => 'completed'],
            ['product' => 'Deathstalker Scorpion', 'customer' => 'James R.', 'price' => 480, 'status' => 'pending'],
            ['product' => 'Crested Gecko', 'customer' => 'Emma C.', 'price' => 180, 'status' => 'processing']
        ],
        'topCategories' => [
            ['name' => 'Tarantulas', 'percent' => 42],
            ['name' => 'Scorpions', 'percent' => 28],
            ['name' => 'Reptiles', 'percent' => 22],
            ['name' => 'Centipedes', 'percent' => 8]
        ]
    ]);
}

// With DB:
try {
    $revenue = $pdo->query("SELECT SUM(total_amount) FROM orders WHERE status='delivered'")->fetchColumn() ?: 0;
    $orderCount = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn() ?: 0;
    $custCount = $pdo->query("SELECT COUNT(DISTINCT customer_email) FROM orders")->fetchColumn() ?: 0;
    $prodCount = $pdo->query("SELECT COUNT(*) FROM products WHERE is_active=1")->fetchColumn() ?: 0;

    $recent = $pdo->query("SELECT o.*, GROUP_CONCAT(p.name) as products FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id LEFT JOIN products p ON p.id=oi.product_id GROUP BY o.id ORDER BY o.created_at DESC LIMIT 5")->fetchAll();

    jsonResponse([
        'success' => true,
        'stats' => [
            'revenue' => floatval($revenue),
            'orders' => intval($orderCount),
            'customers' => intval($custCount),
            'species' => intval($prodCount)
        ],
        'recentOrders' => $recent
    ]);
} catch (Exception $e) {
    jsonResponse(['error' => 'Failed to load stats', 'details' => $e->getMessage()], 500);
}
?>
