<?php
// Allow requests from your Vite frontend
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === 'http://localhost:5173') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// To fix the "Cross-Origin-Opener-Policy" warning
header("Cross-Origin-Opener-Policy: same-origin-allow-popups");

// Handle preflight 'OPTIONS' request
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost"; // Change this to your database server name
$username = "root";      // Change this to your database username
$password = "";          // Change this to your database password
$dbname = "hirlytics";      // Change this to your database name

$conn = null;

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // For debugging, you can temporarily uncomment the line below to see the error directly.
    die("Connection failed: " . $e->getMessage());
}
