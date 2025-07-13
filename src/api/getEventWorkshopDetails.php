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
    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Valid event ID is required',
            'errorCode' => 'INVALID_INPUT'
        ]);
        exit;
    }

    $eventId = (int)$_GET['id'];
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    $stmt = $pdo->prepare("
        SELECT 
            EventID as id,
            Title as title,
            Description as description,
            StartDate as startDate,
            StartTime as startTime,
            EndDate as endDate,
            EndTime as endTime,
            MeetingLink as meetingLink,
            HostedBy as host,
            ImagePath as imagePath,
            CreatedAt as createdAt
        FROM Events 
        WHERE EventID = ?
    ");
    $stmt->execute([$eventId]);
    $event = $stmt->fetch();

    if (!$event) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Event not found',
            'errorCode' => 'NOT_FOUND'
        ]);
        exit;
    }

    // Format response
    $event['startDateTime'] = $event['startDate'] . 'T' . $event['startTime'];
    $event['endDateTime'] = $event['endDate'] . 'T' . $event['endTime'];
    $event['type'] = stripos($event['title'], 'workshop') !== false ? 'workshop' : 'event';

    if ($event['imagePath']) {
        $event['imageUrl'] = 'http://localhost:5173/uploads/' . basename($event['imagePath']);
    } else {
        $event['imageUrl'] = null;
    }
    unset($event['imagePath'], $event['startDate'], $event['startTime'], $event['endDate'], $event['endTime']);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => $event,
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
}
