<?php
// Allow requests from your Vite frontend
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === 'http://localhost:5173') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight 'OPTIONS' request
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once 'db_connect.php';

// Check if ID parameter is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Event ID is required'
    ]);
    exit;
}

$id = intval($_GET['id']);

try {
    // Check if connection is established
    if ($conn === null) {
        throw new Exception("Database connection failed");
    }

    // Prepare SQL statement to fetch event details
    $stmt = $conn->prepare("
        SELECT 
            id, 
            title, 
            description, 
            start, 
            end, 
            host, 
            meetingLink, 
            type, 
            imageUrl
        FROM events 
        WHERE id = :id
    ");

    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $event = $stmt->fetch(PDO::FETCH_ASSOC);

        // Format the response
        echo json_encode([
            'status' => 'success',
            'data' => $event
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Event not found'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
