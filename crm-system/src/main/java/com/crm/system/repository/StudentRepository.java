package com.crm.system.repository;

import com.crm.system.model.Student;
import com.crm.system.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    List<Student> findByAssignedTeacher(User teacher);
    
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Student> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT s FROM Student s WHERE s.assignedTeacher IS NULL")
    Page<Student> findUnassignedStudents(Pageable pageable);
    
    Boolean existsByEmail(String email);
    
    Student findByTelegramChatId(Long chatId);
    
    Boolean existsByTelegramChatId(Long chatId);
    
    long countByAssignedTeacherIsNull();
}