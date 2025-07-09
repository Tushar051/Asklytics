package com.asklytics.service;

import com.asklytics.model.Dataset;
import com.asklytics.repository.DatasetRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DatasetService {

    private static final Logger logger = LoggerFactory.getLogger(DatasetService.class);

    @Autowired
    private DatasetRepository datasetRepository;

    public Dataset uploadCSV(String csvContent, String fileName, String userId) {
        try {
            // Parse CSV content
            CSVReader reader = new CSVReader(new StringReader(csvContent));
            List<String[]> rows = reader.readAll();
            
            if (rows.isEmpty()) {
                throw new RuntimeException("CSV file is empty");
            }

            // Extract headers (first row)
            String[] headers = rows.get(0);
            List<String> columns = Arrays.asList(headers);

            // Convert data rows to maps
            List<Map<String, Object>> data = new ArrayList<>();
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                Map<String, Object> rowMap = new HashMap<>();
                for (int j = 0; j < Math.min(headers.length, row.length); j++) {
                    rowMap.put(headers[j], row[j]);
                }
                data.add(rowMap);
            }

            // Create dataset
            Dataset dataset = new Dataset(
                fileName,
                "Uploaded CSV dataset with " + data.size() + " rows",
                userId,
                columns,
                data
            );

            // Save to database
            Dataset savedDataset = datasetRepository.save(dataset);
            logger.info("Dataset uploaded successfully: {} with {} rows", fileName, data.size());
            
            return savedDataset;

        } catch (CsvException e) {
            logger.error("Error parsing CSV file", e);
            throw new RuntimeException("Failed to parse CSV file: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error uploading dataset", e);
            throw new RuntimeException("Failed to upload dataset: " + e.getMessage());
        }
    }

    public List<Dataset> getUserDatasets(String userId) {
        return datasetRepository.findByUserIdAndIsActiveTrue(userId);
    }

    public Optional<Dataset> getDataset(String userId, String datasetId) {
        Optional<Dataset> dataset = datasetRepository.findByUserIdAndIsActiveTrueAndId(userId, datasetId);
        if (dataset.isPresent()) {
            // Update last accessed time
            Dataset ds = dataset.get();
            ds.setLastAccessedAt(LocalDateTime.now());
            datasetRepository.save(ds);
        }
        return dataset;
    }

    public void deleteDataset(String userId, String datasetId) {
        Optional<Dataset> dataset = datasetRepository.findByUserIdAndIsActiveTrueAndId(userId, datasetId);
        if (dataset.isPresent()) {
            Dataset ds = dataset.get();
            ds.setActive(false);
            datasetRepository.save(ds);
            logger.info("Dataset deleted: {} for user: {}", datasetId, userId);
        } else {
            throw new RuntimeException("Dataset not found");
        }
    }

    public Map<String, Object> getDatasetStats(String userId, String datasetId) {
        Optional<Dataset> dataset = getDataset(userId, datasetId);
        if (dataset.isPresent()) {
            Dataset ds = dataset.get();
            Map<String, Object> stats = new HashMap<>();
            stats.put("id", ds.getId());
            stats.put("name", ds.getName());
            stats.put("description", ds.getDescription());
            stats.put("rowCount", ds.getRowCount());
            stats.put("columnCount", ds.getColumns().size());
            stats.put("columns", ds.getColumns());
            stats.put("uploadedAt", ds.getUploadedAt());
            stats.put("lastAccessedAt", ds.getLastAccessedAt());
            
            // Add sample data (first 5 rows)
            List<Map<String, Object>> sampleData = ds.getData().stream()
                .limit(5)
                .collect(Collectors.toList());
            stats.put("sampleData", sampleData);
            
            return stats;
        } else {
            throw new RuntimeException("Dataset not found");
        }
    }

    public List<Map<String, Object>> queryDataset(String userId, String datasetId, String sqlQuery) {
        Optional<Dataset> dataset = getDataset(userId, datasetId);
        if (dataset.isPresent()) {
            // For now, return all data. In a real implementation, you would parse the SQL
            // and filter the data accordingly
            return dataset.get().getData();
        } else {
            throw new RuntimeException("Dataset not found");
        }
    }
} 