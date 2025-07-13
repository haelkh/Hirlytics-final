<?php

declare(strict_types=1);
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("X-Content-Type-Options: nosniff");

// Database configuration
const DB_HOST = 'localhost';
const DB_NAME = 'hirlytics';
const DB_USER = 'root';
const DB_PASS = '';

try {
    // Connect to database
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    // Get user's blogs
    $stmt = $pdo->prepare("
        SELECT 
            BlogID as id,
            BlogPublisherID as userId,
            Title as title,
            BriefBody as summary,
            Body as content,
            Genre as genre,
            ImagePath as imagePath,
            CreatedAt as createdAt
        FROM blog
        ORDER BY BlogID DESC
    ");
    $stmt->execute();
    $blogs = $stmt->fetchAll();

    // Convert image paths to URLs
    foreach ($blogs as &$blog) {
        if ($blog['imagePath']) {
            $blog['imageUrl'] = 'http://localhost:5173' . $blog['imagePath'];
        } else {
            $blog['imageUrl'] = null;
        }
        unset($blog['imagePath']);
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => $blogs,
        'count' => count($blogs),
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
