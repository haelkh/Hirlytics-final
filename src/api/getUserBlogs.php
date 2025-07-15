<?php

declare(strict_types=1);
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
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

    // Select fields based on the actual database structure
    $selectFields = [
        'BlogID',
        'BlogPublisherID',
        'Title',
        'Body',
        'Genre',
        'BriefBody',
        'ImagePath'
    ];

    $query = "SELECT " . implode(', ', $selectFields) . " FROM blog ORDER BY BlogID DESC";

    // Get user's blogs
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $blogs = $stmt->fetchAll();

    // Process blog data
    foreach ($blogs as &$blog) {
        // Handle image URL
        if (!empty($blog['ImagePath'])) {
            $blog['ImageUrl'] = 'http://localhost/Hirlytics-final/src/api/uploads/' . basename($blog['ImagePath']);
        } else {
            $blog['ImageUrl'] = null;
        }

        // Ensure all fields have at least empty values
        $blog['BriefBody'] = $blog['BriefBody'] ?? '';
        $blog['Body'] = $blog['Body'] ?? '';
        $blog['Genre'] = $blog['Genre'] ?? 'General';
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
