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

// SQL to match table structure
$sql = "SELECT 
            ID,
            image,
            JobTitle,
            JobType,
            expiry_date,
            status,
            description,
            date_posted,
            country_id
        FROM 
            job_board";

// Optional sorting
if (isset($_GET['sort'])) {
    switch ($_GET['sort']) {
        case 'latest':
            $sql .= " ORDER BY date_posted DESC";
            break;
        case 'oldest':
            $sql .= " ORDER BY date_posted ASC";
            break;
        case 'title':
            $sql .= " ORDER BY JobTitle ASC";
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
            "ID" => $row["ID"],
            "image" => $row["image"],
            "JobTitle" => $row["JobTitle"],
            "JobType" => $row["JobType"],
            "expiry_date" => $row["expiry_date"],
            "status" => $row["status"],
            "description" => $row["description"],
            "date_posted" => $row["date_posted"],
            "country_id" => $row["country_id"]
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
