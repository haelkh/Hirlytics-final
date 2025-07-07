<?php
// Set execution time and memory limit for better performance
ini_set('max_execution_time', 30);
ini_set('memory_limit', '128M');

// Start timing for performance measurement
$start_time = microtime(true);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hirlytics";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    output_error("Connection failed: " . $conn->connect_error);
}

// Get search parameters
$search_term = isset($_GET['q']) ? trim($_GET['q']) : '';
$job_type = isset($_GET['type']) ? trim($_GET['type']) : '';
$location = isset($_GET['location']) ? trim($_GET['location']) : '';
$min_salary = isset($_GET['min_salary']) ? (float)$_GET['min_salary'] : 0;
$max_salary = isset($_GET['max_salary']) ? (float)$_GET['max_salary'] : 0;
$sort = isset($_GET['sort']) ? trim($_GET['sort']) : 'latest';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

// Validate limit to prevent resource exhaustion
$limit = min($limit, 100);

// Prepare base query
$sql = "SELECT 
            jb.ID as job_id,
            jb.JobTitle,
            jb.JobType,
            jb.expiry_date,
            jb.status,
            jb.description,
            jb.date_posted,
            jb.country_id
        FROM 
            job_board jb
        WHERE 
            1=1";

// Prepare count query
$count_sql = "SELECT COUNT(*) as total FROM job_board jb WHERE 1=1";

// Build search conditions
$conditions = [];
$params = [];
$types = "";

// Search term (search in multiple columns)
if (!empty($search_term)) {
    $search_param = "%$search_term%";
    $conditions[] = "(jb.JobTitle LIKE ? OR jb.description LIKE ?)";
    $params[] = $search_param;
    $params[] = $search_param;
    $types .= "ss";
}

// Job type filter
if (!empty($job_type)) {
    $conditions[] = "jb.JobType = ?";
    $params[] = $job_type;
    $types .= "s";
}

// Add conditions to query
if (!empty($conditions)) {
    $sql .= " AND " . implode(" AND ", $conditions);
    $count_sql .= " AND " . implode(" AND ", $conditions);
}

// Add sorting
switch ($sort) {
    case 'latest':
        $sql .= " ORDER BY jb.date_posted DESC";
        break;
    case 'oldest':
        $sql .= " ORDER BY jb.date_posted ASC";
        break;
    case 'title':
        $sql .= " ORDER BY jb.JobTitle ASC";
        break;
    default:
        $sql .= " ORDER BY jb.date_posted DESC";
}

// Add pagination
$sql .= " LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= "ii";

// Get total count without pagination
$total_count = 0;
if (!empty($params) && !empty($types)) {
    // Count query with parameters
    $count_stmt = $conn->prepare($count_sql);

    // Only bind params that are used in the count query (not including pagination)
    $count_types = substr($types, 0, -2); // Remove the 'ii' for limit and offset
    $count_params = array_slice($params, 0, -2); // Remove the limit and offset params

    if (!empty($count_types) && !empty($count_params)) {
        $count_stmt->bind_param($count_types, ...$count_params);
        $count_stmt->execute();
        $count_result = $count_stmt->get_result();
        $count_row = $count_result->fetch_assoc();
        $total_count = $count_row['total'];
        $count_stmt->close();
    } else {
        // No parameters except pagination
        $count_result = $conn->query($count_sql);
        $count_row = $count_result->fetch_assoc();
        $total_count = $count_row['total'];
    }
} else {
    // No parameters at all
    $count_result = $conn->query($count_sql);
    $count_row = $count_result->fetch_assoc();
    $total_count = $count_row['total'];
}

// Prepare and execute main query
$stmt = $conn->prepare($sql);
if (!empty($params) && !empty($types)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$jobs = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Clean and format the data
        $jobs[] = [
            "job_id" => (int)$row["job_id"],
            "job_title" => $row["JobTitle"],
            "job_type" => $row["JobType"],
            "date_posted" => $row["date_posted"],
            "expiry_date" => $row["expiry_date"],
            "status" => $row["status"],
            "description" => $row["description"]
        ];
    }
}

// Calculate execution time
$execution_time = microtime(true) - $start_time;

// Build the response
$response = [
    "status" => "success",
    "execution_time" => round($execution_time, 4) . " seconds",
    "total_results" => $total_count,
    "showing" => count($jobs),
    "offset" => $offset,
    "limit" => $limit,
    "jobs" => $jobs
];

// Check if we should add pagination links
if ($total_count > $limit) {
    $current_url = get_current_url();
    $base_url = preg_replace('/&offset=\d+/', '', $current_url);
    $base_url = preg_replace('/\?offset=\d+&/', '?', $base_url);

    $pagination = [
        "next" => null,
        "prev" => null
    ];

    // Next page link
    if ($offset + $limit < $total_count) {
        $next_offset = $offset + $limit;
        $pagination["next"] = add_query_param($base_url, "offset", $next_offset);
    }

    // Previous page link
    if ($offset > 0) {
        $prev_offset = max(0, $offset - $limit);
        $pagination["prev"] = add_query_param($base_url, "offset", $prev_offset);
    }

    $response["pagination"] = $pagination;
}

// Output the response
echo json_encode($response);

// Close the connection
$stmt->close();
$conn->close();

// Helper functions
function output_error($message)
{
    echo json_encode([
        "status" => "error",
        "message" => $message
    ]);
    exit;
}

function get_current_url()
{
    $protocol = !empty($_SERVER['HTTPS']) ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $uri = $_SERVER['REQUEST_URI'];
    return "$protocol://$host$uri";
}

function add_query_param($url, $param, $value)
{
    $separator = strpos($url, '?') !== false ? '&' : '?';
    return $url . $separator . $param . '=' . $value;
}
