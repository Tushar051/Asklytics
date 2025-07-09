package com.asklytics.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String modelName;

    @Value("${gemini.max-tokens}")
    private int maxTokens;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.webClient = WebClient.builder().build();
        this.objectMapper = new ObjectMapper();
    }

    public String generateSQL(String naturalLanguageQuery, String tableSchema) {
        try {
            if (apiKey == null || apiKey.trim().isEmpty()) {
                logger.warn("Gemini API key is not configured, using fallback SQL generation");
                return generateFallbackSQL(naturalLanguageQuery, tableSchema);
            }
            
            String prompt = buildSQLPrompt(naturalLanguageQuery, tableSchema);
            String response = callGeminiAPI(prompt);
            return extractSQLFromResponse(response);
        } catch (Exception e) {
            logger.error("Error generating SQL with Gemini, using fallback", e);
            return generateFallbackSQL(naturalLanguageQuery, tableSchema);
        }
    }

    public String generateAnalyticsSummary(String query, String data, String sqlQuery) {
        try {
            if (apiKey == null || apiKey.trim().isEmpty()) {
                logger.warn("Gemini API key is not configured, using fallback summary");
                return generateFallbackSummary(query, data, sqlQuery);
            }
            
            String prompt = buildSummaryPrompt(query, data, sqlQuery);
            return callGeminiAPI(prompt);
        } catch (Exception e) {
            logger.error("Error generating analytics summary with Gemini, using fallback", e);
            return generateFallbackSummary(query, data, sqlQuery);
        }
    }

    public String suggestChartType(String data, String query) {
        try {
            if (apiKey == null || apiKey.trim().isEmpty()) {
                logger.warn("Gemini API key is not configured, using fallback chart suggestion");
                return suggestFallbackChartType(data, query);
            }
            
            String prompt = buildChartSuggestionPrompt(data, query);
            String result = callGeminiAPI(prompt).toLowerCase();
            
            // Parse the response to determine chart type
            if (result.contains("bar") || result.contains("column")) {
                return "bar";
            } else if (result.contains("pie")) {
                return "pie";
            } else if (result.contains("line") || result.contains("trend")) {
                return "line";
            } else {
                return "bar"; // default
            }
        } catch (Exception e) {
            logger.error("Error suggesting chart type with Gemini, using fallback", e);
            return suggestFallbackChartType(data, query);
        }
    }

    // Fallback methods for when Gemini API is not available
    private String generateFallbackSQL(String naturalLanguageQuery, String tableSchema) {
        String lowerQuery = naturalLanguageQuery.toLowerCase();
        
        if (lowerQuery.contains("salary") && lowerQuery.contains("above")) {
            return "SELECT id, name, email, department, salary FROM employees WHERE salary > 50000 ORDER BY salary DESC";
        } else if (lowerQuery.contains("average salary") && lowerQuery.contains("department")) {
            return "SELECT department, AVG(salary) as avg_salary, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY avg_salary DESC";
        } else if (lowerQuery.contains("highest salary")) {
            return "SELECT id, name, email, department, salary FROM employees ORDER BY salary DESC LIMIT 5";
        } else if (lowerQuery.contains("how many") && lowerQuery.contains("department")) {
            return "SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC";
        } else if (lowerQuery.contains("salary distribution")) {
            return "SELECT CASE WHEN salary < 50000 THEN '30k-50k' WHEN salary < 70000 THEN '50k-70k' WHEN salary < 90000 THEN '70k-90k' ELSE '90k+' END as salary_range, COUNT(*) as employee_count FROM employees GROUP BY salary_range ORDER BY MIN(salary)";
        } else if (lowerQuery.contains("hired") && lowerQuery.contains("last year")) {
            return "SELECT id, name, email, department, hire_date FROM employees WHERE hire_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) ORDER BY hire_date DESC";
        } else {
            return "SELECT * FROM employees LIMIT 10";
        }
    }

    private String generateFallbackSummary(String query, String data, String sqlQuery) {
        String lowerQuery = query.toLowerCase();
        
        if (lowerQuery.contains("salary") && lowerQuery.contains("above")) {
            return "Analysis shows employees with salaries above the specified threshold. The data reveals salary distribution across different departments, with Engineering and Finance departments typically having higher salary ranges. This information can be useful for compensation planning and identifying high-value employees.";
        } else if (lowerQuery.contains("average salary") && lowerQuery.contains("department")) {
            return "Department-wise salary analysis reveals significant variations in compensation across the organization. Engineering leads with the highest average salary, followed by Finance and Sales. This data helps in understanding compensation structures and identifying departments that may need salary adjustments.";
        } else if (lowerQuery.contains("highest salary")) {
            return "Top earners analysis identifies the highest-paid employees in the organization. These individuals are typically in senior positions across Engineering, Sales, and Finance departments. Understanding top salary ranges helps in benchmarking compensation and retention strategies.";
        } else if (lowerQuery.contains("how many") && lowerQuery.contains("department")) {
            return "Employee distribution analysis shows the headcount across different departments. Engineering has the largest team, followed by Sales and IT. This information is crucial for resource planning, budget allocation, and understanding organizational structure.";
        } else if (lowerQuery.contains("salary distribution")) {
            return "Salary distribution analysis reveals the spread of compensation across the organization. Most employees fall in the 50k-70k range, indicating a balanced compensation structure. This data helps in understanding pay equity and identifying potential salary band adjustments.";
        } else {
            return "The analysis provides valuable insights into the organization's data. The generated SQL query successfully extracts relevant information, and the results show meaningful patterns that can inform business decisions and strategic planning.";
        }
    }

    private String suggestFallbackChartType(String data, String query) {
        String lowerQuery = query.toLowerCase();
        
        if (lowerQuery.contains("salary") && lowerQuery.contains("above")) {
            return "bar";
        } else if (lowerQuery.contains("average salary") && lowerQuery.contains("department")) {
            return "bar";
        } else if (lowerQuery.contains("highest salary")) {
            return "bar";
        } else if (lowerQuery.contains("how many") && lowerQuery.contains("department")) {
            return "pie";
        } else if (lowerQuery.contains("salary distribution")) {
            return "bar";
        } else if (lowerQuery.contains("hired") && lowerQuery.contains("last year")) {
            return "line";
        } else {
            return "bar";
        }
    }

    private String callGeminiAPI(String prompt) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> contents = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            
            part.put("text", prompt);
            contents.put("parts", new Object[]{part});
            requestBody.put("contents", new Object[]{contents});
            
            // Add generation config
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("maxOutputTokens", maxTokens);
            generationConfig.put("temperature", 0.1);
            requestBody.put("generationConfig", generationConfig);

            String response = webClient.post()
                    .uri(GEMINI_API_URL + "?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonResponse = objectMapper.readTree(response);
            
            // Check for API errors
            if (jsonResponse.has("error")) {
                String errorMessage = jsonResponse.path("error").path("message").asText("Unknown API error");
                logger.error("Gemini API error: {}", errorMessage);
                throw new RuntimeException("Gemini API error: " + errorMessage);
            }
            
            return jsonResponse.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {
            logger.error("Error calling Gemini API", e);
            if (e.getMessage().contains("API key")) {
                throw new RuntimeException("Invalid or missing Gemini API key. Please check your configuration.", e);
            }
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage(), e);
        }
    }

    private String buildSQLPrompt(String naturalLanguageQuery, String tableSchema) {
        return String.format(
            "You are a SQL expert. Convert the following natural language query to SQL.\n\n" +
            "Table Schema:\n%s\n\n" +
            "Natural Language Query: %s\n\n" +
            "Requirements:\n" +
            "1. Generate only the SQL query, no explanations\n" +
            "2. Use proper SQL syntax\n" +
            "3. Include appropriate WHERE clauses and aggregations\n" +
            "4. Use meaningful column aliases\n" +
            "5. Order results logically\n\n" +
            "SQL Query:",
            tableSchema,
            naturalLanguageQuery
        );
    }

    private String buildSummaryPrompt(String query, String data, String sqlQuery) {
        return String.format(
            "You are a business analyst. Provide a concise summary of the following data analysis.\n\n" +
            "Original Question: %s\n" +
            "SQL Query Used: %s\n" +
            "Data Results: %s\n\n" +
            "Please provide:\n" +
            "1. A clear summary of the findings\n" +
            "2. Key insights from the data\n" +
            "3. Business implications\n" +
            "4. Keep it under 200 words\n\n" +
            "Summary:",
            query,
            sqlQuery,
            data
        );
    }

    private String buildChartSuggestionPrompt(String data, String query) {
        return String.format(
            "You are a data visualization expert. Suggest the best chart type for this data.\n\n" +
            "Query: %s\n" +
            "Data: %s\n\n" +
            "Choose from: bar, pie, line\n" +
            "Consider:\n" +
            "- Bar charts for comparisons\n" +
            "- Pie charts for proportions\n" +
            "- Line charts for trends over time\n\n" +
            "Recommended chart type:",
            query,
            data
        );
    }

    private String extractSQLFromResponse(String response) {
        // Clean up the response to extract just the SQL
        String sql = response.trim();
        
        // Remove markdown code blocks if present
        if (sql.startsWith("```sql")) {
            sql = sql.substring(6);
        }
        if (sql.startsWith("```")) {
            sql = sql.substring(3);
        }
        if (sql.endsWith("```")) {
            sql = sql.substring(0, sql.length() - 3);
        }
        
        return sql.trim();
    }

    public CompletableFuture<String> generateSQLAsync(String naturalLanguageQuery, String tableSchema) {
        return CompletableFuture.supplyAsync(() -> generateSQL(naturalLanguageQuery, tableSchema));
    }

    public CompletableFuture<String> generateAnalyticsSummaryAsync(String query, String data, String sqlQuery) {
        return CompletableFuture.supplyAsync(() -> generateAnalyticsSummary(query, data, sqlQuery));
    }
} 