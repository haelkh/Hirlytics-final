<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hirlytics";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and OPTIONS
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle OPTIONS request for preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        "status" => "error",
        "message" => "Only POST method is allowed."
    ]);
    exit;
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['TeamMemberName'])) {
    http_response_code(400); // Bad Request
    echo json_encode([
        "status" => "error",
        "message" => "TeamMemberName is required."
    ]);
    exit;
}

$teamMemberName = $data['TeamMemberName'];
// Description is optional, provide a default if not set
$description = isset($data['Description']) ? $data['Description'] : null;

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Connection failed: " . $conn->connect_error
    ]);
    exit;
}

// Prepared statement to prevent SQL injection
$stmt = $conn->prepare("INSERT INTO team (TeamMemberName, Description) VALUES (?, ?)");

if (false === $stmt) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Prepare statement failed: " . $conn->error
    ]);
    $conn->close();
    exit;
}

$stmt->bind_param("ss", $teamMemberName, $description);

if ($stmt->execute()) {
    $newMemberId = $stmt->insert_id;
    http_response_code(201); // Created
    echo json_encode([
        "status" => "success",
        "message" => "Team member added successfully.",
        "member_id" => $newMemberId
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to add team member: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
