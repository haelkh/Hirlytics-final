<?php
// Set headers for JSON API response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
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
        ja.ApplicationId as application_id,
        ja.status,
        ja.ApplicationDate as ApplicationDate,
        jb.jobTitle,
        jb.jobType,
        jb.image,
        u.Full_Name as applicant_name,
        u.Email_Address as applicant_email,
        js.SeekingPosition,
        js.YearsExperience,
        js.Skills,
        jb.expiry_date
    FROM job_application ja
    LEFT JOIN job_board jb ON ja.JobId = jb.ID
    LEFT JOIN job_seeker js ON ja.JobSeekerID = js.JOBSeekerID
    LEFT JOIN users u ON js.user_id = u.ID
    WHERE jb.expiry_date >= CURDATE()
    ORDER BY ja.ApplicationDate DESC");

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
    // Temporarily output the exact database error for debugging
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
    // die("Database error: " . $e->getMessage()); // Also consider using die for direct output
}
