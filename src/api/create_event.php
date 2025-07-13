<?php

declare(strict_types=1);
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

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
const MAX_FILE_SIZE = 5242880; // 5MB in bytes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
$uploadDir = __DIR__ . '/uploads/';

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST requests are allowed', 405);
    }

    // Check if content type is multipart/form-data
    if (strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') === false) {
        throw new Exception('Content-Type must be multipart/form-data', 400);
    }

    // Get form data
    $data = $_POST;
    $file = $_FILES['image'] ?? null;

    // Required fields validation
    $requiredFields = [
        'eventTitle' => ['type' => 'string', 'max' => 255],
        'eventDescription' => ['type' => 'string', 'max' => 65535],
        'startDate' => ['type' => 'date'],
        'startTime' => ['type' => 'time'],
        'endDate' => ['type' => 'date'],
        'endTime' => ['type' => 'time']
    ];

    $errors = [];
    foreach ($requiredFields as $field => $rules) {
        if (!isset($data[$field]) || $data[$field] === '') {
            $errors[] = "Field '$field' is required";
            continue;
        }

        // Type validation
        switch ($rules['type']) {
            case 'string':
                if (!is_string($data[$field])) {
                    $errors[] = "Field '$field' must be a string";
                }
                break;
            case 'date':
                if (!DateTime::createFromFormat('Y-m-d', $data[$field])) {
                    $errors[] = "Field '$field' must be a valid date (YYYY-MM-DD)";
                }
                break;
            case 'time':
                if (!DateTime::createFromFormat('H:i', $data[$field])) {
                    $errors[] = "Field '$field' must be a valid time (HH:MM)";
                }
                break;
        }

        // Length validation
        if (isset($rules['max']) && strlen($data[$field]) > $rules['max']) {
            $errors[] = "Field '$field' exceeds maximum length of {$rules['max']} characters";
        }
    }

    // Handle file upload
    $imagePath = null;
    if ($file && $file['error'] !== UPLOAD_ERR_NO_FILE) {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("File upload error: {$file['error']}", 400);
        }

        if ($file['size'] > MAX_FILE_SIZE) {
            throw new Exception('File size exceeds 5MB limit', 400);
        }

        $fileInfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $fileInfo->file($file['tmp_name']);
        if (!in_array($mimeType, ALLOWED_TYPES)) {
            throw new Exception('Only JPG, PNG, and GIF images are allowed', 400);
        }

        // Create upload directory if needed
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                throw new Exception('Failed to create upload directory', 500);
            }
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('event_', true) . '.' . $extension;
        $destination = $uploadDir . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception('Failed to save uploaded file', 500);
        }

        $imagePath = $filename;
    }

    // Validate date/time
    $startDateTime = new DateTime($data['startDate'] . ' ' . $data['startTime']);
    $endDateTime = new DateTime($data['endDate'] . ' ' . $data['endTime']);
    if ($endDateTime <= $startDateTime) {
        throw new Exception('End date/time must be after start date/time', 400);
    }

    // Check for any validation errors
    if (!empty($errors)) {
        throw new Exception(implode(', ', $errors), 400);
    }

    // Database connection
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    // Insert event into database
    $stmt = $pdo->prepare(
        "INSERT INTO Events 
        (Title, Description, StartDate, StartTime, EndDate, EndTime, MeetingLink, HostedBy, ImagePath) 
        VALUES (:title, :description, :startDate, :startTime, :endDate, :endTime, :meetingLink, :hostedBy, :imagePath)"
    );

    $stmt->execute([
        ':title' => $data['eventTitle'],
        ':description' => $data['eventDescription'],
        ':startDate' => $data['startDate'],
        ':startTime' => $data['startTime'] . ':00',
        ':endDate' => $data['endDate'],
        ':endTime' => $data['endTime'] . ':00',
        ':meetingLink' => $data['meetingLink'] ?? null,
        ':hostedBy' => $data['hostName'] ?? null,
        ':imagePath' => $imagePath
    ]);

    // Success response
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Event created successfully',
        'eventId' => $pdo->lastInsertId(),
        'imageUrl' => $imagePath ? 'http://localhost/Hirlytics-final/src/api/uploads/' . $imagePath : null
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    $code = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 400;
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
