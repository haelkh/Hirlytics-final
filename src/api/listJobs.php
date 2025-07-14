<?php
// Enable error display for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Function to return JSON error response
function sendJsonError($message, $code = 500)
{
    http_response_code($code);
    echo json_encode([
        "status" => "error",
        "message" => $message
    ]);
    exit;
}

// Set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hirlytics";

// Create connection
try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        sendJsonError("Database connection failed: " . $conn->connect_error);
    }
} catch (Exception $e) {
    sendJsonError("Database connection failed");
}

// SQL with JOIN
$sql = "SELECT 
            jb.ID as job_id,
            jb.JobTitle,
            jb.JobType,
            jb.expiry_date,
            jb.status,
            jb.description,
            jb.date_posted,
            jb.country_id,
            jb.skills,
            jb.responsibility,
            jb.qualification,
            jb.experience,
            c.companyImage AS company_image,
            co.countryName AS country_name
        FROM 
            job_board jb
        JOIN 
            company c ON jb.company_id = c.CompanyID
        JOIN
            country co ON jb.country_id = co.CountryID";

// Optional sorting
if (isset($_GET['sort'])) {
    switch ($_GET['sort']) {
        case 'latest':
            $sql .= " ORDER BY jb.date_posted DESC";
            break;
        case 'oldest':
            $sql .= " ORDER BY jb.date_posted ASC";
            break;
        case 'title':
            $sql .= " ORDER BY jb.JobTitle ASC";
            break;
    }
}

try {
    $result = $conn->query($sql);

    if (!$result) {
        sendJsonError("Query failed: " . $conn->error);
    }

    $jobs = [];
    while ($row = $result->fetch_assoc()) {
        $jobs[] = [
            "job_id" => $row["job_id"],
            "job_title" => $row["JobTitle"],
            "job_type" => $row["JobType"],
            "expiry_date" => $row["expiry_date"],
            "status" => $row["status"],
            "description" => $row["description"],
            "date_posted" => $row["date_posted"],
            "country_id" => $row["country_id"],
            "company_image" => $row["company_image"],
            "country_name" => $row["country_name"],
            "skills" => $row["skills"],
            "responsibility" => $row["responsibility"],
            "qualification" => $row["qualification"],
            "experience" => $row["experience"]
        ];
    }

    echo json_encode([
        "status" => "success",
        "total_jobs" => count($jobs),
        "jobs" => $jobs
    ]);
} catch (Exception $e) {
    sendJsonError("An error occurred while fetching jobs");
} finally {
    $conn->close();
}
