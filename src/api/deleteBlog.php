<?php

declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '1');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("X-Content-Type-Options: nosniff");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Database configuration
const DB_HOST = 'localhost';
const DB_NAME = 'hirlytics';
const DB_USER = 'root';
const DB_PASS = '';

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        throw new Exception("Only DELETE requests are allowed", 405);
    }

    // Get blog ID from URL parameter
    if (!isset($_GET['id'])) {
        throw new Exception("Blog ID is required", 400);
    }

    $blogId = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    if (!$blogId || $blogId <= 0) {
        throw new Exception("Invalid Blog ID", 400);
    }

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

    // First, get the image path if exists
    $stmt = $pdo->prepare("SELECT ImagePath FROM blog WHERE BlogID = ?");
    $stmt->execute([$blogId]);
    $blog = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$blog) {
        throw new Exception("Blog not found", 404);
    }

    // Delete the blog
    $stmt = $pdo->prepare("DELETE FROM blog WHERE BlogID = ?");
    $stmt->execute([$blogId]);

    if ($stmt->rowCount() === 0) {
        throw new Exception("Failed to delete blog", 500);
    }

    // Delete the image file if it exists
    if (!empty($blog['ImagePath'])) {
        $imagePath = __DIR__ . $blog['ImagePath'];
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Blog deleted successfully',
        'blogId' => $blogId,
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
    $code = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 400;
    http_response_code($code);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
