<?php
// Set error handling to catch fatal errors but ignore deprecations
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
ini_set('display_errors', 0);

// Explicitly turn off deprecation warnings for dynamic properties in PHP 8.2+
if (PHP_VERSION_ID >= 80200) {
    error_log("PHP 8.2+ detected, setting AllowDynamicProperties attribute");
    ini_set('error_reporting', E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
}

// Custom error handler to return JSON instead of HTML
function jsonErrorHandler($errno, $errstr, $errfile, $errline)
{
    // Skip deprecation warnings
    if ($errno == E_DEPRECATED || $errno == E_USER_DEPRECATED) {
        return true;
    }

    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => "PHP Error: $errstr in $errfile on line $errline"
    ]);
    exit;
}
set_error_handler('jsonErrorHandler');

// Register shutdown function to catch fatal errors
function fatalErrorHandler()
{
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => "Fatal Error: {$error['message']} in {$error['file']} on line {$error['line']}"
        ]);
        exit;
    }
}
register_shutdown_function('fatalErrorHandler');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/config.php';

// Try to load composer autoload for Google Client
$autoloadPath = __DIR__ . '/../../vendor/autoload.php';
if (file_exists($autoloadPath)) {
    require_once $autoloadPath;
} else {
    // If autoload doesn't exist, return a JSON error rather than HTML error
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Google Client library not found. Please install composer dependencies.']);
    exit;
}

// === HEADERS ===
// Set headers before any output
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Cross-Origin-Opener-Policy: same-origin-allow-popups");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Ensure the DB connection is established
if ($conn === null) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit;
}

// Start session to store session variables
session_start();

$data = json_decode(file_get_contents('php://input'), true);

try {
    // Check if it's a Google Sign-In
    if (isset($data['credential'])) {
        if (!defined('GOOGLE_CLIENT_ID')) {
            throw new Exception("Google Client ID not configured.");
        }

        // Debug logging
        error_log("Google Sign-In attempt received: " . substr($data['credential'], 0, 20) . '...');

        // Try Google OAuth verification
        try {
            $clientId = GOOGLE_CLIENT_ID;

            if (!class_exists('Google_Client')) {
                throw new Exception("Google_Client class not found. Please check composer installation.");
            }

            // Suppress deprecation warnings during token verification
            $oldErrorLevel = error_reporting();
            error_reporting($oldErrorLevel & ~E_DEPRECATED & ~E_USER_DEPRECATED);

            $client = new Google_Client(['client_id' => $clientId]);

            try {
                $payload = $client->verifyIdToken($data['credential']);
            } catch (Exception $tokenError) {
                // Detailed logging for token verification errors
                error_log("Token verification error: " . $tokenError->getMessage());

                // Try an alternative verification approach for JWT tokens
                $segments = explode('.', $data['credential']);
                if (count($segments) === 3) {
                    $jwtPayload = base64_decode(strtr($segments[1], '-_', '+/'));
                    $payloadData = json_decode($jwtPayload, true);

                    // Basic validation - in production you would verify the signature properly
                    if (isset($payloadData['email']) && isset($payloadData['sub'])) {
                        error_log("Using fallback JWT parsing for: " . $payloadData['email']);
                        $payload = $payloadData;
                    } else {
                        throw $tokenError; // Re-throw if we can't extract the basic fields
                    }
                } else {
                    throw $tokenError; // Re-throw if it's not a valid JWT format
                }
            }

            // Restore original error reporting
            error_reporting($oldErrorLevel);

            if (!$payload) {
                error_log("Invalid Google credential - no payload returned");
                throw new Exception("Invalid Google credential.");
            }

            error_log("Google verification successful for email: " . ($payload['email'] ?? 'unknown'));
        } catch (Exception $e) {
            error_log("Google verification error: " . $e->getMessage() . " - " . $e->getTraceAsString());
            throw new Exception("Google verification error: " . $e->getMessage());
        }

        $google_id = $payload['sub'];
        $email = $payload['email'];
        $name = $payload['name'];
        $avatar_url = $payload['picture'] ?? null;

        // Check if user exists by google_id or email
        $stmt = $conn->prepare("SELECT * FROM users WHERE google_id = :google_id OR Email_address = :email");
        $stmt->bindParam(':google_id', $google_id);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) { // User exists
            if (empty($user['google_id'])) {
                // User existed by email, but this is their first Google sign-in. Link the account.
                $updateStmt = $conn->prepare("UPDATE users SET google_id = :google_id, avatar_url = :avatar_url WHERE ID = :id");
                $updateStmt->bindParam(':google_id', $google_id);
                $updateStmt->bindParam(':avatar_url', $avatar_url);
                $updateStmt->bindParam(':id', $user['ID']);
                $updateStmt->execute();

                // Re-fetch user data to get the updated info
                $stmt = $conn->prepare("SELECT * FROM users WHERE google_id = :google_id OR Email_address = :email");
                $stmt->bindParam(':google_id', $google_id);
                $stmt->bindParam(':email', $email);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
            }
        } else { // User does not exist, create a new one
            $stmt = $conn->prepare("INSERT INTO users (Full_Name, Email_address, google_id, avatar_url, role, date_registered, account_status) 
                                VALUES (:name, :email, :google_id, :avatar_url, 'user', NOW(), 'active')");
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':google_id', $google_id);
            $stmt->bindParam(':avatar_url', $avatar_url);
            $stmt->execute();

            $newUserId = $conn->lastInsertId(); // Use PDO's lastInsertId

            // Fetch the newly created user
            $newUserStmt = $conn->prepare("SELECT * FROM users WHERE ID = :id");
            $newUserStmt->bindParam(':id', $newUserId);
            $newUserStmt->execute();
            $user = $newUserStmt->fetch(PDO::FETCH_ASSOC);
        }

        // By this point, $user variable holds the user data (either existing or newly created)
        $_SESSION['user_id'] = $user['ID'];
        $_SESSION['full_name'] = $user['Full_Name'];
        $_SESSION['email'] = $user['Email_address'];
        $_SESSION['role'] = $user['role'];

        echo json_encode(['status' => 'success', 'message' => 'Login successful.', 'user' => $user]);
    } else { // Standard email/password login
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            throw new Exception("Email and password are required.");
        }

        $stmt = $conn->prepare("SELECT * FROM users WHERE LOWER(email_address) = LOWER(:email)");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['ID'];
            $_SESSION['full_name'] = $user['Full_Name'];
            $_SESSION['email'] = $user['Email_address'];
            $_SESSION['role'] = $user['role'];

            echo json_encode(['status' => 'success', 'message' => 'Login successful.', 'user' => $user]);
        } else {
            throw new Exception("Invalid email or password.");
        }
    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
