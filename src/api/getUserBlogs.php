<?php

declare(strict_types=1);
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("X-Content-Type-Options: nosniff");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', '1');

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

    // Check if required columns exist
    $columnsQuery = $pdo->query("SHOW COLUMNS FROM blog");
    $columns = $columnsQuery->fetchAll(PDO::FETCH_COLUMN);

    // Build the SELECT query based on existing columns
    $selectFields = [
        'BlogID as id',
        'BlogPublisherID as userId',
        'Title as title',
        'BriefBody as summary',
        'Body as content',
        'Genre as genre'
    ];

    if (in_array('ImagePath', $columns)) {
        $selectFields[] = 'ImagePath as imagePath';
    } else {
        $selectFields[] = 'NULL as imagePath';
    }

    if (in_array('CreatedAt', $columns)) {
        $selectFields[] = 'CreatedAt as createdAt';
    } else {
        $selectFields[] = 'NOW() as createdAt';
    }

    $query = "SELECT " . implode(', ', $selectFields) . " FROM blog ORDER BY BlogID DESC";

    // Get user's blogs
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $blogs = $stmt->fetchAll();

    // Convert image paths to URLs and ensure all required fields exist
    foreach ($blogs as &$blog) {
        // Handle image URL
        if (!empty($blog['imagePath'])) {
            $blog['imageUrl'] = 'http://localhost/Hirlytics-final/src/api/uploads/' . basename($blog['imagePath']);
        } else {
            $blog['imageUrl'] = null;
        }
        unset($blog['imagePath']);

        // Ensure all required fields have at least empty values
        $blog['summary'] = $blog['summary'] ?? '';
        $blog['content'] = $blog['content'] ?? '';
        $blog['genre'] = $blog['genre'] ?? 'General';
        $blog['createdAt'] = $blog['createdAt'] ?? date('Y-m-d H:i:s');
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => $blogs,
        'count' => count($blogs),
        'timestamp' => date('c')
    ]);
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("General Error: " . $e->getMessage());
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
