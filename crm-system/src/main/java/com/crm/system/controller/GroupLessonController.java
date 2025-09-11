import com.crm.system.dto.GroupLessonDto;
import com.crm.system.dto.CreateGroupLessonDto;
import com.crm.system.model.GroupLesson;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.service.GroupLessonService;
import com.crm.system.service.StudentService;
import com.crm.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class GroupLessonController {

    @Autowired
    private GroupLessonService groupLessonService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private StudentService studentService;

    @GetMapping("/teachers/{teacherId}/group-lessons")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<GroupLessonDto>> getTeacherGroupLessons(
            @PathVariable Long teacherId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = endDate != null ? endDate : start.plusWeeks(1);

        Pageable pageable = PageRequest.of(page, size);
        Page<GroupLesson> groupLessonPage = groupLessonService.findAvailableSlotsByTeacherIdAndDateRange(
                teacherId, start, end, pageable);

        Page<GroupLessonDto> groupLessonDtos = groupLessonPage.map(this::convertToDto);
        return ResponseEntity.ok(groupLessonDtos);
    }

    @GetMapping("/students/{studentId}/group-lessons")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<GroupLessonDto>> getStudentGroupLessons(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        Student student = studentService.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = endDate != null ? endDate : start.plusWeeks(1);

        Pageable pageable = PageRequest.of(page, size);
        Page<GroupLesson> groupLessonPage = groupLessonService.findByStudentIdAndDateRange(
                studentId, start, end, pageable);

        Page<GroupLessonDto> groupLessonDtos = groupLessonPage.map(this::convertToDto);
        return ResponseEntity.ok(groupLessonDtos);
    }

    @PostMapping("/teachers/group-lessons")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<GroupLessonDto> createGroupLesson(@Valid @RequestBody CreateGroupLessonDto createDto) {
        User teacher = userService.findById(createDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + createDto.getTeacherId()));

        GroupLesson groupLesson = groupLessonService.createGroupLesson(
                teacher,
                createDto.getLessonTopic(),
                createDto.getScheduledDate(),
                createDto.getScheduledTime(),
                createDto.getDurationMinutes()
        );

        groupLesson.setMaxStudents(createDto.getMaxStudents());
        groupLesson.setDescription(createDto.getDescription());
        groupLesson.setMeetingLink(createDto.getMeetingLink());

        GroupLesson savedGroupLesson = groupLessonService.updateGroupLesson(groupLesson);

        return ResponseEntity.ok(convertToDto(savedGroupLesson));
    }

    @GetMapping("/group-lessons/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<GroupLessonDto> getGroupLessonById(@PathVariable Long id) {
        GroupLesson groupLesson = groupLessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Group lesson not found with id: " + id));
        return ResponseEntity.ok(convertToDto(groupLesson));
    }

    @PutMapping("/group-lessons/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<GroupLessonDto> updateGroupLesson(
            @PathVariable Long id,
            @Valid @RequestBody CreateGroupLessonDto updateDto) {

        GroupLesson groupLesson = groupLessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Group lesson not found with id: " + id));

        User teacher = userService.findById(updateDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + updateDto.getTeacherId()));

        groupLesson.setTeacher(teacher);
        groupLesson.setLessonTopic(updateDto.getLessonTopic());
        groupLesson.setScheduledDate(updateDto.getScheduledDate());
        groupLesson.setScheduledTime(updateDto.getScheduledTime());
        groupLesson.setDurationMinutes(updateDto.getDurationMinutes());
        groupLesson.setMaxStudents(updateDto.getMaxStudents());
        groupLesson.setDescription(updateDto.getDescription());
        groupLesson.setMeetingLink(updateDto.getMeetingLink());

        GroupLesson updatedGroupLesson = groupLessonService.updateGroupLesson(groupLesson);
        return ResponseEntity.ok(convertToDto(updatedGroupLesson));
    }

    @DeleteMapping("/group-lessons/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteGroupLesson(@PathVariable Long id) {
        if (!groupLessonService.findById(id).isPresent()) {
            throw new RuntimeException("Group lesson not found with id: " + id);
        }
        groupLessonService.deleteGroupLesson(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/group-lessons/{id}/confirm")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<GroupLessonDto> confirmGroupLesson(@PathVariable Long id) {
        GroupLesson groupLesson = groupLessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Group lesson not found with id: " + id));

        groupLessonService.confirmLesson(groupLesson);
        return ResponseEntity.ok(convertToDto(groupLesson));
    }

    @PostMapping("/group-lessons/{id}/start")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<GroupLessonDto> startGroupLesson(@PathVariable Long id) {
        GroupLesson groupLesson = groupLessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Group lesson not found with id: " + id));

        groupLessonService.startLesson(groupLesson);
        return ResponseEntity.ok(convertToDto(groupLesson));
    }

    @PostMapping("/group-lessons/{id}/complete")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<GroupLessonDto> completeGroupLesson(@PathVariable Long id) {
        GroupLesson groupLesson = groupLessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Group lesson not found with id: " + id));

        groupLessonService.completeLesson(groupLesson);
        return ResponseEntity.ok(convertToDto(groupLesson));
    }

    @PostMapping("/group-lessons/{id}/cancel")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<GroupLessonDto> cancelGroupLesson(@PathVariable Long id) {
        GroupLesson groupLesson = groupLessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Group lesson not found with id: " + id));

        groupLessonService.cancelLesson(groupLesson);
        return ResponseEntity.ok(convertToDto(groupLesson));
    }

    @PostMapping("/group-lessons/{id}/postpone")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<GroupLessonDto> postponeGroupLesson(@PathVariable Long id) {
        GroupLesson groupLesson = groupLessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Group lesson not found with id: " + id));

        groupLessonService.postponeLesson(groupLesson);
        return ResponseEntity.ok(convertToDto(groupLesson));
    }

    @GetMapping("/teachers/{teacherId}/group-lessons/scheduled")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<GroupLessonDto>> getScheduledGroupLessonsForTeacher(@PathVariable Long teacherId) {
        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        List<GroupLesson> groupLessons = groupLessonService.findScheduledGroupLessonsByTeacherId(teacherId);
        List<GroupLessonDto> groupLessonDtos = groupLessons.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(groupLessonDtos);
    }

    @GetMapping("/students/{studentId}/group-lessons/scheduled")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<GroupLessonDto>> getScheduledGroupLessonsForStudent(@PathVariable Long studentId) {
        Student student = studentService.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        List<GroupLesson> groupLessons = groupLessonService.findScheduledGroupLessonsByStudentId(studentId);
        List<GroupLessonDto> groupLessonDtos = groupLessons.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(groupLessonDtos);
    }

    @GetMapping("/group-lessons/available")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<List<GroupLessonDto>> getAvailableGroupLessons(
            @RequestParam Long teacherId) {

        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        List<GroupLesson> groupLessons = groupLessonService.findAvailableGroupLessonsByTeacherId(teacherId);
        List<GroupLessonDto> groupLessonDtos = groupLessons.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(groupLessonDtos);
    }

    private GroupLessonDto convertToDto(GroupLesson groupLesson) {
        GroupLessonDto dto = new GroupLessonDto();
        dto.setId(groupLesson.getId());
        dto.setTeacherId(groupLesson.getTeacher().getId());
        dto.setTeacherName(groupLesson.getTeacher().getFirstName() + " " + groupLesson.getTeacher().getLastName());
        dto.setLessonTopic(groupLesson.getLessonTopic());
        dto.setScheduledDate(groupLesson.getScheduledDate());
        dto.setScheduledTime(groupLesson.getScheduledTime());
        dto.setDurationMinutes(groupLesson.getDurationMinutes());
        dto.setMaxStudents(groupLesson.getMaxStudents());
        dto.setCurrentStudents(groupLesson.getCurrentStudents());
        dto.setStatus(groupLesson.getStatus());
        dto.setDescription(groupLesson.getDescription());
        dto.setMeetingLink(groupLesson.getMeetingLink());
        if (groupLesson.getCreatedAt() != null) {
            dto.setCreatedAt(groupLesson.getCreatedAt().toString());
        }
        if (groupLesson.getUpdatedAt() != null) {
            dto.setUpdatedAt(groupLesson.getUpdatedAt().toString());
        }
        return dto;
    }
}