<?php

declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

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
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    $query = "
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
    ";

    $params = [];
    $conditions = [];

    if (isset($_GET['type']) && in_array(strtolower($_GET['type']), ['event', 'workshop'])) {
        $type = strtolower($_GET['type']);
        $conditions[] = $type === 'workshop'
            ? "Title LIKE '%workshop%'"
            : "Title NOT LIKE '%workshop%'";
    }

    if (!empty($conditions)) {
        $query .= " AND " . implode(" AND ", $conditions);
    }

    $query .= " ORDER BY StartDate ASC, StartTime ASC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll();

    $response = array_map(function ($item) {
        $imageUrl = $item['imagePath']
            ? 'http://localhost/Hirlytics-final/src/api/uploads/' . $item['imagePath']
            : null;

        return [
            'id' => (int)$item['id'],
            'title' => $item['title'],
            'type' => stripos($item['title'], 'workshop') !== false ? 'workshop' : 'event',
            'start' => $item['startDate'] . ' ' . $item['startTime'],
            'end' => $item['endDate'] . ' ' . $item['endTime'],
            'host' => $item['host'],
            'meetingLink' => $item['meetingLink'],
            'imageUrl' => $imageUrl
        ];
    }, $results);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => $response,
        'count' => count($response),
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
