
package com.crm.system.service;

import com.crm.system.model.Student;
import com.crm.system.model.TeacherNote;
import com.crm.system.model.User;
import com.crm.system.repository.TeacherNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherNoteService {

    @Autowired
    private TeacherNoteRepository teacherNoteRepository;

    public TeacherNote addNote(User teacher, Student student, String noteContent) {
        TeacherNote note = TeacherNote.builder()
                .teacher(teacher)
                .student(student)
                .note(noteContent)
                .build();
        return teacherNoteRepository.save(note);
    }

    public List<TeacherNote> getNotesByTeacherAndStudent(Long teacherId, Long studentId) {
        return teacherNoteRepository.findByTeacherIdAndStudentIdOrderByCreatedAtDesc(teacherId, studentId);
    }
}
