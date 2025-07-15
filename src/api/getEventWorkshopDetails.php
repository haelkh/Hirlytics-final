<?php
// Allow requests from your Vite frontend
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === 'http://localhost:5173') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight 'OPTIONS' request
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if ID parameter is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Event ID is required'
    ]);
    exit;
}

$id = intval($_GET['id']);

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

    // Prepare SQL statement to fetch event details
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
        WHERE EventID = :id
    ");

    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        // Format the response to match the structure used in listEventsAndWorkshops.php
        $imageUrl = $item['imagePath']
            ? 'http://localhost/Hirlytics-final/src/api/uploads/' . $item['imagePath']
            : null;

        $event = [
            'id' => (int)$item['id'],
            'title' => $item['title'],
            'description' => $item['description'],
            'type' => stripos($item['title'], 'workshop') !== false ? 'workshop' : 'event',
            'start' => $item['startDate'] . ' ' . $item['startTime'],
            'end' => $item['endDate'] . ' ' . $item['endTime'],
            'host' => $item['host'],
            'meetingLink' => $item['meetingLink'],
            'imageUrl' => $imageUrl
        ];

        // Format the response
        echo json_encode([
            'status' => 'success',
            'data' => $event
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Event not found'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
