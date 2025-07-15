<?php

declare(strict_types=1);
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
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
$uploadDir = __DIR__ . '/uploads/';

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
        throw new Exception("Only POST or PUT requests are allowed", 405);
    }

    // Check if content is multipart/form-data
    if (empty($_POST) && empty($_FILES)) {
        throw new Exception("Request must be multipart/form-data", 400);
    }

    // Validate required fields
    $required = ['blog_id', 'title', 'body', 'genre'];
    foreach ($required as $field) {
        if (!isset($_POST[$field])) {
            throw new Exception("Missing required field: $field", 400);
        }
        if (empty(trim($_POST[$field]))) {
            throw new Exception("Field $field cannot be empty", 400);
        }
    }

    $blogId = filter_var($_POST['blog_id'], FILTER_VALIDATE_INT);
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

    // Check if blog exists
    $checkStmt = $pdo->prepare("SELECT BlogID, ImagePath FROM blog WHERE BlogID = ?");
    $checkStmt->execute([$blogId]);
    $blog = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$blog) {
        throw new Exception("Blog not found", 404);
    }

    // Handle file upload
    $imagePath = null;
    $oldImagePath = $blog['ImagePath'] ?? null;
    $updateImage = false;

    if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
        $updateImage = true;
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

        $imagePath = '/uploads/' . $filename;

        // Delete old image if exists
        if ($oldImagePath && file_exists(__DIR__ . $oldImagePath)) {
            unlink(__DIR__ . $oldImagePath);
        }
    }

    // Generate brief body (first 100 chars)
    $briefBody = mb_substr(strip_tags($_POST['body']), 0, 100);

    // Update blog
    $sql = "UPDATE blog SET 
            Title = ?, 
            Body = ?, 
            Genre = ?, 
            BriefBody = ?";

    $params = [
        trim($_POST['title']),
        trim($_POST['body']),
        trim($_POST['genre']),
        $briefBody
    ];

    // Add image path to update if provided
    if ($updateImage) {
        $sql .= ", ImagePath = ?";
        $params[] = $imagePath;
    }

    $sql .= " WHERE BlogID = ?";
    $params[] = $blogId;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    if ($stmt->rowCount() === 0) {
        // No rows affected could mean no changes were made
        // Not necessarily an error
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Blog updated successfully',
        'blogId' => $blogId,
        'imageUrl' => $updateImage ? ('http://localhost:5173' . $imagePath) : null,
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
