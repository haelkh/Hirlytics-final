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
        ja.ApplicationId,
        ja.status,
        ja.ApplicationDate as ApplicationDate,
        jb.ID as job_id,
        jb.JobTitle as job_title,
        jb.JobType as job_type,
        jb.image as company_image,
        jb.description as job_description,
        jb.expiry_date,
        IFNULL(u.Full_Name, '') as applicant_name,
        IFNULL(u.Email_Address, '') as applicant_email,
        IFNULL(u.phone_number, '') as applicant_phone,
        js.JOBSeekerID as seeker_id,
        IFNULL(js.CurrentEmploymentStatus, '') as CurrentEmploymentStatus,
        IFNULL(js.SeekingPosition, '') as SeekingPosition,
        IFNULL(js.InterestedIndustries, '') as InterestedIndustries,
        IFNULL(js.DesiredJobLocation, '') as DesiredJobLocation,
        IFNULL(js.WorkLocationPreference, '') as WorkLocationPreference,
        IFNULL(js.YearsExperience, '') as YearsExperience,
        IFNULL(js.Skills, '') as Skills,
        IFNULL(js.Relocation, 0) as Relocation,
        IFNULL(js.ExpectedSalary, '') as ExpectedSalary,
        IFNULL(js.AvailabilityToStart, '') as AvailabilityToStart,
        IFNULL(js.CVUpload, '') as CVUpload,
        IFNULL(js.Portfolio_Linkedin, '') as Portfolio_Linkedin
    FROM job_application ja
    LEFT JOIN job_board jb ON ja.JobID = jb.ID
    LEFT JOIN job_seeker js ON ja.JobSeekerID = js.JOBSeekerID
    LEFT JOIN users u ON js.user_id = u.ID
    WHERE ja.ApplicationId = :application_id");

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
