<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hirlytics";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Connection failed: " . $conn->connect_error
    ]);
    exit;
}

$sql = "SELECT Id, TeamMemberName, Description FROM team";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Query error: " . $conn->error
    ]);
    exit;
}

$teamMembers = [];

while ($row = $result->fetch_assoc()) {
    $teamMembers[] = [
        "Id" => $row["Id"],
        "TeamMemberName" => $row["TeamMemberName"],
        "Description" => $row["Description"]
    ];
}

echo json_encode([
    "status" => "success",
    "total_members" => count($teamMembers),
    "team_members" => $teamMembers
]);

$conn->close();
