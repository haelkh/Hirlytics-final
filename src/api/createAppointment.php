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

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST requests are allowed', 405);
    }

    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Validate JSON input
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON input: ' . json_last_error_msg(), 400);
    }

    // Required fields validation
    $requiredFields = [
        'User_ID' => 'integer',
        'Appointment_DateTime' => 'datetime',
        'Appointment_Type' => 'string',
        'Appointment_Status' => 'string'
    ];

    $errors = [];
    foreach ($requiredFields as $field => $type) {
        if (!isset($data[$field]) || $data[$field] === '') {
            $errors[] = "Field '$field' is required";
            continue;
        }

        // Type validation
        switch ($type) {
            case 'integer':
                if (!is_int($data[$field])) {
                    $errors[] = "Field '$field' must be an integer";
                }
                break;
            case 'datetime':
                // Log the received datetime string for debugging
                error_log("Received Appointment_DateTime: " . $data[$field]);
                if (!DateTime::createFromFormat('Y-m-d H:i:s', $data[$field])) {
                    $errors[] = "Field '$field' must be a valid datetime (YYYY-MM-DD HH:MM:SS)";
                }
                break;
            case 'string':
                if (!is_string($data[$field])) {
                    $errors[] = "Field '$field' must be a string";
                }
                break;
        }
    }

    // Optional field: Notes
    $notes = $data['Notes'] ?? null;
    if ($notes !== null && !is_string($notes)) {
        $errors[] = "Field 'Notes' must be a string or null";
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

    // Insert appointment into database
    $stmt = $pdo->prepare(
        "INSERT INTO appointments 
        (User_ID, Appointment_DateTime, Appointment_Type, Appointment_Status, Notes) 
        VALUES (:User_ID, :Appointment_DateTime, :Appointment_Type, :Appointment_Status, :Notes)"
    );

    $stmt->execute([
        ':User_ID' => $data['User_ID'],
        ':Appointment_DateTime' => $data['Appointment_DateTime'],
        ':Appointment_Type' => $data['Appointment_Type'],
        ':Appointment_Status' => $data['Appointment_Status'],
        ':Notes' => $notes
    ]);

    // Success response
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Appointment created successfully',
        'appointmentId' => $pdo->lastInsertId()
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
