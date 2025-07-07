<?php
require_once __DIR__ . '/db_connect.php';

// Ensure the DB connection is established
if ($conn === null) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit;
}

try {
    // === READ INPUT (BOTH JSON AND FORM) ===
    $inputData = file_get_contents("php://input");
    $isJson = false;

    // Try to decode as JSON
    if (!empty($inputData)) {
        $jsonData = json_decode($inputData, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $fullName = trim($jsonData['fullName'] ?? '');
            $email = trim($jsonData['email'] ?? '');
            $password = $jsonData['password'] ?? '';
            $role = $jsonData['role'] ?? 'user'; // Default to 'user' if not specified
            $isJson = true;
        }
    }

    // If not JSON, check for form data
    if (!$isJson) {
        $fullName = trim($_POST['fullName'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $role = $_POST['role'] ?? 'user'; // Default to 'user' if not specified
    }

    if (empty($fullName) || empty($email) || empty($password)) {
        throw new Exception("Missing required fields.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format.");
    }

    // === CHECK DUPLICATE EMAIL === (case-insensitive)
    $stmt = $conn->prepare("SELECT id FROM users WHERE LOWER(email_address) = LOWER(:email)");
    $stmt->execute(['email' => $email]);

    if ($stmt->rowCount() > 0) {
        throw new Exception("Email already registered.");
    }

    // === HASH PASSWORD ===
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // === INSERT USER ===
    $stmt = $conn->prepare("
        INSERT INTO users (Full_name, Email_address, password, role, date_registered) 
        VALUES (:fullName, :email, :password, :role, NOW())
    ");
    $stmt->execute([
        'fullName' => $fullName,
        'email' => $email,
        'password' => $hashedPassword,
        'role' => $role
    ]);

    $userId = $conn->lastInsertId();

    // Start session to store session variables (same as in signin.php)
    session_start();

    // Set session variables
    $_SESSION['user_id'] = $userId;
    $_SESSION['full_name'] = $fullName;
    $_SESSION['email'] = $email;
    $_SESSION['role'] = $role;

    // === RETURN SUCCESS WITH USER INFO ===
    echo json_encode([
        "status" => "success",
        "message" => "User registered successfully",
        "user" => [
            "id" => $userId,
            "full_name" => $fullName,
            "email" => $email,
            "role" => $role
        ]
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
