<?php

declare(strict_types=1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("X-Content-Type-Options: nosniff");

// Database configuration
const DB_HOST = 'localhost';
const DB_NAME = 'hirlytics';
const DB_USER = 'root';
const DB_PASS = '';

try {
    // Database connection
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    // Get all users (excluding passwords for security reasons)
    $stmt = $pdo->prepare("
        SELECT 
            ID as id,
            google_id,
            avatar_url,
            last_login,
            Linkedin_profile,
            date_registered,
            phone_number,
            Email_address,
            account_status,
            Full_Name,
            role
        FROM users
        ORDER BY ID DESC
    ");
    $stmt->execute();
    $users = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count' => count($users),
        'data' => $users,
        'timestamp' => date('c')
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
