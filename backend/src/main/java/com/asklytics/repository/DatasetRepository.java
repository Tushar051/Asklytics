package com.asklytics.repository;

import com.asklytics.model.Dataset;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DatasetRepository extends MongoRepository<Dataset, String> {
    
    List<Dataset> findByUserIdAndIsActiveTrue(String userId);
    
    Optional<Dataset> findByUserIdAndIsActiveTrueAndId(String userId, String id);
    
    void deleteByUserIdAndId(String userId, String id);
} 