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
    echo json_encode(['status' => 'error', 'message' => 'Only GET requests are allowed']);
    exit;
}

// Check if application_id is provided
if (!isset($_GET['application_id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Application ID is required']);
    exit;
}

$applicationId = intval($_GET['application_id']);

// Check if database connection is established
if (!isset($conn) || $conn === null) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

try {
    // Get detailed application information
    $stmt = $conn->prepare("SELECT 
        ja.application_id,
        ja.status,
        ja.created_at as ApplicationDate,
        jb.job_id,
        jb.job_title,
        jb.job_type,
        jb.company_name,
        jb.image as company_image,
        jb.description as job_description,
        jb.salary_range,
        jb.expiry_date,
        u.name as applicant_name,
        u.email as applicant_email,
        u.phone as applicant_phone,
        js.seeker_id,
        js.CurrentEmploymentStatus,
        js.SeekingPosition,
        js.InterestedIndustries,
        js.DesiredJobLocation,
        js.WorkLocationPreference,
        js.YearsExperience,
        js.Skills,
        js.Relocation,
        js.ExpectedSalary,
        js.AvailabilityToStart,
        js.CVUpload,
        js.Portfolio_Linkedin
    FROM job_application ja
    LEFT JOIN job_board jb ON ja.job_id = jb.job_id
    LEFT JOIN job_seeker js ON ja.seeker_id = js.seeker_id
    LEFT JOIN users u ON js.user_id = u.user_id
    WHERE ja.application_id = :application_id");

    $stmt->bindParam(':application_id', $applicationId);
    $stmt->execute();

    $application = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$application) {
        http_response_code(404); // Not Found
        echo json_encode(['status' => 'error', 'message' => 'Application not found']);
        exit;
    }

    // Return success response with data
    echo json_encode([
        'status' => 'success',
        'application' => $application
    ]);
} catch (PDOException $e) {
    // Return error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
