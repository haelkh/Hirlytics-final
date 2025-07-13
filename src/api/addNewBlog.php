<?php

declare(strict_types=1);
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

// File upload configuration
const MAX_FILE_SIZE = 5242880; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
$uploadDir = __DIR__ . '/uploads/'; // Changed to just 'uploads' without 'blogs'

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Only POST requests are allowed", 405);
    }

    // Check if content is multipart/form-data
    if (empty($_POST) && empty($_FILES)) {
        throw new Exception("Request must be multipart/form-data", 400);
    }

    // Validate required fields
    $required = ['user_id', 'title', 'body', 'genre'];
    foreach ($required as $field) {
        if (!isset($_POST[$field])) {
            throw new Exception("Missing required field: $field", 400);
        }
        if (empty(trim($_POST[$field]))) {
            throw new Exception("Field $field cannot be empty", 400);
        }
    }

    $userId = filter_var($_POST['user_id'], FILTER_VALIDATE_INT);
    if (!$userId || $userId <= 0) {
        throw new Exception("Invalid User ID", 400);
    }

    // Handle file upload
    $imagePath = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
        $file = $_FILES['image'];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("File upload error: " . $file['error'], 400);
        }

        if ($file['size'] > MAX_FILE_SIZE) {
            throw new Exception("File size exceeds 5MB limit", 400);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);
        if (!in_array($mime, ALLOWED_TYPES)) {
            throw new Exception("Only JPG, PNG, and GIF images are allowed", 400);
        }

        // Create upload directory if needed
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                throw new Exception("Failed to create upload directory", 500);
            }
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'blog_' . uniqid() . '.' . $extension;
        $destination = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception("Failed to save uploaded file", 500);
        }

        $imagePath = '/uploads/' . $filename; // Changed path structure
    }

    // Generate brief body (first 100 chars)
    $briefBody = mb_substr(strip_tags($_POST['body']), 0, 100);

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
            BriefBody,
            ImagePath
        ) VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $userId,
        trim($_POST['title']),
        trim($_POST['body']),
        trim($_POST['genre']),
        $briefBody,
        $imagePath
    ]);

    $newBlogId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Blog created successfully',
        'blogId' => (int)$newBlogId,
        'imageUrl' => $imagePath ? 'http://localhost:5173' . $imagePath : null,
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
