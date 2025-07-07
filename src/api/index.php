<?php
// Set headers for JSON API response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Include database connection
require_once 'db_connect.php';

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only GET requests are allowed']);
    exit;
}

/**
 * Calculate percentage change between current and previous values
 * 
 * @param int $current Current value
 * @param int $previous Previous value
 * @return array Array with percentage change and direction (increase/decrease)
 */
function calculatePercentageChange($current, $previous)
{
    if ($previous == 0) {
        return [
            'percentage' => $current > 0 ? 100 : 0,
            'direction' => $current > 0 ? 'increase' : 'no change'
        ];
    }

    $change = (($current - $previous) / $previous) * 100;
    $direction = $change > 0 ? 'increase' : ($change < 0 ? 'decrease' : 'no change');

    return [
        'percentage' => round(abs($change), 1),
        'direction' => $direction
    ];
}

// Function to get metrics
function getMetrics($conn)
{
    try {
        // Initialize metrics array
        $metrics = [
            'total_jobs' => 0,
            'total_companies' => 0,
            'total_job_seekers' => 0,
            'total_applications' => 0,
            'job_types' => [],
            'job_locations' => [],
            'recent_activity' => []
        ];

        // Get current date info
        $currentMonth = date('m');
        $currentYear = date('Y');

        // Calculate previous month info
        $previousMonth = $currentMonth == 1 ? 12 : $currentMonth - 1;
        $previousYear = $currentMonth == 1 ? $currentYear - 1 : $currentYear;

        // First day of current month
        $firstDayCurrentMonth = "$currentYear-$currentMonth-01";
        // First day of previous month
        $firstDayPreviousMonth = "$previousYear-$previousMonth-01";

        // ---------- JOBS METRICS ---------- //
        // Current month jobs count
        $stmt = $conn->query("SELECT COUNT(*) as count FROM job_board");
        $currentJobsCount = $stmt->fetch()['count'];
        $metrics['total_jobs'] = $currentJobsCount;

        // Previous month jobs count
        $stmt = $conn->query("SELECT COUNT(*) as count FROM job_board 
                            WHERE DATE(date_posted) < '$firstDayCurrentMonth'");
        $previousJobsCount = $stmt->fetch()['count'];

        // Calculate new jobs added this month
        $newJobsThisMonth = $currentJobsCount - $previousJobsCount;
        $metrics['jobs_change'] = calculatePercentageChange($newJobsThisMonth, $previousJobsCount);

        // ---------- COMPANIES METRICS ---------- //
        // Current month companies count
        $stmt = $conn->query("SELECT COUNT(*) as count FROM company");
        $currentCompaniesCount = $stmt->fetch()['count'];
        $metrics['total_companies'] = $currentCompaniesCount;

        // Previous month companies count
        $stmt = $conn->query("SELECT COUNT(*) as count FROM company 
                            WHERE DATE(date_joined) < '$firstDayCurrentMonth'");
        $previousCompaniesCount = $stmt->fetch()['count'];

        // Calculate companies change
        $newCompaniesThisMonth = $currentCompaniesCount - $previousCompaniesCount;
        $metrics['companies_change'] = calculatePercentageChange($newCompaniesThisMonth, $previousCompaniesCount);

        // ---------- JOB SEEKERS METRICS ---------- //
        // Current month job seekers count
        $stmt = $conn->query("SELECT COUNT(*) as count FROM job_seeker");
        $currentJobSeekersCount = $stmt->fetch()['count'];
        $metrics['total_job_seekers'] = $currentJobSeekersCount;

        // Previous month job seekers count
        $stmt = $conn->query("SELECT COUNT(*) as count FROM job_seeker 
                            WHERE DATE(date_created) < '$firstDayCurrentMonth'");
        $previousJobSeekersCount = $stmt->fetch()['count'];

        // Calculate job seekers change
        $newJobSeekersThisMonth = $currentJobSeekersCount - $previousJobSeekersCount;
        $metrics['job_seekers_change'] = calculatePercentageChange($newJobSeekersThisMonth, $previousJobSeekersCount);

        // ---------- APPLICATIONS METRICS ---------- //
        // Current month applications count
        $stmt = $conn->query("SELECT COUNT(*) as count FROM job_application");
        $currentApplicationsCount = $stmt->fetch()['count'];
        $metrics['total_applications'] = $currentApplicationsCount;

        // Previous month applications count (excluding this month)
        $stmt = $conn->query("SELECT COUNT(*) as count FROM job_application 
                            WHERE DATE(ApplicationDate) < '$firstDayCurrentMonth'");
        $previousApplicationsCount = $stmt->fetch()['count'];

        // Applications submitted this month
        $applicationsThisMonth = $currentApplicationsCount - $previousApplicationsCount;
        $metrics['applications_change'] = calculatePercentageChange($applicationsThisMonth, $previousApplicationsCount);

        // Get job types distribution
        $stmt = $conn->query("SELECT JobType, COUNT(*) as count FROM job_board GROUP BY JobType");
        $metrics['job_types'] = $stmt->fetchAll();

        // Get job locations distribution
        $stmt = $conn->query("SELECT c.CountryName, COUNT(*) as count 
                            FROM job_board j
                            JOIN country c ON j.country_id = c.CountryID
                            GROUP BY c.CountryName");
        $metrics['job_locations'] = $stmt->fetchAll();

        // Get recent job applications (last 10)
        $stmt = $conn->query("SELECT ja.ApplicationId, ja.ApplicationDate, ja.Status, 
                            jb.JobTitle, js.SeekingPosition, u.Full_Name
                            FROM job_application ja
                            JOIN job_board jb ON ja.JobID = jb.ID
                            JOIN job_seeker js ON ja.JobSeekerID = js.JOBSeekerID
                            JOIN users u ON js.user_id = u.ID
                            ORDER BY ja.ApplicationDate DESC LIMIT 10");
        $metrics['recent_applications'] = $stmt->fetchAll();

        return $metrics;
    } catch (PDOException $e) {
        throw new Exception("Error fetching metrics: " . $e->getMessage());
    }
}

try {
    // Get metrics data
    $data = getMetrics($conn);

    // Return success response with data
    echo json_encode([
        'status' => 'success',
        'data' => $data
    ]);
} catch (Exception $e) {
    // Return error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
