<?php
// create_event.php

// ==================== CONFIGURATION ====================
ini_set('display_errors', 1); // Enable for debugging
error_reporting(E_ALL);
header('Content-Type: application/json');

// ==================== CORS HEADERS ====================
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Vary: Origin");
header("Content-Type: application/json");

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// ==================== DATABASE CONFIG ====================
$config = [
    'host' => 'localhost',
    'dbname' => 'hirlytics',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4'
];

// ==================== INPUT VALIDATION ====================
$requiredFields = [
    'eventTitle' => ['type' => 'string', 'max' => 255],
    'eventDescription' => ['type' => 'string', 'max' => 65535],
    'startDate' => ['type' => 'date'],
    'startTime' => ['type' => 'time'],
    'endDate' => ['type' => 'date'],
    'endTime' => ['type' => 'time']
];

$optionalFields = [
    'meetingLink' => ['type' => 'url', 'max' => 500],
    'hostName' => ['type' => 'string', 'max' => 255]
];

// ==================== MAIN EXECUTION ====================
try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST requests are allowed', 405);
    }

    // Get raw POST data
    $jsonInput = file_get_contents('php://input');
    
    if (empty($jsonInput)) {
        throw new Exception('No input data received', 400);
    }

    $data = json_decode($jsonInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data: ' . json_last_error_msg(), 400);
    }

    // Validate required fields
    $errors = [];
    foreach ($requiredFields as $field => $rules) {
        if (!isset($data[$field])) {
            $errors[] = "Field '$field' is required";
            continue;
        }

        // Empty check for required fields
        if ($data[$field] === '') {
            $errors[] = "Field '$field' cannot be empty";
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
                if (!DateTime::createFromFormat('H:i:s', $data[$field])) {
                    $errors[] = "Field '$field' must be a valid time (HH:MM:SS)";
                }
                break;
            case 'url':
                if (!empty($data[$field]) && !filter_var($data[$field], FILTER_VALIDATE_URL)) {
                    $errors[] = "Field '$field' must be a valid URL";
                }
                break;
        }

        // Length validation
        if (isset($rules['max']) && strlen($data[$field]) > $rules['max']) {
            $errors[] = "Field '$field' exceeds maximum length of {$rules['max']} characters";
        }
    }

    // Validate optional fields
    foreach ($optionalFields as $field => $rules) {
        if (!isset($data[$field]) || $data[$field] === '') {
            $data[$field] = null;
            continue;
        }

        // Type validation
        switch ($rules['type']) {
            case 'string':
                if (!is_string($data[$field])) {
                    $errors[] = "Field '$field' must be a string";
                }
                break;
            case 'url':
                if (!empty($data[$field]) && !filter_var($data[$field], FILTER_VALIDATE_URL)) {
                    $errors[] = "Field '$field' must be a valid URL";
                }
                break;
        }

        // Length validation
        if (isset($rules['max']) && strlen($data[$field]) > $rules['max']) {
            $errors[] = "Field '$field' exceeds maximum length of {$rules['max']} characters";
        }
    }

    if (!empty($errors)) {
        throw new Exception(implode(', ', $errors), 400);
    }

    // Validate date/time logic
    $startDateTime = new DateTime($data['startDate'] . ' ' . $data['startTime']);
    $endDateTime = new DateTime($data['endDate'] . ' ' . $data['endTime']);

    if ($endDateTime <= $startDateTime) {
        throw new Exception('End date/time must be after start date/time', 400);
    }

    // ==================== DATABASE OPERATION ====================
    $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $pdo = new PDO($dsn, $config['username'], $config['password'], $options);

    $stmt = $pdo->prepare("
        INSERT INTO Events 
        (Title, Description, StartDate, StartTime, EndDate, EndTime, MeetingLink, HostedBy) 
        VALUES (:title, :description, :startDate, :startTime, :endDate, :endTime, :meetingLink, :hostedBy)
    ");

    $stmt->execute([
        ':title' => $data['eventTitle'],
        ':description' => $data['eventDescription'],
        ':startDate' => $data['startDate'],
        ':startTime' => $data['startTime'],
        ':endDate' => $data['endDate'],
        ':endTime' => $data['endTime'],
        ':meetingLink' => $data['meetingLink'] ?? null,
        ':hostedBy' => $data['hostName'] ?? null
    ]);

    $eventId = $pdo->lastInsertId();

    // ==================== SUCCESS RESPONSE ====================
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Event created successfully',
        'eventId' => $eventId
    ]);

} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 400;
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}