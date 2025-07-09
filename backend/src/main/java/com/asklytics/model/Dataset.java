package com.asklytics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "datasets")
public class Dataset {
    
    @Id
    private String id;
    
    private String name;
    private String description;
    private String userId;
    private List<String> columns;
    private List<Map<String, Object>> data;
    private int rowCount;
    private LocalDateTime uploadedAt;
    private LocalDateTime lastAccessedAt;
    private boolean isActive;
    
    public Dataset() {}
    
    public Dataset(String name, String description, String userId, List<String> columns, List<Map<String, Object>> data) {
        this.name = name;
        this.description = description;
        this.userId = userId;
        this.columns = columns;
        this.data = data;
        this.rowCount = data.size();
        this.uploadedAt = LocalDateTime.now();
        this.lastAccessedAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public List<String> getColumns() {
        return columns;
    }
    
    public void setColumns(List<String> columns) {
        this.columns = columns;
    }
    
    public List<Map<String, Object>> getData() {
        return data;
    }
    
    public void setData(List<Map<String, Object>> data) {
        this.data = data;
        this.rowCount = data.size();
    }
    
    public int getRowCount() {
        return rowCount;
    }
    
    public void setRowCount(int rowCount) {
        this.rowCount = rowCount;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
    
    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }
    
    public void setLastAccessedAt(LocalDateTime lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
} 