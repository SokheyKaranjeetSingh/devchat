package com.devchat.backend.repository;

import com.devchat.backend.entity.Thread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ThreadRepository extends JpaRepository<Thread, Long> {
    List<Thread> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT t FROM Thread t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Thread> searchByKeyword(@Param("keyword") String keyword);
}