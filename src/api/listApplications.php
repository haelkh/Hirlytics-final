<?php
// Set headers for JSON API response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Include database connection
require_once 'db_connect.php';

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only GET requests are allowed']);
    exit;
}

// Check if database connection is established
if (!isset($conn) || $conn === null) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

try {
    // Get all applications with related information
    $stmt = $conn->query("SELECT 
        ja.application_id,
        ja.status,
        ja.created_at as ApplicationDate,
        jb.job_title,
        jb.job_type,
        jb.company_name,
        jb.image,
        u.name as applicant_name,
        u.email as applicant_email,
        js.SeekingPosition,
        js.YearsExperience,
        js.Skills
    FROM job_application ja
    LEFT JOIN job_board jb ON ja.job_id = jb.job_id
    LEFT JOIN job_seeker js ON ja.seeker_id = js.seeker_id
    LEFT JOIN users u ON js.user_id = u.user_id
    ORDER BY ja.created_at DESC");

    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return success response with data
    echo json_encode([
        'status' => 'success',
        'total_applications' => count($applications),
        'applications' => $applications
    ]);
} catch (PDOException $e) {
    // Return error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
