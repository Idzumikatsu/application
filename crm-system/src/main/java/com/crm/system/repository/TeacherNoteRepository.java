
package com.crm.system.repository;

import com.crm.system.model.TeacherNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherNoteRepository extends JpaRepository<TeacherNote, Long> {
    List<TeacherNote> findByTeacherIdAndStudentIdOrderByCreatedAtDesc(Long teacherId, Long studentId);
}
