<?php
// Set headers for JSON API response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Include database connection
require_once 'db_connect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST requests are allowed']);
    exit;
}

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if required fields are present
if (!isset($data['application_id']) || !isset($data['status'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Application ID and status are required']);
    exit;
}

// Validate status value
$validStatuses = ['Submitted', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];
if (!in_array($data['status'], $validStatuses)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Invalid status value']);
    exit;
}

// Check if database connection is established
if (!isset($conn) || $conn === null) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

try {
    // Prepare and execute the update query
    $stmt = $conn->prepare("UPDATE job_application SET status = :status WHERE application_id = :application_id");
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':application_id', $data['application_id']);
    $stmt->execute();

    // Check if any rows were affected
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Application status updated successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'No application found with the given ID'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
