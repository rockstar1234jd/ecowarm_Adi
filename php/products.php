<?php
/* ============================================
   EcoWarm - Products API
   CRUD Operations for Products
   Created by: Aditya Kumar Sah
   ============================================ */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getProducts();
        break;
    case 'POST':
        addProduct();
        break;
    case 'PUT':
        updateProduct();
        break;
    case 'DELETE':
        deleteProduct();
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function getProducts() {
    $pdo = getDBConnection();
    if (!$pdo) {
        jsonResponse(['error' => 'Database connection failed'], 500);
    }

    $category = isset($_GET['category']) ? sanitize($_GET['category']) : null;
    $search = isset($_GET['search']) ? sanitize($_GET['search']) : null;

    $sql = "SELECT * FROM products WHERE 1=1";
    $params = [];

    if ($category && $category !== 'all') {
        $sql .= " AND category = :category";
        $params[':category'] = $category;
    }

    if ($search) {
        $sql .= " AND (name LIKE :search OR description LIKE :search)";
        $params[':search'] = "%{$search}%";
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    jsonResponse(['success' => true, 'products' => $products]);
}

function addProduct() {
    $pdo = getDBConnection();
    if (!$pdo) {
        jsonResponse(['error' => 'Database connection failed'], 500);
    }

    $data = json_decode(file_get_contents('php://input'), true);

    $name = sanitize($data['name'] ?? '');
    $description = sanitize($data['description'] ?? '');
    $price = floatval($data['price'] ?? 0);
    $category = sanitize($data['category'] ?? '');
    $image = sanitize($data['image'] ?? '');

    if (empty($name) || $price <= 0) {
        jsonResponse(['error' => 'Name and valid price are required'], 400);
    }

    $sql = "INSERT INTO products (name, description, price, category, image) VALUES (:name, :description, :price, :category, :image)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':description' => $description,
        ':price' => $price,
        ':category' => $category,
        ':image' => $image
    ]);

    jsonResponse(['success' => true, 'message' => 'Product added', 'id' => $pdo->lastInsertId()], 201);
}

function updateProduct() {
    $pdo = getDBConnection();
    if (!$pdo) {
        jsonResponse(['error' => 'Database connection failed'], 500);
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id'] ?? 0);

    if ($id <= 0) {
        jsonResponse(['error' => 'Valid product ID required'], 400);
    }

    $fields = [];
    $params = [':id' => $id];

    if (isset($data['name'])) {
        $fields[] = "name = :name";
        $params[':name'] = sanitize($data['name']);
    }
    if (isset($data['description'])) {
        $fields[] = "description = :description";
        $params[':description'] = sanitize($data['description']);
    }
    if (isset($data['price'])) {
        $fields[] = "price = :price";
        $params[':price'] = floatval($data['price']);
    }
    if (isset($data['category'])) {
        $fields[] = "category = :category";
        $params[':category'] = sanitize($data['category']);
    }

    if (empty($fields)) {
        jsonResponse(['error' => 'No fields to update'], 400);
    }

    $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['success' => true, 'message' => 'Product updated']);
}

function deleteProduct() {
    $pdo = getDBConnection();
    if (!$pdo) {
        jsonResponse(['error' => 'Database connection failed'], 500);
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id'] ?? 0);

    if ($id <= 0) {
        jsonResponse(['error' => 'Valid product ID required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM products WHERE id = :id");
    $stmt->execute([':id' => $id]);

    jsonResponse(['success' => true, 'message' => 'Product deleted']);
}
?>
