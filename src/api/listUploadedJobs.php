<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hirlytics";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error",
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

// SQL query to get jobs from latest to oldest with country names
$sql = "SELECT 
            j.ID as job_id,
            j.JobTitle,
            j.JobType,
            j.expiry_date,
            j.status,
            j.description,
            j.date_posted,
            j.country_id,
            c.CountryName
        FROM 
            job_board j
        LEFT JOIN
            country c ON j.country_id = c.CountryID
        ORDER BY 
            j.date_posted DESC";

$result = $conn->query($sql);

$jobs = [];

if ($result->num_rows > 0) {
    // Output data of each row
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
            "CountryName" => $row["CountryName"] ?? "Unknown"
        ];
    }
}

// Return the result as JSON
echo json_encode([
    "status" => "success",
    "total_jobs" => count($jobs),
    "jobs" => $jobs
]);

$conn->close();
