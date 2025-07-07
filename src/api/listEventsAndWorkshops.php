<?php
declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

    // Base query
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
            CreatedAt as createdAt
        FROM Events
    ";
    
    $params = [];
    $conditions = [];

    // Filter by type if provided
    if (isset($_GET['type']) && in_array(strtolower($_GET['type']), ['event', 'workshop'])) {
        $type = strtolower($_GET['type']);
        $conditions[] = $type === 'workshop' 
            ? "Title LIKE '%workshop%'" 
            : "Title NOT LIKE '%workshop%'";
    }

    // Apply conditions
    if (!empty($conditions)) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }

    // Default sorting
    $query .= " ORDER BY StartDate ASC, StartTime ASC";

    // Execute query
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll();

    // Format response
    $response = array_map(function($item) {
        return [
            'id' => (int)$item['id'],
            'title' => $item['title'],
            'type' => stripos($item['title'], 'workshop') !== false ? 'workshop' : 'event',
            'start' => $item['startDate'] . 'T' . $item['startTime'],
            'end' => $item['endDate'] . 'T' . $item['endTime'],
            'host' => $item['host'],
            'meetingLink' => $item['meetingLink']
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
}
?>