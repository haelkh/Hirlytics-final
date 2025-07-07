<?php
// === HEADERS ===
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Create upload directory if it doesn't exist
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $employmentStatus = $_POST['employmentStatus'] ?? '';
    $positionType = $_POST['positionType'] ?? '';
    $industries = $_POST['industries'] ?? '';
    $jobLocation = $_POST['jobLocation'] ?? '';
    $workLocationPreference = $_POST['workLocationPreference'] ?? '';
    $experience = $_POST['experience'] ?? '';
    $skills = $_POST['skills'] ?? '';
    $relocation = $_POST['relocation'] ?? '';
    $salaryRange = $_POST['salaryRange'] ?? '';
    $availability = $_POST['availability'] ?? '';
    $portfolio = $_POST['portfolio'] ?? '';
    $additionalComments = $_POST['additionalComments'] ?? '';
    $consentToStore = isset($_POST['consentToStore']) && $_POST['consentToStore'] === 'true' ? 1 : 0;

    // For debugging
    error_log("Received job application from: " . $name . " (" . $email . ")");

    // Handle file upload
    $cvFilename = '';
    if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
        $cvFilename = time() . '_' . basename($_FILES['cv']['name']);
        $targetPath = $uploadDir . $cvFilename;

        if (move_uploaded_file($_FILES['cv']['tmp_name'], $targetPath)) {
            error_log("File uploaded successfully: " . $targetPath);
        } else {
            error_log("File upload failed: " . $_FILES['cv']['error']);
        }
    }

    // Database connection
    $host = 'localhost';
    $db   = 'hirlytics';
    $user = 'root';
    $pass = '';

    try {
        // Create connection
        $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Find or create user based on email
        $userStmt = $conn->prepare("SELECT ID FROM users WHERE Email_address = ?");
        $userStmt->execute([$email]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        $user_id = null;
        if ($user) {
            $user_id = $user['ID'];
        } else {
            // Create a new user
            $createUserStmt = $conn->prepare("INSERT INTO users (Full_Name, Email_address, phone_number, date_registered, role) VALUES (?, ?, ?, NOW(), 'user')");
            $createUserStmt->execute([$name, $email, $phone]);
            $user_id = $conn->lastInsertId();
        }

        // Convert relocation from "yes"/"no" to 1/0
        $relocationValue = 0;
        if (strtolower($relocation) === "yes") {
            $relocationValue = 1;
        }

        // Convert experience string to decimal (for YearsExperience)
        $experienceValue = 0;
        if ($experience === "0-2 years") {
            $experienceValue = 1.0;
        } else if ($experience === "3-5 years") {
            $experienceValue = 4.0;
        } else if ($experience === "6-10 years") {
            $experienceValue = 8.0;
        } else if ($experience === "10+ years") {
            $experienceValue = 10.0;
        }

        // Convert availability to date
        $availabilityDate = date('Y-m-d'); // Default to current date
        if ($availability === "1 month") {
            $availabilityDate = date('Y-m-d', strtotime('+1 month'));
        }

        // Insert job application
        $stmt = $conn->prepare("
            INSERT INTO job_seeker (
                CurrentEmploymentStatus,
                SeekingPosition,
                InterestedIndustries,
                DesiredJobLocation,
                WorkLocationPreference,
                YearsExperience,
                Skills,
                Relocation,
                ExpectedSalary,
                AvailabilityToStart,
                CVUpload,
                Portfolio_Linkedin,
                AdditionalQuestions,
                user_id,
                date_created
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
        ");

        $stmt->execute([
            $employmentStatus,
            $positionType,
            $industries,
            $jobLocation,
            $workLocationPreference,
            $experienceValue,
            $skills,
            $relocationValue,
            $salaryRange,
            $availabilityDate,
            $cvFilename,
            $portfolio,
            $additionalComments,
            $user_id
        ]);

        $seekerId = $conn->lastInsertId();

        // Create notification - note that the database structure doesn't have user_id in notification table
        $notificationMessage = "Your job application for the position of {$positionType} has been successfully submitted.";
        $notificationStmt = $conn->prepare("
            INSERT INTO notification (
                message,
                created_at
            ) VALUES (?, NOW())
        ");

        $notificationStmt->execute([
            $notificationMessage
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Application submitted successfully!",
            "user_id" => $user_id,
            "seeker_id" => $seekerId
        ]);
    } catch (PDOException $e) {
        error_log("Database Error: " . $e->getMessage());
        echo json_encode([
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
