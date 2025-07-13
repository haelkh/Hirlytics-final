<?php

declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("X-Content-Type-Options: nosniff");

const DB_HOST = 'localhost';
const DB_NAME = 'hirlytics';
const DB_USER = 'root';
const DB_PASS = '';

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    $stmt = $pdo->query("
        SELECT 
            EventID as id,
            Title as title,
            Description as description,
            CONCAT(StartDate, ' ', StartTime) as startDateTime,
            CONCAT(EndDate, ' ', EndTime) as endDateTime,
            MeetingLink as meetingLink,
            HostedBy as host,
            ImagePath as imagePath,
            CreatedAt as createdAt
        FROM Events 
        ORDER BY StartDate ASC, StartTime ASC
    ");

    $events = $stmt->fetchAll();

    // Convert image paths to full URLs
    foreach ($events as &$event) {
        if ($event['imagePath']) {
            $event['imageUrl'] = 'http://localhost:5173/uploads/' . basename($event['imagePath']);
        } else {
            $event['imageUrl'] = null;
        }
        unset($event['imagePath']);
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => $events,
        'count' => count($events),
        'timestamp' => date('c')
    ]);
} catch (PDOException $e) {
    error_log('Database Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database operation failed',
        'errorCode' => 'DB_ERROR'
    ]);
} catch (Throwable $e) {
    error_log('System Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'An unexpected error occurred',
        'errorCode' => 'SYSTEM_ERROR'
    ]);
}
