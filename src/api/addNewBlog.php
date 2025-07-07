<?php
declare(strict_types=1);
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("X-Content-Type-Options: nosniff");

// Database configuration
const DB_HOST = 'localhost';
const DB_NAME = 'hirlytics';
const DB_USER = 'root';
const DB_PASS = '';

try {
    // Get and validate input
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input", 400);
    }

    $required = ['user_id', 'title', 'body', 'genre'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            throw new Exception("Missing required field: $field", 400);
        }
    }

    $userId = filter_var($input['user_id'], FILTER_VALIDATE_INT);
    if (!$userId || $userId <= 0) {
        throw new Exception("Invalid User ID", 400);
    }

    // Generate brief body (first 100 chars)
    $briefBody = mb_substr(strip_tags($input['body']), 0, 100);

    // Connect to database
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    // Insert new blog
    $stmt = $pdo->prepare("
        INSERT INTO blog (
            BlogPublisherID,
            Title,
            Body,
            Genre,
            BriefBody
        ) VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $userId,
        $input['title'],
        $input['body'],
        $input['genre'],
        $briefBody
    ]);

    $newBlogId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Blog created successfully',
        'blogId' => (int)$newBlogId,
        'timestamp' => date('c')
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>