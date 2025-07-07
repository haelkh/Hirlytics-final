<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

include 'db_connect.php';

// Check if connection was successful
if ($conn === null) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit();
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input."]);
    exit();
}

// Extract data from the frontend JobPostingData
$jobTitle = $data['jobTitle'] ?? '';
$jobType = $data['jobType'] ?? '';
$jobDescription = $data['jobDescription'] ?? '';
$jobCity = $data['jobCity'] ?? '';
$jobState = $data['jobState'] ?? '';
$jobCountry = $data['jobCountry'] ?? '';
$jobAddress = $data['jobAddress'] ?? '';
$fullyRemote = $data['fullyRemote'] ?? false;

$countryId = null;
if (!empty($jobCountry)) {
    $stmtCountry = $conn->prepare("SELECT CountryID FROM country WHERE CountryName = ?");
    if ($stmtCountry) {
        $stmtCountry->bindParam(1, $jobCountry);
        $stmtCountry->execute();
        $rowCountry = $stmtCountry->fetch(PDO::FETCH_ASSOC);
        if ($rowCountry) {
            $countryId = $rowCountry['CountryID'];
        }
    }
}

// Combine job location details into a comprehensive description if needed
$fullJobDescription = $jobDescription;
if ($jobCity || $jobState || $jobCountry || $jobAddress) {
    $locationDetails = [];
    if ($jobAddress) $locationDetails[] = $jobAddress;
    if ($jobCity) $locationDetails[] = $jobCity;
    if ($jobState) $locationDetails[] = $jobState;
    if ($jobCountry) $locationDetails[] = $jobCountry;

    $locationString = implode(", ", $locationDetails);

    if ($fullyRemote) {
        $fullJobDescription .= "\n\nLocation: Fully Remote.";
    } else {
        $fullJobDescription .= "\n\nLocation: " . $locationString . ".";
    }
} else if ($fullyRemote) {
    $fullJobDescription .= "\n\nLocation: Fully Remote.";
}

// Default values for job_board table
$image = ''; // No image from frontend yet
$status = 'active';
$datePosted = date('Y-m-d'); // Current date
$expiryDate = date('Y-m-d', strtotime('+3 months')); // 3 months from now

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO job_board (image, JobTitle, JobType, expiry_date, status, description, date_posted, country_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
if ($stmt) {
    $stmt->bindParam(1, $image);
    $stmt->bindParam(2, $jobTitle);
    $stmt->bindParam(3, $jobType);
    $stmt->bindParam(4, $expiryDate);
    $stmt->bindParam(5, $status);
    $stmt->bindParam(6, $fullJobDescription);
    $stmt->bindParam(7, $datePosted);
    $stmt->bindParam(8, $countryId, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Job posted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to post job: " . $stmt->errorInfo()[2]]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Failed to prepare statement."]);
}

// PDO statements don't have a close method like mysqli. They are closed when the statement object is unset or when the script ends.
// $stmt->close();
$conn = null; // Close the connection by setting it to null
