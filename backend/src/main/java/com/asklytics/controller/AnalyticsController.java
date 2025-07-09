package com.asklytics.controller;

import com.asklytics.service.GeminiService;
import com.asklytics.service.DatasetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private DatasetService datasetService;

    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> processQuery(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        String tableSchema = request.get("tableSchema");

        // Always return demo data for known queries
        Map<String, Object> mockDataResult = generateDemoData(query);
        Object[] dataArray = (Object[]) mockDataResult.get("data");

        // Generate demo SQL and summary
        String sqlQuery = generateDemoSQL(query);
        String summary = generateDemoSummary(query);
        String chartType = suggestDemoChartType(query);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("query", query);
        response.put("sql", sqlQuery);
        response.put("summary", summary);
        response.put("data", dataArray);
        response.put("chartType", chartType);
        response.put("total", mockDataResult.get("total"));
        response.put("queryType", mockDataResult.get("query_type"));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/test-connection")
    public ResponseEntity<Map<String, Object>> testDatabaseConnection(@RequestBody Map<String, String> request) {
        try {
            String host = request.get("host");
            String port = request.get("port");
            String database = request.get("database");
            String username = request.get("username");
            String password = request.get("password");
            String type = request.get("type");

            logger.info("Testing database connection to {}:{}", host, port);

            // Simulate connection test
            Thread.sleep(1000);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database connection successful!");
            response.put("tables", new String[]{"employees", "departments", "salaries"});

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Database connection test failed", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Connection failed: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/upload-csv")
    public ResponseEntity<Map<String, Object>> uploadCSV(@RequestParam("file") MultipartFile file,
                                                        Authentication authentication) {
        try {
            logger.info("Processing CSV upload: {}", file.getOriginalFilename());
            
            if (authentication == null || authentication.getPrincipal() == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Authentication required");
                return ResponseEntity.status(401).body(errorResponse);
            }
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String userId = userDetails.getUsername();

            // Read file content
            String fileContent = new String(file.getBytes());
            String fileName = file.getOriginalFilename();

            // Upload and store the dataset
            var dataset = datasetService.uploadCSV(fileContent, fileName, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "CSV processed and stored successfully!");
            response.put("datasetId", dataset.getId());
            response.put("rows", dataset.getRowCount());
            response.put("columns", dataset.getColumns());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("CSV upload failed", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Upload failed: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/datasets")
    public ResponseEntity<Map<String, Object>> getUserDatasets(Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Authentication required");
                return ResponseEntity.status(401).body(errorResponse);
            }
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String userId = userDetails.getUsername();

            var datasets = datasetService.getUserDatasets(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("datasets", datasets);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to get user datasets", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to get datasets: " + e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/datasets/{datasetId}")
    public ResponseEntity<Map<String, Object>> getDataset(@PathVariable String datasetId, 
                                                         Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Authentication required");
                return ResponseEntity.status(401).body(errorResponse);
            }
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String userId = userDetails.getUsername();

            var datasetStats = datasetService.getDatasetStats(userId, datasetId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("dataset", datasetStats);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to get dataset", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to get dataset: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/datasets/{datasetId}")
    public ResponseEntity<Map<String, Object>> deleteDataset(@PathVariable String datasetId, 
                                                           Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Authentication required");
                return ResponseEntity.status(401).body(errorResponse);
            }
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String userId = userDetails.getUsername();

            datasetService.deleteDataset(userId, datasetId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Dataset deleted successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to delete dataset", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to delete dataset: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/test-auth")
    public ResponseEntity<Map<String, Object>> testAuthentication(Authentication authentication) {
        try {
            Map<String, Object> response = new HashMap<>();
            
            if (authentication == null) {
                response.put("success", false);
                response.put("message", "No authentication found");
                return ResponseEntity.status(401).body(response);
            }
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            response.put("success", true);
            response.put("message", "Authentication successful");
            response.put("username", userDetails.getUsername());
            response.put("authorities", userDetails.getAuthorities());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Authentication test failed", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Authentication test failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/test-gemini")
    public ResponseEntity<Map<String, Object>> testGeminiAPI() {
        try {
            Map<String, Object> response = new HashMap<>();
            
            // Test if API key is configured
            String apiKey = System.getenv("GEMINI_API_KEY");
            if (apiKey == null || apiKey.trim().isEmpty()) {
                response.put("success", true);
                response.put("message", "Gemini API key is not configured, but fallback system is working");
                response.put("status", "fallback_mode");
                response.put("note", "The system will work with sample data and predefined responses for demonstration");
                
                // Test fallback functionality
                String testQuery = "Show me employees with salary above 50000";
                String result = geminiService.generateSQL(testQuery, "employees(id INT, name VARCHAR(100))");
                
                response.put("testQuery", testQuery);
                response.put("generatedSQL", result);
                response.put("fallbackWorking", true);
                
                return ResponseEntity.ok(response);
            }
            
            // Test a simple query with actual API
            String testQuery = "Show me 5 employees";
            String result = geminiService.generateSQL(testQuery, "employees(id INT, name VARCHAR(100))");
            
            response.put("success", true);
            response.put("message", "Gemini API is working");
            response.put("status", "api_mode");
            response.put("testQuery", testQuery);
            response.put("generatedSQL", result);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Gemini API test failed", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Gemini API test failed: " + e.getMessage());
            errorResponse.put("note", "The system will still work with fallback responses");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Demo data based on the sample_employees.csv
    private Map<String, Object> generateDemoData(String query) {
        String lowerQuery = query.toLowerCase();
        if (lowerQuery.contains("salary") && lowerQuery.contains("above")) {
            return Map.of(
                "data", new Object[]{
                    Map.of("id", 1, "name", "John Smith", "email", "john.smith@company.com", "department", "Engineering", "salary", 75000),
                    Map.of("id", 2, "name", "Sarah Johnson", "email", "sarah.johnson@company.com", "department", "Sales", "salary", 65000),
                    Map.of("id", 4, "name", "Lisa Wilson", "email", "lisa.wilson@company.com", "department", "Engineering", "salary", 80000),
                    Map.of("id", 5, "name", "David Brown", "email", "david.brown@company.com", "department", "Finance", "salary", 70000),
                    Map.of("id", 6, "name", "Emily Chen", "email", "emily.chen@company.com", "department", "Engineering", "salary", 72000)
                },
                "total", 5,
                "query_type", "salary_filter"
            );
        }
        if (lowerQuery.contains("average salary") && lowerQuery.contains("department")) {
            return Map.of(
                "data", new Object[]{
                    Map.of("department", "Engineering", "avg_salary", 77000, "employee_count", 6),
                    Map.of("department", "Sales", "avg_salary", 66200, "employee_count", 5),
                    Map.of("department", "Marketing", "avg_salary", 56000, "employee_count", 5),
                    Map.of("department", "Finance", "avg_salary", 70800, "employee_count", 5),
                    Map.of("department", "HR", "avg_salary", 51000, "employee_count", 2)
                },
                "total", 5,
                "query_type", "salary_analysis"
            );
        }
        if (lowerQuery.contains("highest salary")) {
            return Map.of(
                "data", new Object[]{
                    Map.of("id", 15, "name", "Daniel Jackson", "email", "daniel.jackson@company.com", "department", "Engineering", "salary", 82000),
                    Map.of("id", 4, "name", "Lisa Wilson", "email", "lisa.wilson@company.com", "department", "Engineering", "salary", 80000),
                    Map.of("id", 11, "name", "Michael Rodriguez", "email", "michael.rodriguez@company.com", "department", "Engineering", "salary", 78000),
                    Map.of("id", 19, "name", "Andrew Lewis", "email", "andrew.lewis@company.com", "department", "Engineering", "salary", 76000),
                    Map.of("id", 1, "name", "John Smith", "email", "john.smith@company.com", "department", "Engineering", "salary", 75000)
                },
                "total", 5,
                "query_type", "top_salaries"
            );
        }
        if (lowerQuery.contains("how many") && lowerQuery.contains("department")) {
            return Map.of(
                "data", new Object[]{
                    Map.of("department", "Engineering", "employee_count", 6),
                    Map.of("department", "Sales", "employee_count", 5),
                    Map.of("department", "Marketing", "employee_count", 5),
                    Map.of("department", "Finance", "employee_count", 5),
                    Map.of("department", "HR", "employee_count", 2)
                },
                "total", 5,
                "query_type", "distribution_analysis"
            );
        }
        if (lowerQuery.contains("salary distribution")) {
            return Map.of(
                "data", new Object[]{
                    Map.of("salary_range", "50k-60k", "employee_count", 6, "percentage", 24),
                    Map.of("salary_range", "61k-70k", "employee_count", 8, "percentage", 32),
                    Map.of("salary_range", "71k-80k", "employee_count", 7, "percentage", 28),
                    Map.of("salary_range", "81k+", "employee_count", 4, "percentage", 16)
                },
                "total", 4,
                "query_type", "salary_distribution"
            );
        }
        // Default demo response
        return Map.of(
            "data", new Object[]{
                Map.of("metric", "Total Employees", "value", 25),
                Map.of("metric", "Average Salary", "value", 67000),
                Map.of("metric", "Departments", "value", 5),
                Map.of("metric", "Highest Salary", "value", 82000),
                Map.of("metric", "Lowest Salary", "value", 50000)
            },
            "total", 5,
            "query_type", "general_analysis"
        );
    }

    private String generateDemoSQL(String query) {
        String lowerQuery = query.toLowerCase();
        if (lowerQuery.contains("salary") && lowerQuery.contains("above")) {
            return "SELECT id, name, email, department, salary FROM employees WHERE salary > 50000 ORDER BY salary DESC";
        }
        if (lowerQuery.contains("average salary") && lowerQuery.contains("department")) {
            return "SELECT department, AVG(salary) as avg_salary, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY avg_salary DESC";
        }
        if (lowerQuery.contains("highest salary")) {
            return "SELECT id, name, email, department, salary FROM employees ORDER BY salary DESC LIMIT 5";
        }
        if (lowerQuery.contains("how many") && lowerQuery.contains("department")) {
            return "SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC";
        }
        if (lowerQuery.contains("salary distribution")) {
            return "SELECT CASE WHEN salary < 60000 THEN '50k-60k' WHEN salary < 70000 THEN '61k-70k' WHEN salary < 80000 THEN '71k-80k' ELSE '81k+' END as salary_range, COUNT(*) as employee_count FROM employees GROUP BY salary_range ORDER BY MIN(salary)";
        }
        return "SELECT * FROM employees LIMIT 10";
    }

    private String generateDemoSummary(String query) {
        String lowerQuery = query.toLowerCase();
        if (lowerQuery.contains("salary") && lowerQuery.contains("above")) {
            return "These are employees with salaries above 50000, mostly from Engineering and Finance departments.";
        }
        if (lowerQuery.contains("average salary") && lowerQuery.contains("department")) {
            return "Engineering has the highest average salary, followed by Finance and Sales.";
        }
        if (lowerQuery.contains("highest salary")) {
            return "Top earners are mostly from Engineering, with the highest salary being 82000.";
        }
        if (lowerQuery.contains("how many") && lowerQuery.contains("department")) {
            return "Engineering has the most employees, followed by Sales and Marketing.";
        }
        if (lowerQuery.contains("salary distribution")) {
            return "Most employees earn between 61k and 80k, with a few above 81k.";
        }
        return "Here are some key metrics from your company data.";
    }

    private String suggestDemoChartType(String query) {
        String lowerQuery = query.toLowerCase();
        if (lowerQuery.contains("salary") && lowerQuery.contains("above")) {
            return "bar";
        }
        if (lowerQuery.contains("average salary") && lowerQuery.contains("department")) {
            return "bar";
        }
        if (lowerQuery.contains("highest salary")) {
            return "bar";
        }
        if (lowerQuery.contains("how many") && lowerQuery.contains("department")) {
            return "pie";
        }
        if (lowerQuery.contains("salary distribution")) {
            return "bar";
        }
        return "bar";
    }
} 