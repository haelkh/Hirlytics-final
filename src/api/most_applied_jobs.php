<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hirlytics";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Set header to JSON
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// SQL query to count applications per job and sort from most to least applied
$sql = "SELECT 
            jb.ID as JobID,
            jb.JobTitle,
            jb.JobType,
            jb.date_posted,
            COUNT(ja.ApplicationId) as ApplicationCount
        FROM 
            job_board jb
        LEFT JOIN 
            job_application ja ON jb.ID = ja.JobID
        GROUP BY 
            jb.ID
        ORDER BY 
            ApplicationCount DESC";

$result = $conn->query($sql);

$jobs = [];

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        $jobs[] = [
            "job_id" => $row["JobID"],
            "job_title" => $row["JobTitle"],
            "job_type" => $row["JobType"],
            "date_posted" => $row["date_posted"],
            "application_count" => $row["ApplicationCount"]
        ];
    }
}

// Return the result as JSON
echo json_encode(["jobs" => $jobs]);

$conn->close();
