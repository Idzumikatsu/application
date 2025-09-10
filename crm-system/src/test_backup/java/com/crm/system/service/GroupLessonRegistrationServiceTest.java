package com.crm.system.service;

import com.crm.system.model.GroupLesson;
import com.crm.system.model.GroupLessonRegistration;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.model.GroupLesson.GroupLessonStatus;
import com.crm.system.model.GroupLessonRegistration.RegistrationStatus;
import com.crm.system.repository.GroupLessonRegistrationRepository;
import com.crm.system.repository.GroupLessonRepository;
import com.crm.system.repository.StudentRepository;
import com.crm.system.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class GroupLessonRegistrationServiceTest {

    @Mock
    private GroupLessonRegistrationRepository groupLessonRegistrationRepository;

    @Mock
    private GroupLessonRepository groupLessonRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GroupLessonRegistrationService groupLessonRegistrationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateRegistration() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.SCHEDULED);
        groupLesson.setMaxStudents(5);
        groupLesson.setCurrentStudents(2);

        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);

        when(groupLessonRegistrationRepository.save(any(GroupLessonRegistration.class))).thenReturn(registration);

        // When
        GroupLessonRegistration createdRegistration = groupLessonRegistrationService.createRegistration(groupLesson, student);

        // Then
        assertNotNull(createdRegistration);
        assertEquals(groupLesson.getId(), createdRegistration.getGroupLesson().getId());
        assertEquals(student.getId(), createdRegistration.getStudent().getId());
        assertEquals(RegistrationStatus.REGISTERED, createdRegistration.getRegistrationStatus());
        assertFalse(createdRegistration.getAttended());

        verify(groupLessonRegistrationRepository, times(1)).save(any(GroupLessonRegistration.class));
    }

    @Test
    void testFindById() {
        // Given
        Long registrationId = 1L;
        GroupLessonRegistration registration = new GroupLessonRegistration();
        registration.setId(registrationId);

        when(groupLessonRegistrationRepository.findById(registrationId)).thenReturn(Optional.of(registration));

        // When
        Optional<GroupLessonRegistration> foundRegistration = groupLessonRegistrationService.findById(registrationId);

        // Then
        assertTrue(foundRegistration.isPresent());
        assertEquals(registrationId, foundRegistration.get().getId());

        verify(groupLessonRegistrationRepository, times(1)).findById(registrationId);
    }

    @Test
    void testMarkAsAttended() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);

        Student student = new Student();
        student.setId(1L);

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);
        registration.setRegistrationStatus(RegistrationStatus.REGISTERED);

        when(groupLessonRegistrationRepository.save(any(GroupLessonRegistration.class)))
                .thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        groupLessonRegistrationService.markAsAttended(registration);

        // Then
        assertEquals(RegistrationStatus.ATTENDED, registration.getRegistrationStatus());
        assertTrue(registration.getAttended());

        verify(groupLessonRegistrationRepository, times(1)).save(any(GroupLessonRegistration.class));
    }

    @Test
    void testMarkAsMissed() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);

        Student student = new Student();
        student.setId(1L);

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);
        registration.setRegistrationStatus(RegistrationStatus.REGISTERED);

        when(groupLessonRegistrationRepository.save(any(GroupLessonRegistration.class)))
                .thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        groupLessonRegistrationService.markAsMissed(registration);

        // Then
        assertEquals(RegistrationStatus.MISSED, registration.getRegistrationStatus());
        assertFalse(registration.getAttended());

        verify(groupLessonRegistrationRepository, times(1)).save(any(GroupLessonRegistration.class));
    }

    @Test
    void testCancelRegistration() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);

        Student student = new Student();
        student.setId(1L);

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);
        registration.setRegistrationStatus(RegistrationStatus.REGISTERED);

        String reason = "Student requested cancellation";

        when(groupLessonRegistrationRepository.save(any(GroupLessonRegistration.class)))
                .thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        groupLessonRegistrationService.cancelRegistration(registration, reason);

        // Then
        assertEquals(RegistrationStatus.CANCELLED, registration.getRegistrationStatus());
        assertEquals(reason, registration.getCancellationReason());

        verify(groupLessonRegistrationRepository, times(1)).save(any(GroupLessonRegistration.class));
    }

    @Test
    void testIsRegistrationActive() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);

        Student student = new Student();
        student.setId(1L);

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);
        registration.setRegistrationStatus(RegistrationStatus.REGISTERED);

        // When
        boolean isActive = groupLessonRegistrationService.isRegistrationActive(registration);

        // Then
        assertTrue(isActive);
    }

    @Test
    void testHasRegistrationAttended() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);

        Student student = new Student();
        student.setId(1L);

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);
        registration.setRegistrationStatus(RegistrationStatus.ATTENDED);

        // When
        boolean hasAttended = groupLessonRegistrationService.hasRegistrationAttended(registration);

        // Then
        assertTrue(hasAttended);
    }

    @Test
    void testHasRegistrationMissed() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);

        Student student = new Student();
        student.setId(1L);

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);
        registration.setRegistrationStatus(RegistrationStatus.MISSED);

        // When
        boolean hasMissed = groupLessonRegistrationService.hasRegistrationMissed(registration);

        // Then
        assertTrue(hasMissed);
    }

    @Test
    void testIsRegistrationCancelled() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);

        Student student = new Student();
        student.setId(1L);

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);
        registration.setRegistrationStatus(RegistrationStatus.CANCELLED);

        // When
        boolean isCancelled = groupLessonRegistrationService.isRegistrationCancelled(registration);

        // Then
        assertTrue(isCancelled);
    }

    @Test
    void testBookSlot() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.SCHEDULED);
        groupLesson.setMaxStudents(5);
        groupLesson.setCurrentStudents(2);

        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);

        when(groupLessonRepository.findById(1L)).thenReturn(Optional.of(groupLesson));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(groupLessonRegistrationRepository.findByStudentIdAndGroupLessonId(1L, 1L)).thenReturn(Optional.empty());
        when(groupLessonRegistrationRepository.save(any(GroupLessonRegistration.class))).thenReturn(registration);

        // When
        GroupLessonRegistration bookedRegistration = groupLessonRegistrationService.bookSlot(groupLesson, student);

        // Then
        assertNotNull(bookedRegistration);
        assertEquals(groupLesson.getId(), bookedRegistration.getGroupLesson().getId());
        assertEquals(student.getId(), bookedRegistration.getStudent().getId());
        assertEquals(RegistrationStatus.REGISTERED, bookedRegistration.getRegistrationStatus());

        verify(groupLessonRegistrationRepository, times(1)).save(any(GroupLessonRegistration.class));
        verify(groupLessonRepository, times(1)).save(any(GroupLesson.class));
    }

    @Test
    void testCancelBooking() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setCurrentStudents(3);

        Student student = new Student();
        student.setId(1L);

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);
        registration.setRegistrationStatus(RegistrationStatus.REGISTERED);

        when(groupLessonRegistrationRepository.findById(1L)).thenReturn(Optional.of(registration));
        when(groupLessonRegistrationRepository.save(any(GroupLessonRegistration.class)))
                .thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        groupLessonRegistrationService.cancelBooking(1L, "Student requested cancellation");

        // Then
        assertEquals(RegistrationStatus.CANCELLED, registration.getRegistrationStatus());
        assertEquals("Student requested cancellation", registration.getCancellationReason());
        assertEquals(2, groupLesson.getCurrentStudents());

        verify(groupLessonRegistrationRepository, times(1)).save(any(GroupLessonRegistration.class));
        verify(groupLessonRepository, times(1)).save(any(GroupLesson.class));
    }

    @Test
    void testIsSlotBookedByStudent() {
        // Given
        Long groupLessonId = 1L;
        Long studentId = 1L;

        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(groupLessonId);

        Student student = new Student();
        student.setId(studentId);

        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        registration.setId(1L);
        registration.setRegistrationStatus(RegistrationStatus.REGISTERED);

        when(groupLessonRegistrationRepository.findByStudentIdAndGroupLessonId(studentId, groupLessonId))
                .thenReturn(Optional.of(registration));

        // When
        boolean isBooked = groupLessonRegistrationService.isSlotBookedByStudent(groupLessonId, studentId);

        // Then
        assertTrue(isBooked);
    }

    @Test
    void testIsSlotBookedByStudentWhenNotBooked() {
        // Given
        Long groupLessonId = 1L;
        Long studentId = 1L;

        when(groupLessonRegistrationRepository.findByStudentIdAndGroupLessonId(studentId, groupLessonId))
                .thenReturn(Optional.empty());

        // When
        boolean isBooked = groupLessonRegistrationService.isSlotBookedByStudent(groupLessonId, studentId);

        // Then
        assertFalse(isBooked);
    }
}